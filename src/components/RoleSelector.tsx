import type { UserRole } from "./SignupModal";

const roles = [
  {
    id: "patient" as const,
    title: "I am the Patient",
    description: "Set up care for myself",
    icon: "🫀",
  },
  {
    id: "family" as const,
    title: "I am a Family Member",
    description: "Coordinate care for a parent remotely",
    icon: "👨‍👩‍👧",
  },
  {
    id: "professional" as const,
    title: "I am a Professional",
    description: "Register as a nurse or care manager",
    icon: "🩺",
  },
];

export function RoleSelector({ onSelect }: { onSelect: (role: NonNullable<UserRole>) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>
        How will you use Care Circle Global?
      </h2>
      <p className="text-muted-foreground mb-6">Choose the option that best describes you.</p>
      <div className="space-y-3">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
          >
            <span className="text-3xl">{role.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{role.title}</p>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-foreground group-hover:text-primary transition-colors">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}