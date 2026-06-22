import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SimpleCrud } from "@/components/SimpleCrud";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({ meta: [{ title: "Tâches — Ounsa PUB ERP" }] }),
  component: () => {
    const { t } = useI18n();
    return (
      <AppShell title={t("tasks")}>
        <SimpleCrud
          table="tasks"
          title="Tâche"
          columns={[
            { key: "title", label: "Titre" },
            { key: "status", label: "Statut" },
            { key: "priority", label: "Priorité" },
            { key: "due_date", label: "Échéance" },
          ]}
          fields={[
            { name: "title", label: "Titre", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "status", label: "Statut (todo/doing/done)" },
            { name: "priority", label: "Priorité (low/normal/high/urgent)" },
            { name: "due_date", label: "Échéance", type: "date" },
          ]}
        />
      </AppShell>
    );
  },
});
