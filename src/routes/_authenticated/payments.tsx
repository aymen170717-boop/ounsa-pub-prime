import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({ meta: [{ title: "Paiements — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("payments")}>
        <SimpleCrud
          table="payments"
          title="Paiement"
          columns={[
            { key: "amount", label: "Montant" },
            { key: "method", label: "Mode" },
            { key: "payment_date", label: "Date" },
            { key: "notes", label: "Notes" },
          ]}
          fields={[
            { name: "amount", label: "Montant", type: "number", required: true },
            { name: "method", label: "Mode (cash/card/bank/check)" },
            { name: "payment_date", label: "Date", type: "date" },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
        />
      </AppShell>
    );
  },
});
