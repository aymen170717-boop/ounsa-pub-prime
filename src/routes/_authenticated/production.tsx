import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ComingSoon } from "@/components/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/production")({
  head: () => ({ meta: [{ title: "Production — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    const cols: { key: string; label: string; color: string }[] = [
      { key: "new", label: "Nouvelle", color: "bg-muted" },
      { key: "design", label: "Conception", color: "bg-chart-3/20" },
      { key: "production", label: "Production", color: "bg-chart-4/20" },
      { key: "ready", label: "Prête", color: "bg-success/20" },
      { key: "delivered", label: "Livrée", color: "bg-chart-2/20" },
    ];
    return (
      <AppShell title={t("production")}>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {cols.map(c => (
            <div key={c.key} className="glass rounded-2xl p-4">
              <div className={`mb-3 inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${c.color}`}>{c.label}</div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="rounded-lg border border-dashed p-4 text-center text-xs">Aucune carte</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <ComingSoon title="Kanban de production" description="Glissez-déposez les commandes entre les étapes — bientôt connecté aux commandes en base." />
        </div>
      </AppShell>
    );
  },
});
