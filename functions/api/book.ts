/**
 * Cloudflare Pages Function — POST /api/book
 *
 * Accepts the booking form payload, validates it, and emails the clinic via
 * Resend. Returns 200 on success, 4xx on validation failure, 5xx on Resend error.
 *
 * Env vars (set in Cloudflare Pages → Settings → Environment Variables):
 *   RESEND_API_KEY      — required
 *   BOOKING_TO_EMAIL    — clinic inbox (defaults to appointments@drsubbareddyskin.in)
 *   BOOKING_FROM_EMAIL  — verified Resend sender (defaults to bookings@drsubbareddyskin.in)
 */

interface Env {
  RESEND_API_KEY: string;
  BOOKING_TO_EMAIL?: string;
  BOOKING_FROM_EMAIL?: string;
}

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
    v ? `<tr><td style="padding:6px 12px;color:#7a6e60;font:500 12px/1 'Inter',sans-serif;text-transform:uppercase;letter-spacing:.12em;">${k}</td><td style="padding:6px 12px;color:#2a2520;font:400 15px/1.5 'Inter',sans-serif;">${escapeHtml(v)}</td></tr>`
      : "";

  return `<!doctype html>
<html><body style="margin:0;background:#f7f1e8;padding:32px;font-family:'Inter',Arial,sans-serif;">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fdfaf4;border-radius:16px;overflow:hidden;">
    <tr><td style="padding:32px 32px 8px;">
      <p style="margin:0;color:#a85f44;font-size:11px;letter-spacing:.22em;text-transform:uppercase;">New booking request</p>
      <h1 style="margin:8px 0 0;font:300 28px/1.1 Georgia,serif;color:#2a2520;letter-spacing:-0.02em;">
        ${escapeHtml(b.name)}
      </h1>
    </td></tr>
    <tr><td style="padding:8px 32px 32px;">
      <table role="presentation" width="100%" style="border-top:1px solid #ece0cd;border-bottom:1px solid #ece0cd;">
        ${row("Phone", b.phone)}
        ${row("Email", b.email)}
        ${row("Concern", b.concern)}
        ${row("Doctor", b.preferredDoctor)}
        ${row("Date", b.preferredDate)}
        ${row("Slot", b.preferredSlot)}
      </table>
      ${b.notes ? `<div style="margin-top:24px;padding:18px;background:#f2e9da;border-radius:12px;color:#4a3f35;font-size:14px;line-height:1.6;"><strong style="display:block;color:#a85f44;font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px;">Notes</strong>${escapeHtml(b.notes).replace(/\n/g, "<br>")}</div>` : ""}
      <p style="margin:24px 0 0;font-size:12px;color:#7a6e60;">Submitted from drsubbareddyskin.in · ${new Date().toISOString()}</p>
    </td></tr>
  </table>
</body></html>`;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: unknown;
  try {
    body = await ctx.request.json();
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

  if (!ctx.env.RESEND_API_KEY) {
    // Fail soft in dev — log to console so the form still feels responsive.
    console.warn("[/api/book] RESEND_API_KEY not set. Booking payload:", v.data);
    return new Response(JSON.stringify({ ok: true, dev: true }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }

  const to = ctx.env.BOOKING_TO_EMAIL ?? "appointments@drsubbareddyskin.in";
  const from = ctx.env.BOOKING_FROM_EMAIL ?? "bookings@drsubbareddyskin.in";

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${ctx.env.RESEND_API_KEY}`,
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
