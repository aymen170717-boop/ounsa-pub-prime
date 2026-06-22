import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ComingSoon } from "@/components/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/design")({
  head: () => ({ meta: [{ title: "Glass Design — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("design")}>
        <ComingSoon
          title="Module Glass Design"
          description="Suivi des projets de conception graphique : maquettes, fichiers AI/PSD/PDF, validation BAT client, états (nouveau, en conception, en validation, en production, terminé, livré)."
        />
      </AppShell>
    );
  },
});
