import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  country: z.string().min(1, "Country is required"),
  role: z.string().min(1, "Role is required"),
  experience: z.string().min(1, "Years of experience is required"),
  city: z.string().min(1, "City is required"),
  languages: z.string().min(1, "At least one language is required"),
});

type ProfessionalData = z.infer<typeof schema>;

export function ProfessionalForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfessionalData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ProfessionalData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        phone: data.phone,
        country: data.country,
        city: data.city,
        languages: data.languages,
        professional_role: data.role,
        experience_years: parseInt(data.experience, 10),
        profile_completed: true,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Profile update error:", error);
      return;
    }
    onSuccess();
  };

  const inputClass = "w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Professional Coordinator Signup</h2>

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

      <FormField label="Country" error={errors.country?.message} required>
        <select {...register("country")} className={inputClass}>
          <option value="">Select country…</option>
          <option value="india">India</option>
          <option value="usa">USA</option>
        </select>
      </FormField>

      <FormField label="Role" error={errors.role?.message} required>
        <select {...register("role")} className={inputClass}>
          <option value="">Select…</option>
          <option value="care_coordinator">Care Coordinator</option>
          <option value="navigator">Navigator</option>
          <option value="care_advocate">Care Advocate</option>
        </select>
      </FormField>

      <FormField label="Years of Experience" error={errors.experience?.message} required>
        <input {...register("experience")} type="number" min="0" className={inputClass} placeholder="e.g. 5" />
      </FormField>

      <FormField label="City / Region" error={errors.city?.message} required>
        <input {...register("city")} className={inputClass} placeholder="Your city or region" />
      </FormField>

      <FormField label="Languages Spoken" error={errors.languages?.message} required>
        <input {...register("languages")} className={inputClass} placeholder="e.g. English, Arabic, Hindi" />
      </FormField>

      <Button type="submit" variant="hero" size="xl" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create Account"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        After signup, you'll complete identity verification and onboarding before being matched with patients.
      </p>
    </form>
  );
}