import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/suppliers")({
  head: () => ({ meta: [{ title: "Fournisseurs — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("suppliers")}>
        <SimpleCrud
          table="suppliers"
          title="Fournisseur"
          columns={[
            { key: "name", label: "Nom" },
            { key: "phone", label: "Téléphone" },
            { key: "email", label: "Email" },
          ]}
          fields={[
            { name: "name", label: "Nom", required: true },
            { name: "phone", label: "Téléphone", type: "tel" },
            { name: "email", label: "Email", type: "email" },
            { name: "address", label: "Adresse" },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
        />
      </AppShell>
    );
  },
});
