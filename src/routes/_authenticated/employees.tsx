import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/employees")({
  head: () => ({ meta: [{ title: "Employés — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("employees")}>
        <SimpleCrud
          table="employees"
          title="Employé"
          columns={[
            { key: "full_name", label: "Nom" },
            { key: "position", label: "Fonction" },
            { key: "phone", label: "Téléphone" },
            { key: "salary", label: "Salaire" },
          ]}
          fields={[
            { name: "full_name", label: "Nom complet", required: true },
            { name: "position", label: "Fonction" },
            { name: "phone", label: "Téléphone", type: "tel" },
            { name: "address", label: "Adresse" },
            { name: "salary", label: "Salaire", type: "number" },
          ]}
        />
      </AppShell>
    );
  },
});
