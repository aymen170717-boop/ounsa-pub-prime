import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/quotes")({
  head: () => ({ meta: [{ title: "Devis — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("quotes")}>
        <SimpleCrud
          table="quotes"
          title="Devis"
          columns={[
            { key: "number", label: "N°" },
            { key: "status", label: "État" },
            { key: "total_ttc", label: "Total TTC" },
            { key: "valid_until", label: "Valide jusqu'au" },
          ]}
          fields={[
            { name: "number", label: "Numéro" },
            { name: "total_ttc", label: "Total TTC", type: "number" },
            { name: "valid_until", label: "Valide jusqu'au", type: "date" },
          ]}
        />
      </AppShell>
    );
  },
});
