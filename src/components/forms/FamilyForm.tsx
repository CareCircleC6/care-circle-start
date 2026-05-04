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
  relationship: z.string().min(1, "Relationship is required"),
  patientName: z.string().min(2, "Patient name is required"),
  patientDob: z.string().min(1, "Patient date of birth is required"),
  patientCity: z.string().min(1, "Patient city is required"),
  patientConditions: z.string().optional(),
  patientMedications: z.string().optional(),
});

type FamilyData = z.infer<typeof schema>;

export function FamilyForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FamilyData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FamilyData) => {
    console.log("Family signup:", data);
    await new Promise(r => setTimeout(r, 800));
    onSuccess();
  };

  const inputClass = "w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Family Coordinator Signup</h2>

      <FormField label="Your Full Name" error={errors.fullName?.message} required>
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

      <FormField label="Relationship to Patient" error={errors.relationship?.message} required>
        <select {...register("relationship")} className={inputClass}>
          <option value="">Select…</option>
          <option value="daughter">Daughter</option>
          <option value="son">Son</option>
          <option value="spouse">Spouse</option>
          <option value="sibling">Sibling</option>
          <option value="other">Other</option>
        </select>
      </FormField>

      <div className="pt-2 pb-1">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Patient Information</p>
      </div>

      <FormField label="Patient Full Name" error={errors.patientName?.message} required>
        <input {...register("patientName")} className={inputClass} placeholder="Patient's full name" />
      </FormField>

      <FormField label="Patient Date of Birth" error={errors.patientDob?.message} required>
        <input {...register("patientDob")} type="date" className={inputClass} />
      </FormField>

      <FormField label="Patient City" error={errors.patientCity?.message} required>
        <input {...register("patientCity")} className={inputClass} placeholder="Where the patient lives" />
      </FormField>

      <FormField label="Patient Conditions">
        <input {...register("patientConditions")} className={inputClass} placeholder="Optional - can be added later" />
      </FormField>

      <FormField label="Patient Medications">
        <textarea {...register("patientMedications")} className={inputClass + " h-auto py-3 min-h-[80px] resize-y"} placeholder="Optional - can be added later" />
      </FormField>

      <Button type="submit" variant="hero" size="xl" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}