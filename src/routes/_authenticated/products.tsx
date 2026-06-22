import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/products")({
  head: () => ({ meta: [{ title: "Produits — Ounsa PUB ERP" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useI18n();
  return (
    <AppShell title={t("products")}>
      <SimpleCrud
        table="products"
        title="Produit"
        columns={[
          { key: "reference", label: "Réf" },
          { key: "name", label: "Désignation" },
          { key: "unit", label: "Unité" },
          { key: "sale_price", label: "Prix vente" },
          { key: "stock", label: "Stock" },
        ]}
        fields={[
          { name: "reference", label: "Référence" },
          { name: "name", label: "Désignation", required: true },
          { name: "unit", label: "Unité" },
          { name: "purchase_price", label: "Prix d'achat", type: "number" },
          { name: "sale_price", label: "Prix de vente", type: "number" },
          { name: "wholesale_price", label: "Prix grossiste", type: "number" },
          { name: "price_per_sqm", label: "Prix au m² (si calculé)", type: "number" },
          { name: "stock", label: "Stock actuel", type: "number" },
          { name: "stock_min", label: "Stock minimum", type: "number" },
          { name: "barcode", label: "Code-barres" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
