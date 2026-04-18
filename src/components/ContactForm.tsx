import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, AlertCircle } from "lucide-react";

const ENQUIRY_TYPES = ["Buy", "Sell", "Rent", "Investment", "General"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a valid phone number").optional().or(z.literal("")),
  enquiry: z.enum(ENQUIRY_TYPES, { message: "Select an enquiry type" }),
  budget: z.string().optional(),
  message: z.string().trim().min(20, "Please share a few more details (min 20 characters)").max(2000, "Message is too long"),
  consent: z.literal(true, { message: "Please accept to be contacted" }),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (values: FormValues) => {
    // Simulated submission — in production, wire to your endpoint
    await new Promise((r) => setTimeout(r, 900));
    void values;
    setSent(true);
    reset();
  };

  const messageLen = watch("message")?.length ?? 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 shadow-luxe md:p-12 grain">
      <div className="absolute inset-0 bg-mesh opacity-50" />

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex min-h-[420px] flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold"
            >
              <Check className="h-9 w-9" strokeWidth={2.5} />
            </motion.div>
            <h3 className="font-display text-4xl text-cream md:text-5xl">Thank you</h3>
            <p className="mt-4 max-w-md text-cream/70">
              Your enquiry has been received. A senior advisor will be in touch within one business day.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="relative space-y-6"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Make an enquiry</p>
              <h3 className="mt-1 font-display text-3xl text-cream md:text-4xl">Speak with an advisor</h3>
              <p className="mt-2 text-sm text-muted-foreground">All enquiries are handled with discretion.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name?.message} touched={!!touchedFields.name}>
                <input id="name" type="text" autoComplete="name" {...register("name")} className={inputCls(!!errors.name)} placeholder="Jane Whitmore" />
              </Field>
              <Field id="email" label="Email" error={errors.email?.message} touched={!!touchedFields.email}>
                <input id="email" type="email" autoComplete="email" {...register("email")} className={inputCls(!!errors.email)} placeholder="jane@example.com" />
              </Field>
              <Field id="phone" label="Phone (optional)" error={errors.phone?.message} touched={!!touchedFields.phone}>
                <input id="phone" type="tel" autoComplete="tel" {...register("phone")} className={inputCls(!!errors.phone)} placeholder="+1 (310) 555-0182" />
              </Field>
              <Field id="enquiry" label="Enquiry type" error={errors.enquiry?.message} touched={!!touchedFields.enquiry}>
                <div className="relative">
                  <select id="enquiry" {...register("enquiry")} defaultValue="" className={`${inputCls(!!errors.enquiry)} appearance-none pr-10`}>
                    <option value="" disabled className="bg-charcoal">Select an option</option>
                    {ENQUIRY_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-charcoal">{t}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cream/60">▾</span>
                </div>
              </Field>
              <Field id="budget" label="Budget (optional)" error={errors.budget?.message} touched={!!touchedFields.budget} className="md:col-span-2">
                <input id="budget" type="text" {...register("budget")} className={inputCls(false)} placeholder="e.g. $5M – $15M" />
              </Field>
            </div>

            <Field id="message" label="How can we help?" error={errors.message?.message} touched={!!touchedFields.message}>
              <textarea
                id="message"
                rows={5}
                {...register("message")}
                className={`${inputCls(!!errors.message)} resize-none`}
                placeholder="Tell us about the residence, neighborhood or investment you have in mind…"
              />
              <div className="mt-1 flex justify-end text-[10px] uppercase tracking-wider text-muted-foreground">
                {messageLen}/2000
              </div>
            </Field>

            <label className="flex items-start gap-3 text-xs text-cream/70">
              <input type="checkbox" {...register("consent")} className="mt-0.5 h-4 w-4 accent-[var(--gold)]" />
              <span>
                I consent to LUXESTATE contacting me regarding my enquiry. I have read the{" "}
                <a className="text-gold underline-offset-4 hover:underline" href="#">privacy notice</a>.
              </span>
            </label>
            {errors.consent && (
              <p className="-mt-3 flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />{errors.consent.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-shimmer relative inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              <span className="relative z-10">{isSubmitting ? "Sending…" : "Send enquiry"}</span>
              {!isSubmitting && <Send className="relative z-10 h-4 w-4" />}
            </button>

            {!isValid && Object.keys(errors).length > 0 && (
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Please complete the highlighted fields above.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border bg-charcoal/40 px-4 py-3 text-sm text-cream placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
    hasError
      ? "border-destructive/70 focus:border-destructive focus:ring-destructive/40"
      : "border-border focus:border-gold focus:ring-gold/40"
  }`;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Field({ id, label, error, children, className = "" }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive"
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
