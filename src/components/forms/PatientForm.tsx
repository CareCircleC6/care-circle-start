import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dob: z.string().min(1, "Date of birth is required"),
  city: z.string().min(1, "City is required"),
  gender: z.string().optional(),
  conditions: z.string().optional(),
  addFamily: z.boolean().optional(),
  familyName: z.string().optional(),
  familyContact: z.string().optional(),
});

type PatientData = z.infer<typeof schema>;

export function PatientForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<PatientData>({
    resolver: zodResolver(schema),
  });

  const addFamily = watch("addFamily");

  const onSubmit = async (data: PatientData) => {
    console.log("Patient signup:", data);
    await new Promise(r => setTimeout(r, 800));
    onSuccess();
  };

  const inputClass = "w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Patient Signup</h2>

      <FormField label="Full Name" error={errors.fullName?.message} required>
        <input {...register("fullName")} className={inputClass} placeholder="Your full name" />
      </FormField>

      <FormField label="Email" error={errors.email?.message} required>
        <input {...register("email")} type="email" className={inputClass} placeholder="you@example.com" />
      </FormField>

      <FormField label="Phone" error={errors.phone?.message} required>
        <input {...register("phone")} type="tel" className={inputClass} placeholder="+1 (555) 000-0000" />
      </FormField>

      <FormField label="Password" error={errors.password?.message} required>
        <div className="relative">
          <input {...register("password")} type={showPassword ? "text" : "password"} className={inputClass} placeholder="Min 8 characters" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm hover:text-foreground">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </FormField>

      <FormField label="Date of Birth" error={errors.dob?.message} required>
        <input {...register("dob")} type="date" className={inputClass} />
      </FormField>

      <FormField label="City" error={errors.city?.message} required>
        <input {...register("city")} className={inputClass} placeholder="Your city" />
      </FormField>

      <FormField label="Gender" error={errors.gender?.message}>
        <select {...register("gender")} className={inputClass}>
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nonbinary">Non-binary</option>
        </select>
      </FormField>

      <FormField label="Known Conditions" error={errors.conditions?.message}>
        <input {...register("conditions")} className={inputClass} placeholder="E.g. diabetes, hypertension (optional)" />
      </FormField>

      <div className="flex items-center gap-3 py-2">
        <input {...register("addFamily")} type="checkbox" id="addFamily" className="w-5 h-5 rounded border-input accent-primary" />
        <label htmlFor="addFamily" className="text-sm text-foreground">Add a family member now?</label>
      </div>

      {addFamily && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <FormField label="Family Member Name">
            <input {...register("familyName")} className={inputClass} placeholder="Their name" />
          </FormField>
          <FormField label="Family Member Email or Phone">
            <input {...register("familyContact")} className={inputClass} placeholder="Email or phone" />
          </FormField>
        </div>
      )}

      <Button type="submit" variant="hero" size="xl" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}