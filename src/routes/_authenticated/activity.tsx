import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ComingSoon } from "@/components/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({ meta: [{ title: "Journal d'activité — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("activity")}>
        <ComingSoon title="Journal d'activité" description="Historique complet : utilisateur, action, date, anciennes et nouvelles valeurs." />
      </AppShell>
    );
  },
});
