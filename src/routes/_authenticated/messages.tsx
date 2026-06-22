import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ComingSoon } from "@/components/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/messages")({
  head: () => ({ meta: [{ title: "Messagerie — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("messages")}>
        <ComingSoon title="Messagerie interne" description="Communication en temps réel entre la direction et les employés." />
      </AppShell>
    );
  },
});
