import { type ReactNode } from "react";
import { Construction } from "lucide-react";

export function ComingSoon({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
