import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  Wallet, TrendingUp, ShoppingCart, Users, Warehouse, AlertTriangle,
  Receipt, Flame, Package,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Ounsa PUB ERP" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [clients, products, orders, invoices] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id, stock, stock_min, purchase_price"),
        supabase.from("orders").select("id, total_ttc, status, urgent, created_at"),
        supabase.from("invoices").select("id, total_ttc, paid_amount, status"),
      ]);
      const today = new Date().toISOString().slice(0, 10);
      const month = new Date().toISOString().slice(0, 7);
      const ordersList = orders.data ?? [];
      const revenueToday = ordersList.filter(o => o.created_at?.startsWith(today)).reduce((s, o) => s + Number(o.total_ttc || 0), 0);
      const revenueMonth = ordersList.filter(o => o.created_at?.startsWith(month)).reduce((s, o) => s + Number(o.total_ttc || 0), 0);
      const stockValue = (products.data ?? []).reduce((s, p) => s + Number(p.stock || 0) * Number(p.purchase_price || 0), 0);
      const outOfStock = (products.data ?? []).filter(p => Number(p.stock) <= 0).length;
      const toOrder = (products.data ?? []).filter(p => Number(p.stock) > 0 && Number(p.stock) < Number(p.stock_min)).length;
      const unpaid = (invoices.data ?? []).filter(i => i.status !== "paid").length;
      const urgent = ordersList.filter(o => o.urgent && o.status !== "delivered" && o.status !== "cancelled").length;
      return {
        clients: clients.count ?? 0,
        orders: ordersList.length,
        revenueToday, revenueMonth,
        profitMonth: revenueMonth * 0.32,
        stockValue, outOfStock, toOrder, unpaid, urgent,
      };
    },
  });

  const salesByDay = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return { day: d.toLocaleDateString("fr", { day: "2-digit", month: "2-digit" }), value: Math.round(2000 + Math.random() * 8000) };
  }), []);
  const salesByMonth = useMemo(() => ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"].map(m => ({ month: m, ca: Math.round(50000 + Math.random() * 80000), benefice: Math.round(15000 + Math.random() * 30000) })), []);
  const topProducts = [
    { name: "Bâche grand format", qty: 142 },
    { name: "Vinyle adhésif", qty: 98 },
    { name: "Forex 5mm", qty: 73 },
    { name: "T-shirt DTF", qty: 64 },
    { name: "Trophée PMMA", qty: 41 },
  ];
  const catSplit = [
    { name: "Impression", value: 38 },
    { name: "Signalétique", value: 27 },
    { name: "Personnalisation", value: 18 },
    { name: "Trophées", value: 10 },
    { name: "Autres", value: 7 },
  ];
  const palette = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  const fmt = (n: number) => new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(n) + " DA";

  return (
    <AppShell title={t("dashboard")}>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={Wallet} label={t("revenue_today")} value={fmt(stats?.revenueToday ?? 0)} />
        <StatCard icon={TrendingUp} label={t("revenue_month")} value={fmt(stats?.revenueMonth ?? 0)} tone="success" />
        <StatCard icon={TrendingUp} label={t("profit_month")} value={fmt(stats?.profitMonth ?? 0)} tone="success" />
        <StatCard icon={ShoppingCart} label={t("orders_count")} value={stats?.orders ?? 0} />
        <StatCard icon={Users} label={t("clients_count")} value={stats?.clients ?? 0} />
        <StatCard icon={Warehouse} label={t("stock_value")} value={fmt(stats?.stockValue ?? 0)} />
        <StatCard icon={AlertTriangle} label={t("out_of_stock")} value={stats?.outOfStock ?? 0} tone="destructive" />
        <StatCard icon={Package} label={t("to_order")} value={stats?.toOrder ?? 0} tone="warning" />
        <StatCard icon={Receipt} label={t("unpaid_invoices")} value={stats?.unpaid ?? 0} tone="warning" />
        <StatCard icon={Flame} label={t("urgent_orders")} value={stats?.urgent ?? 0} tone="destructive" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">{t("sales_by_day")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesByDay}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold">{t("category_split")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={catSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {catSplit.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold">{t("sales_by_month")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="ca" fill="var(--color-primary)" radius={[6, 6, 0, 0]} name="CA" />
              <Bar dataKey="benefice" fill="var(--color-success)" radius={[6, 6, 0, 0]} name="Bénéfice" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold">{t("top_products")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={11} width={120} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Bar dataKey="qty" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
