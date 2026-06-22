import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/expenses")({
  head: () => ({ meta: [{ title: "Dépenses — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("expenses")}>
        <SimpleCrud
          table="expenses"
          title="Dépense"
          columns={[
            { key: "label", label: "Libellé" },
            { key: "category", label: "Catégorie" },
            { key: "amount", label: "Montant" },
            { key: "expense_date", label: "Date" },
          ]}
          fields={[
            { name: "label", label: "Libellé", required: true },
            { name: "category", label: "Catégorie" },
            { name: "amount", label: "Montant", type: "number", required: true },
            { name: "expense_date", label: "Date", type: "date" },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
        />
      </AppShell>
    );
  },
});
