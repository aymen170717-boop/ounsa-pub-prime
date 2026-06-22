import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/clients")({
  head: () => ({ meta: [{ title: "Clients — Ounsa PUB ERP" }] }),
  component: ClientsPage,
});

function ClientsPage() {
  const { t } = useI18n();
  return (
    <AppShell title={t("clients")}>
      <SimpleCrud
        table="clients"
        title="Client"
        columns={[
          { key: "name", label: "Nom" },
          { key: "company", label: "Entreprise" },
          { key: "phone", label: "Téléphone" },
          { key: "email", label: "Email" },
        ]}
        fields={[
          { name: "name", label: "Nom", required: true },
          { name: "company", label: "Entreprise" },
          { name: "phone", label: "Téléphone", type: "tel" },
          { name: "email", label: "Email", type: "email" },
          { name: "address", label: "Adresse" },
          { name: "nif", label: "NIF" },
          { name: "nis", label: "NIS" },
          { name: "rc", label: "RC" },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
