import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PatientForm } from "@/components/forms/PatientForm";
import { FamilyForm } from "@/components/forms/FamilyForm";
import { ProfessionalForm } from "@/components/forms/ProfessionalForm";
import logoImage from "@/assets/logo-new.png";

export const Route = createFileRoute("/complete-profile")({
  head: () => ({
    meta: [
      { title: "Complete Your Profile — Care Circle Global" },
      { name: "description", content: "Finish setting up your Care Circle Global account so your care team has the details they need to coordinate effectively." },
      { property: "og:title", content: "Complete Your Profile — Care Circle Global" },
      { property: "og:description", content: "Finish setting up your Care Circle Global account so your care team has the details they need to coordinate effectively." },
      { property: "og:url", content: "https://carecircleglobal.com/complete-profile" },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "canonical", href: "https://carecircleglobal.com/complete-profile" },
    ],
  }),
  component: CompleteProfilePage,
});

function CompleteProfilePage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }
      setUserId(user.id);

      // Check if profile already completed
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, profile_completed")
        .eq("user_id", user.id)
        .single();

      if (profile?.profile_completed) {
        navigate({ to: "/" });
        return;
      }

      setRole(profile?.role || user.user_metadata?.role || null);
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleSuccess = async () => {
    if (userId) {
      await supabase
        .from("profiles")
        .update({ profile_completed: true })
        .eq("user_id", userId);
    }
    navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img src={logoImage} alt="Care Circle Global" className="h-14 w-14 mb-4" />
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground mt-1 text-center">
            Fill in your details to finish setting up your account.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          {role === "patient" ? (
            <PatientForm onSuccess={handleSuccess} />
          ) : role === "family" ? (
            <FamilyForm onSuccess={handleSuccess} />
          ) : role === "professional" ? (
            <ProfessionalForm onSuccess={handleSuccess} />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Unable to determine your role. Please contact support.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}