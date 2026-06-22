import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ComingSoon } from "@/components/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Rapports — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("reports")}>
        <ComingSoon title="Rapports & statistiques avancés" description="Export PDF/Excel, période personnalisée, comparaisons par employé, client, catégorie." />
      </AppShell>
    );
  },
});
