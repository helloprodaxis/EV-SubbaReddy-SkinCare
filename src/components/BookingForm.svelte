<script lang="ts">
  import { treatments } from "~/data/treatments";
  import { doctors } from "~/data/doctors";

  // Svelte 5 runes — $state for reactive values, $derived for computed.
  let name = $state("");
  let phone = $state("");
  let email = $state("");
  let preferredDoctor = $state("");
  let concern = $state("");
  let preferredDate = $state("");
  let preferredSlot = $state<"morning" | "evening">("morning");
  let notes = $state("");
  let consent = $state(false);

  type Status = "idle" | "submitting" | "success" | "error";
  let status = $state<Status>("idle");
  let errorMessage = $state("");

  let phoneOk = $derived(/^[+\d][\d\s\-]{8,}$/.test(phone.trim()));
  let canSubmit = $derived(
    name.trim().length > 1 &&
    phoneOk &&
    concern.length > 0 &&
    consent &&
    status !== "submitting",
  );

  // Min date = today (local).
  const today = new Date().toISOString().split("T")[0];

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    status = "submitting";
    errorMessage = "";

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name, phone, email, preferredDoctor, concern,
          preferredDate, preferredSlot, notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      status = "success";
    } catch (err) {
      status = "error";
      errorMessage = err instanceof Error ? err.message : "Something went wrong.";
    }
  }
</script>

<form on:submit={submit} class="space-y-7" novalidate>
  {#if status === "success"}
    <div
      class="rounded-2xl border border-[color-mix(in_oklab,var(--color-sage-deep)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-sage-soft)_25%,transparent)] p-8"
      role="status"
      aria-live="polite"
    >
      <p class="font-display text-2xl text-[var(--color-sage-deep)]">Request received.</p>
      <p class="mt-3 text-[var(--color-ink-soft)]">
        Our reception will call you on <strong>{phone}</strong> shortly to confirm your slot.
        For anything urgent, please call <a class="underline" href="tel:+919985845089">+91 99858 45089</a>.
      </p>
    </div>
  {:else}
    <div class="grid gap-5 md:grid-cols-2">
      <label class="block">
        <span class="eyebrow block mb-2">Full name *</span>
        <input
          type="text"
          required
          bind:value={name}
          autocomplete="name"
          class="form-field"
          placeholder="As on your ID"
        />
      </label>

      <label class="block">
        <span class="eyebrow block mb-2">Phone *</span>
        <input
          type="tel"
          required
          bind:value={phone}
          autocomplete="tel"
          class="form-field"
          placeholder="+91 98xxxxxxxx"
          aria-invalid={phone.length > 0 && !phoneOk}
        />
        {#if phone.length > 0 && !phoneOk}
          <span class="text-xs text-[var(--color-clay-deep)] mt-1 block">Enter a valid phone number.</span>
        {/if}
      </label>
    </div>

    <label class="block">
      <span class="eyebrow block mb-2">Email (optional)</span>
      <input
        type="email"
        bind:value={email}
        autocomplete="email"
        class="form-field"
        placeholder="for appointment confirmation"
      />
    </label>

    <label class="block">
      <span class="eyebrow block mb-2">What would you like help with? *</span>
      <select required bind:value={concern} class="form-field">
        <option value="" disabled>Select a concern</option>
        <option value="general-consult">General skin consultation</option>
        {#each treatments as t}
          <option value={t.slug}>{t.title}</option>
        {/each}
        <option value="other">Other / not sure</option>
      </select>
    </label>

    <div class="grid gap-5 md:grid-cols-2">
      <label class="block">
        <span class="eyebrow block mb-2">Preferred doctor</span>
        <select bind:value={preferredDoctor} class="form-field">
          <option value="">No preference</option>
          {#each doctors as d}
            <option value={d.slug}>{d.name}</option>
          {/each}
        </select>
      </label>

      <label class="block">
        <span class="eyebrow block mb-2">Preferred date</span>
        <input
          type="date"
          bind:value={preferredDate}
          min={today}
          class="form-field"
        />
      </label>
    </div>

    <fieldset>
      <legend class="eyebrow block mb-3">Preferred time</legend>
      <div class="grid grid-cols-2 gap-3">
        {#each [{ id: "morning", label: "Morning", time: "9:30 – 1:30" }, { id: "evening", label: "Evening", time: "5:00 – 8:00" }] as slot}
          <label
            class="cursor-pointer rounded-2xl border p-5 transition-all"
            class:border-[var(--color-clay-deep)]={preferredSlot === slot.id}
            class:bg-[var(--color-cream-warm)]={preferredSlot === slot.id}
            class:border-[color-mix(in_oklab,var(--color-ink)_15%,transparent)]={preferredSlot !== slot.id}
          >
            <input
              type="radio"
              name="slot"
              value={slot.id}
              bind:group={preferredSlot}
              class="sr-only"
            />
            <span class="font-display text-xl block">{slot.label}</span>
            <span class="text-xs uppercase tracking-[0.16em] text-[var(--color-ink-muted)] mt-1 block">
              {slot.time}
            </span>
          </label>
        {/each}
      </div>
    </fieldset>

    <label class="block">
      <span class="eyebrow block mb-2">Anything else?</span>
      <textarea
        bind:value={notes}
        rows="3"
        class="form-field resize-none"
        placeholder="Allergies, current medication, photos to share — anything we should know."
      ></textarea>
    </label>

    <label class="flex items-start gap-3 text-sm text-[var(--color-ink-soft)]">
      <input type="checkbox" bind:checked={consent} class="mt-1 accent-[var(--color-clay-deep)]" />
      <span>
        I consent to being contacted by the clinic on the number provided to confirm my appointment.
      </span>
    </label>

    {#if status === "error"}
      <div
        class="rounded-xl border border-[var(--color-clay-deep)] bg-[color-mix(in_oklab,var(--color-rose)_50%,transparent)] p-4 text-sm text-[var(--color-clay-deep)]"
        role="alert"
      >
        {errorMessage || "Something went wrong. Please try again or call us directly."}
      </div>
    {/if}

    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
      <button
        type="submit"
        disabled={!canSubmit}
        class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Request Appointment"}
        {#if status !== "submitting"}<span class="arrow" aria-hidden="true">→</span>{/if}
      </button>
      <p class="text-xs text-[var(--color-ink-muted)]">
        Or call directly — <a href="tel:+919985845089" class="underline">+91 99858 45089</a>
      </p>
    </div>
  {/if}
</form>

<style>
  /* Scoped to the form so we don't pollute the rest of the site. */
  .form-field {
    width: 100%;
    background-color: var(--color-paper);
    border: 1px solid color-mix(in oklab, var(--color-ink) 14%, transparent);
    border-radius: 0.875rem;
    padding: 0.95rem 1.1rem;
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--color-ink);
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }
  .form-field::placeholder { color: var(--color-ink-muted); }
  .form-field:focus {
    outline: none;
    border-color: var(--color-clay-deep);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-clay) 22%, transparent);
  }
  .form-field[aria-invalid="true"] {
    border-color: var(--color-clay-deep);
  }
</style>
