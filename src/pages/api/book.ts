/**
 * POST /api/book — Astro API endpoint, runs as a Vercel serverless function.
 *
 * Validates the booking form payload and emails the clinic via Resend.
 * Returns 200 on success, 4xx on validation failure, 5xx on Resend error.
 *
 * Env vars (set in Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY      — required
 *   BOOKING_TO_EMAIL    — clinic inbox (defaults to appointments@drsubbareddyskin.in)
 *   BOOKING_FROM_EMAIL  — verified Resend sender (defaults to bookings@drsubbareddyskin.in)
 */

import type { APIRoute } from "astro";

// Force this route to be SSR (the rest of the site is prerendered).
export const prerender = false;

interface Booking {
  name: string;
  phone: string;
  email?: string;
  preferredDoctor?: string;
  concern: string;
  preferredDate?: string;
  preferredSlot?: "morning" | "evening";
  notes?: string;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );

function validate(b: unknown): { ok: true; data: Booking } | { ok: false; error: string } {
  if (!b || typeof b !== "object") return { ok: false, error: "Invalid payload." };
  const x = b as Record<string, unknown>;

  const name = String(x.name ?? "").trim();
  const phone = String(x.phone ?? "").trim();
  const concern = String(x.concern ?? "").trim();

  if (name.length < 2)  return { ok: false, error: "Name is required." };
  if (!/^[+\d][\d\s\-]{8,}$/.test(phone))
                       return { ok: false, error: "Valid phone number is required." };
  if (!concern)         return { ok: false, error: "Concern is required." };

  return {
    ok: true,
    data: {
      name,
      phone,
      email: typeof x.email === "string" ? x.email.trim() : undefined,
      preferredDoctor: typeof x.preferredDoctor === "string" ? x.preferredDoctor : undefined,
      concern,
      preferredDate: typeof x.preferredDate === "string" ? x.preferredDate : undefined,
      preferredSlot: x.preferredSlot === "morning" || x.preferredSlot === "evening"
        ? x.preferredSlot
        : undefined,
      notes: typeof x.notes === "string" ? x.notes.trim().slice(0, 1000) : undefined,
    },
  };
}

function renderEmail(b: Booking): string {
  const row = (k: string, v: string | undefined) =>
    v ? `<tr><td style="padding:6px 12px;color:#7a8590;font:700 11px/1 'Lato',sans-serif;text-transform:uppercase;letter-spacing:.18em;">${k}</td><td style="padding:6px 12px;color:#1a2530;font:400 15px/1.5 'Lato',sans-serif;">${escapeHtml(v)}</td></tr>`
      : "";

  return `<!doctype html>
<html><body style="margin:0;background:#fdfaf7;padding:32px;font-family:'Lato',Arial,sans-serif;">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
    <tr><td style="padding:32px 32px 8px;">
      <p style="margin:0;color:#c97583;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:700;">New booking request</p>
      <h1 style="margin:8px 0 0;font:300 28px/1.1 'Poppins',Georgia,serif;color:#1a2530;letter-spacing:-0.02em;">
        ${escapeHtml(b.name)}
      </h1>
    </td></tr>
    <tr><td style="padding:8px 32px 32px;">
      <table role="presentation" width="100%" style="border-top:1px solid #f3cdce;border-bottom:1px solid #f3cdce;">
        ${row("Phone", b.phone)}
        ${row("Email", b.email)}
        ${row("Concern", b.concern)}
        ${row("Doctor", b.preferredDoctor)}
        ${row("Date", b.preferredDate)}
        ${row("Slot", b.preferredSlot)}
      </table>
      ${b.notes ? `<div style="margin-top:24px;padding:18px;background:#dce7ee;border-radius:12px;color:#2a3741;font-size:14px;line-height:1.6;"><strong style="display:block;color:#c97583;font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px;">Notes</strong>${escapeHtml(b.notes).replace(/\n/g, "<br>")}</div>` : ""}
      <p style="margin:24px 0 0;font-size:12px;color:#7a8590;">Submitted from drsubbareddyskin.in · ${new Date().toISOString()}</p>
    </td></tr>
  </table>
</body></html>`;
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), {
      status: 400, headers: { "content-type": "application/json" },
    });
  }

  const v = validate(body);
  if (!v.ok) {
    return new Response(JSON.stringify({ error: v.error }), {
      status: 400, headers: { "content-type": "application/json" },
    });
  }

  const apiKey = process.env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev fallback — no email, but UX still feels responsive.
    console.warn("[/api/book] RESEND_API_KEY not set. Booking payload:", v.data);
    return new Response(JSON.stringify({ ok: true, dev: true }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }

  const to = process.env.BOOKING_TO_EMAIL ?? "appointments@drsubbareddyskin.in";
  const from = process.env.BOOKING_FROM_EMAIL ?? "bookings@drsubbareddyskin.in";

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: `Subba Reddy Skin <${from}>`,
      to: [to],
      reply_to: v.data.email || undefined,
      subject: `New booking — ${v.data.name} (${v.data.concern})`,
      html: renderEmail(v.data),
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    console.error("[/api/book] Resend error:", resp.status, detail);
    return new Response(JSON.stringify({ error: "Could not send the request. Please call us." }), {
      status: 502, headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "content-type": "application/json" },
  });
};
