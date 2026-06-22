import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "email" | "tel" | "textarea" | "date";
  required?: boolean;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => ReactNode;
};

type Props = {
  table: string;
  columns: Column[];
  fields: Field[];
  title: string;
  defaultSort?: string;
};

export function SimpleCrud({ table, columns, fields, title, defaultSort = "created_at" }: Props) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await (supabase.from(table as never) as never)
        .select("*").order(defaultSort, { ascending: false }).limit(500);
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      const { error } = await (supabase.from(table as never) as never).upsert(row);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [table] }); toast.success("Enregistré"); setOpen(false); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from(table as never) as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [table] }); toast.success("Supprimé"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (data ?? []).filter(r =>
    !search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row: Record<string, unknown> = editing ? { ...editing } : {};
    for (const f of fields) {
      const v = fd.get(f.name);
      row[f.name] = f.type === "number" ? (v ? Number(v) : null) : (v || null);
    }
    upsert.mutate(row);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
        </div>
        <Button variant="outline" size="icon" onClick={() => refetch()} aria-label={t("refresh")}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="me-1 h-4 w-4" />{t("new")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? t("edit") : t("new")} — {title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              {fields.map(f => (
                <div key={f.name} className="space-y-1.5">
                  <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={f.name} name={f.name} required={f.required}
                      defaultValue={editing?.[f.name] as string ?? ""}
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  ) : (
                    <Input
                      id={f.name} name={f.name} type={f.type ?? "text"} required={f.required}
                      defaultValue={editing?.[f.name] as string ?? ""}
                    />
                  )}
                </div>
              ))}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button type="submit" disabled={upsert.isPending}>{t("save")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(c => <TableHead key={c.key}>{c.label}</TableHead>)}
              <TableHead className="text-end w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">Chargement…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">Aucun élément</TableCell></TableRow>
            ) : filtered.map((row) => (
              <TableRow key={String(row.id)}>
                {columns.map(c => (
                  <TableCell key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? "—")}</TableCell>
                ))}
                <TableCell className="text-end">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Supprimer ?")) remove.mutate(String(row.id)); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
