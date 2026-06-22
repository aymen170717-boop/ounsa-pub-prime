import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/invoices")({
  head: () => ({ meta: [{ title: "Factures — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("invoices")}>
        <SimpleCrud
          table="invoices"
          title="Facture"
          columns={[
            { key: "number", label: "N°" },
            { key: "type", label: "Type" },
            { key: "total_ttc", label: "Total TTC" },
            { key: "paid_amount", label: "Payé" },
            { key: "status", label: "Statut" },
            { key: "due_date", label: "Échéance" },
          ]}
          fields={[
            { name: "number", label: "Numéro" },
            { name: "total_ttc", label: "Total TTC", type: "number" },
            { name: "paid_amount", label: "Montant payé", type: "number" },
            { name: "due_date", label: "Échéance", type: "date" },
          ]}
        />
      </AppShell>
    );
  },
});
