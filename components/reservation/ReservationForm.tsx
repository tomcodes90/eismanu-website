"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays, format } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { createReservation } from "@/lib/reservation";
import type { ReservationFormData } from "@/types";

const TIME_SLOTS = [
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

const SEATING_OPTIONS = [
  { value: "TERRACE", label: "Terrasse" },
  { value: "INSIDE", label: "Innenraum" },
  { value: "OTHER", label: "Sonstige Präferenz" },
] as const;

const schema = z.object({
  firstName: z.string().min(2, "Mindestens 2 Zeichen"),
  lastName: z.string().min(2, "Mindestens 2 Zeichen"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z
    .string()
    .min(6, "Mindestens 6 Zeichen")
    .regex(/^[\d\s+\-()/]{6,30}$/, "Bitte eine gültige Telefonnummer eingeben"),
  date: z
    .string()
    .min(1, "Bitte Datum wählen")
    .refine((d) => d > format(new Date(), "yyyy-MM-dd"), {
      message: "Bitte mindestens einen Tag im Voraus buchen",
    })
    .refine((d) => d <= format(addDays(new Date(), 30), "yyyy-MM-dd"), {
      message: "Maximal 30 Tage im Voraus buchbar",
    }),
  timeSlot: z
    .string()
    .refine((t) => TIME_SLOTS.includes(t), { message: "Bitte Uhrzeit wählen" }),
  guests: z
    .number()
    .int()
    .min(1, "Mindestens 1 Person")
    .max(20, "Maximal 20 Personen"),
  seatingPreference: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(["TERRACE", "INSIDE", "OTHER"]).optional(),
  ),
  notes: z.string().max(500, "Maximal 500 Zeichen").optional(),
});

type FormValues = z.infer<typeof schema>;

type Status = "idle" | "loading" | "success" | "error";

export function ReservationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [today, setToday] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setToday(format(addDays(new Date(), 1), "yyyy-MM-dd"));
    setMaxDate(format(addDays(new Date(), 30), "yyyy-MM-dd"));
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { guests: 2 },
  });

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    setErrorMsg("");
    try {
      await createReservation(values as ReservationFormData);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center text-center py-6 gap-4"
      >
        <div className="w-14 h-14 rounded-full bg-brand-green-light flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-7 h-7 text-brand-green"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="font-kaushan text-2xl text-brand-dark outline-none"
        >
          Reservierung bestätigt!
        </h3>
        <p className="font-nunito text-sm text-brand-mid max-w-xs">
          Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details und
          einem Stornierungslink.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="reservation-form-title"
      className="space-y-5"
      noValidate
    >
      {/* Error banner */}
      {status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-xl bg-brand-red-light border border-brand-red/20 px-4 py-3 font-nunito text-sm text-brand-red"
        >
          {errorMsg ||
            "Die Reservierung konnte nicht abgeschickt werden. Bitte versuchen Sie es erneut."}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block font-kaushan text-sm text-brand-dark mb-1"
          >
            Vorname{" "}
            <span aria-hidden="true" className="text-brand-red">
              *
            </span>
          </label>
          <input
            id="firstName"
            {...register("firstName")}
            type="text"
            autoComplete="given-name"
            required
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            placeholder="Max"
          />
          {errors.firstName && (
            <p
              id="firstName-error"
              role="alert"
              className="mt-1 font-nunito text-xs text-brand-red"
            >
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block font-kaushan text-sm text-brand-dark mb-1"
          >
            Nachname{" "}
            <span aria-hidden="true" className="text-brand-red">
              *
            </span>
          </label>
          <input
            id="lastName"
            {...register("lastName")}
            type="text"
            autoComplete="family-name"
            required
            aria-required="true"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            placeholder="Mustermann"
          />
          {errors.lastName && (
            <p
              id="lastName-error"
              role="alert"
              className="mt-1 font-nunito text-xs text-brand-red"
            >
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block font-kaushan text-sm text-brand-dark mb-1"
        >
          E-Mail{" "}
          <span aria-hidden="true" className="text-brand-red">
            *
          </span>
        </label>
        <input
          id="email"
          {...register("email")}
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          placeholder="max@beispiel.de"
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-1 font-nunito text-xs text-brand-red"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block font-kaushan text-sm text-brand-dark mb-1"
        >
          Telefon{" "}
          <span aria-hidden="true" className="text-brand-red">
            *
          </span>
        </label>
        <input
          id="phone"
          {...register("phone")}
          type="tel"
          autoComplete="tel"
          required
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          placeholder="+49 123 456789"
        />
        {errors.phone && (
          <p
            id="phone-error"
            role="alert"
            className="mt-1 font-nunito text-xs text-brand-red"
          >
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Date + Guests row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="date"
            className="block font-kaushan text-sm text-brand-dark mb-1"
          >
            Datum{" "}
            <span aria-hidden="true" className="text-brand-red">
              *
            </span>
          </label>
          <input
            id="date"
            {...register("date")}
            type="date"
            min={today}
            max={maxDate}
            required
            aria-required="true"
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "date-error" : undefined}
            autoComplete="off"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
          {errors.date && (
            <p
              id="date-error"
              role="alert"
              className="mt-1 font-nunito text-xs text-brand-red"
            >
              {errors.date.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="guests"
            className="block font-kaushan text-sm text-brand-dark mb-1"
          >
            Personen{" "}
            <span aria-hidden="true" className="text-brand-red">
              *
            </span>
          </label>
          <div className="relative">
            <select
              id="guests"
              {...register("guests", { valueAsNumber: true })}
              required
              aria-required="true"
              aria-invalid={!!errors.guests}
              aria-describedby={errors.guests ? "guests-error" : undefined}
              className="w-full appearance-none rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Person" : "Personen"}
                </option>
              ))}
            </select>
            <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          {errors.guests && (
            <p
              id="guests-error"
              role="alert"
              className="mt-1 font-nunito text-xs text-brand-red"
            >
              {errors.guests.message}
            </p>
          )}
        </div>
      </div>

      {/* Time slot */}
      <div>
        <label
          htmlFor="timeSlot"
          className="block font-kaushan text-sm text-brand-dark mb-1"
        >
          Uhrzeit{" "}
          <span aria-hidden="true" className="text-brand-red">
            *
          </span>
        </label>
        <div className="relative">
          <select
            id="timeSlot"
            {...register("timeSlot")}
            required
            aria-required="true"
            aria-invalid={!!errors.timeSlot}
            aria-describedby={errors.timeSlot ? "timeSlot-error" : undefined}
            className="w-full appearance-none rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white"
            defaultValue=""
          >
            <option value="" disabled>
              Uhrzeit wählen…
            </option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t} Uhr
              </option>
            ))}
          </select>
          <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
        {errors.timeSlot && (
          <p
            id="timeSlot-error"
            role="alert"
            className="mt-1 font-nunito text-xs text-brand-red"
          >
            {errors.timeSlot.message}
          </p>
        )}
      </div>

      {/* Seating preference */}
      <div>
        <label
          htmlFor="seatingPreference"
          className="block font-kaushan text-sm text-brand-dark mb-1"
        >
          Sitzplatzpräferenz{" "}
          <span className="font-nunito text-xs text-brand-mid">(optional)</span>
        </label>
        <div className="relative">
          <select
            id="seatingPreference"
            {...register("seatingPreference")}
            className="w-full appearance-none rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white"
            defaultValue=""
          >
            <option value="">Keine Präferenz</option>
            {SEATING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block font-kaushan text-sm text-brand-dark mb-1"
        >
          Anmerkungen{" "}
          <span className="font-nunito text-xs text-brand-mid">(optional)</span>
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          maxLength={500}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
          placeholder="Allergien, besondere Wünsche…"
        />
        {errors.notes && (
          <p
            id="notes-error"
            role="alert"
            className="mt-1 font-nunito text-xs text-brand-red"
          >
            {errors.notes.message}
          </p>
        )}
      </div>

      <p className="font-nunito text-xs text-brand-mid">
        <span aria-hidden="true" className="text-brand-red">
          *
        </span>{" "}
        Pflichtfeld
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-teal w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Wird gesendet…" : "Tisch reservieren"}
      </button>
    </form>
  );
}
