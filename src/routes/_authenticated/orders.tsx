import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "Commandes — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("orders")}>
        <SimpleCrud
          table="orders"
          title="Commande"
          columns={[
            { key: "number", label: "N°" },
            { key: "status", label: "État" },
            { key: "total_ttc", label: "Total TTC" },
            { key: "delivery_date", label: "Livraison" },
          ]}
          fields={[
            { name: "number", label: "Numéro" },
            { name: "notes", label: "Observations", type: "textarea" },
            { name: "total_ht", label: "Total HT", type: "number" },
            { name: "discount", label: "Remise", type: "number" },
            { name: "tax", label: "TVA", type: "number" },
            { name: "total_ttc", label: "Total TTC", type: "number" },
            { name: "delivery_date", label: "Date livraison", type: "date" },
          ]}
        />
      </AppShell>
    );
  },
});
