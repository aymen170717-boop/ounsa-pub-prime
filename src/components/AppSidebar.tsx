import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Package, Warehouse, ShoppingCart, FileText,
  Receipt, CreditCard, Factory, Palette, UserCog, Truck, Wallet,
  ListTodo, MessageSquare, BarChart3, Settings, Trash2, ScrollText,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t } = useI18n();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const groups: { label: string; items: { to: string; icon: typeof Users; key: Parameters<typeof t>[0] }[] }[] = [
    {
      label: "Principal",
      items: [
        { to: "/", icon: LayoutDashboard, key: "dashboard" },
        { to: "/clients", icon: Users, key: "clients" },
        { to: "/products", icon: Package, key: "products" },
        { to: "/stock", icon: Warehouse, key: "stock" },
      ],
    },
    {
      label: "Commercial",
      items: [
        { to: "/orders", icon: ShoppingCart, key: "orders" },
        { to: "/quotes", icon: FileText, key: "quotes" },
        { to: "/invoices", icon: Receipt, key: "invoices" },
        { to: "/payments", icon: CreditCard, key: "payments" },
      ],
    },
    {
      label: "Atelier",
      items: [
        { to: "/production", icon: Factory, key: "production" },
        { to: "/design", icon: Palette, key: "design" },
        { to: "/tasks", icon: ListTodo, key: "tasks" },
      ],
    },
    {
      label: "Administration",
      items: [
        { to: "/employees", icon: UserCog, key: "employees" },
        { to: "/suppliers", icon: Truck, key: "suppliers" },
        { to: "/expenses", icon: Wallet, key: "expenses" },
        { to: "/messages", icon: MessageSquare, key: "messages" },
        { to: "/reports", icon: BarChart3, key: "reports" },
        { to: "/activity", icon: ScrollText, key: "activity" },
        { to: "/trash", icon: Trash2, key: "trash" },
        { to: "/settings", icon: Settings, key: "settings" },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow">
            <img src={logo} alt="Ounsa PUB" className="h-full w-full object-contain" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight text-sidebar-foreground">Ounsa PUB</div>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">ERP</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((it) => {
                  const active = pathname === it.to;
                  const Icon = it.icon;
                  return (
                    <SidebarMenuItem key={it.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={t(it.key)}>
                        <Link to={it.to}>
                          <Icon className="h-4 w-4" />
                          <span>{t(it.key)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
