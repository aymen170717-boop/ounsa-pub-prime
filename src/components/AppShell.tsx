import { type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Moon, Sun, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b glass px-3 sm:px-6">
            <SidebarTrigger />
            <div className="ms-2 flex-1">
              <h1 className="text-base font-semibold sm:text-lg">{title ?? t("dashboard")}</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Language">
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLang("fr")} className={lang === "fr" ? "font-semibold" : ""}>
                  🇫🇷 {t("french")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("ar")} className={lang === "ar" ? "font-semibold" : ""}>
                  🇩🇿 {t("arabic")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label={t("logout")}>
              <LogOut className="h-4 w-4" />
            </Button>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>

          <footer className="border-t glass px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
            <div className="font-semibold text-foreground">{t("app_name")}</div>
            <div className="mt-1">{t("app_tagline")}</div>
            <div className="mt-1">© {new Date().getFullYear()} Ounsa PUB — {t("footer_rights")}.</div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
