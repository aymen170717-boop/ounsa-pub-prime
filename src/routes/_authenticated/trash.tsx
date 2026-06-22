import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ComingSoon } from "@/components/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/trash")({
  head: () => ({ meta: [{ title: "Corbeille — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("trash")}>
        <ComingSoon title="Corbeille" description="Les éléments supprimés peuvent être restaurés par l'administrateur ou supprimés définitivement." />
      </AppShell>
    );
  },
});
