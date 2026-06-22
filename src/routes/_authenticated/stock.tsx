import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/stock")({
  head: () => ({ meta: [{ title: "Stock — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("stock")}>
        <SimpleCrud
          table="stock_movements"
          title="Mouvement de stock"
          columns={[
            { key: "movement_type", label: "Type" },
            { key: "quantity", label: "Quantité" },
            { key: "unit_price", label: "Prix unitaire" },
            { key: "reason", label: "Motif" },
            { key: "created_at", label: "Date" },
          ]}
          fields={[
            { name: "movement_type", label: "Type (in/out/loss/adjustment)", required: true },
            { name: "quantity", label: "Quantité", type: "number", required: true },
            { name: "unit_price", label: "Prix unitaire", type: "number" },
            { name: "reason", label: "Motif" },
          ]}
        />
      </AppShell>
    );
  },
});
