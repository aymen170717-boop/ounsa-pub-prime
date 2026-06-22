import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Paramètres — Ounsa PUB ERP" }] }),
  component: () => {
    const { t, lang, setLang } = useI18n();
    const { theme, toggle } = useTheme();
    return (
      <AppShell title={t("settings")}>
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 text-base font-semibold">{t("language")}</h3>
            <div className="flex gap-2">
              <Button variant={lang === "fr" ? "default" : "outline"} onClick={() => setLang("fr")}>🇫🇷 {t("french")}</Button>
              <Button variant={lang === "ar" ? "default" : "outline"} onClick={() => setLang("ar")}>🇩🇿 {t("arabic")}</Button>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 text-base font-semibold">{t("theme")}</h3>
            <div className="flex items-center gap-3">
              <Switch id="dark" checked={theme === "dark"} onCheckedChange={toggle} />
              <Label htmlFor="dark">{theme === "dark" ? t("dark") : t("light")}</Label>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-2 text-base font-semibold">Société</h3>
            <p className="text-sm text-muted-foreground">
              Configurez les informations de l'entreprise (logo, NIF, NIS, RC, coordonnées, taux de TVA) — bientôt éditables ici.
            </p>
          </div>
        </div>
      </AppShell>
    );
  },
});
