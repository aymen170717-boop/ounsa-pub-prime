import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "ar";

type Dict = Record<string, { fr: string; ar: string }>;

const dict: Dict = {
  // Nav
  dashboard: { fr: "Tableau de bord", ar: "لوحة التحكم" },
  clients: { fr: "Clients", ar: "العملاء" },
  products: { fr: "Produits", ar: "المنتجات" },
  stock: { fr: "Stock", ar: "المخزون" },
  orders: { fr: "Commandes", ar: "الطلبات" },
  quotes: { fr: "Devis", ar: "عروض الأسعار" },
  invoices: { fr: "Factures", ar: "الفواتير" },
  payments: { fr: "Paiements", ar: "المدفوعات" },
  production: { fr: "Production", ar: "الإنتاج" },
  design: { fr: "Design", ar: "التصميم" },
  employees: { fr: "Employés", ar: "الموظفون" },
  suppliers: { fr: "Fournisseurs", ar: "الموردون" },
  expenses: { fr: "Dépenses", ar: "المصاريف" },
  tasks: { fr: "Tâches", ar: "المهام" },
  messages: { fr: "Messages", ar: "الرسائل" },
  reports: { fr: "Rapports", ar: "التقارير" },
  settings: { fr: "Paramètres", ar: "الإعدادات" },
  trash: { fr: "Corbeille", ar: "المهملات" },
  activity: { fr: "Journal d'activité", ar: "سجل النشاط" },

  // KPIs
  revenue_today: { fr: "CA du jour", ar: "إيرادات اليوم" },
  revenue_month: { fr: "CA du mois", ar: "إيرادات الشهر" },
  profit_month: { fr: "Bénéfice du mois", ar: "ربح الشهر" },
  orders_count: { fr: "Commandes", ar: "الطلبات" },
  clients_count: { fr: "Clients", ar: "العملاء" },
  employees_online: { fr: "Employés connectés", ar: "موظفون متصلون" },
  stock_value: { fr: "Valeur du stock", ar: "قيمة المخزون" },
  out_of_stock: { fr: "Produits en rupture", ar: "منتجات نافذة" },
  to_order: { fr: "À commander", ar: "للطلب" },
  unpaid_invoices: { fr: "Factures impayées", ar: "فواتير غير مدفوعة" },
  urgent_orders: { fr: "Commandes urgentes", ar: "طلبات عاجلة" },

  // Charts
  sales_by_day: { fr: "Ventes par jour", ar: "المبيعات اليومية" },
  sales_by_month: { fr: "Ventes par mois", ar: "المبيعات الشهرية" },
  top_products: { fr: "Produits les plus vendus", ar: "أكثر المنتجات مبيعا" },
  category_split: { fr: "Répartition des catégories", ar: "توزيع الفئات" },

  // Actions
  new: { fr: "Nouveau", ar: "جديد" },
  edit: { fr: "Modifier", ar: "تعديل" },
  delete: { fr: "Supprimer", ar: "حذف" },
  view: { fr: "Consulter", ar: "عرض" },
  search: { fr: "Rechercher…", ar: "بحث…" },
  print: { fr: "Imprimer", ar: "طباعة" },
  export_pdf: { fr: "Exporter PDF", ar: "تصدير PDF" },
  export_excel: { fr: "Exporter Excel", ar: "تصدير Excel" },
  refresh: { fr: "Actualiser", ar: "تحديث" },
  save: { fr: "Enregistrer", ar: "حفظ" },
  cancel: { fr: "Annuler", ar: "إلغاء" },
  logout: { fr: "Déconnexion", ar: "تسجيل الخروج" },

  // Auth
  login: { fr: "Connexion", ar: "تسجيل الدخول" },
  signup: { fr: "Créer un compte", ar: "إنشاء حساب" },
  email: { fr: "Email", ar: "البريد الإلكتروني" },
  password: { fr: "Mot de passe", ar: "كلمة المرور" },
  full_name: { fr: "Nom complet", ar: "الاسم الكامل" },
  continue_google: { fr: "Continuer avec Google", ar: "المتابعة مع Google" },
  no_account: { fr: "Pas encore de compte ?", ar: "ليس لديك حساب؟" },
  have_account: { fr: "Vous avez déjà un compte ?", ar: "لديك حساب بالفعل؟" },

  // App
  app_name: { fr: "Ounsa PUB ERP", ar: "أونسة بَب ERP" },
  app_tagline: {
    fr: "Gestion Commerciale • Impression • Publicité • Signalétique • Personnalisation",
    ar: "إدارة تجارية • طباعة • إعلانات • لافتات • تخصيص",
  },
  welcome_back: { fr: "Bon retour", ar: "مرحبا بعودتك" },
  footer_rights: { fr: "Tous droits réservés", ar: "جميع الحقوق محفوظة" },
  language: { fr: "Langue", ar: "اللغة" },
  french: { fr: "Français", ar: "الفرنسية" },
  arabic: { fr: "Arabe", ar: "العربية" },
  theme: { fr: "Thème", ar: "المظهر" },
  light: { fr: "Clair", ar: "فاتح" },
  dark: { fr: "Sombre", ar: "داكن" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
  dir: "ltr" | "rtl";
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "fr" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);
  return (
    <I18nCtx.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n must be used within I18nProvider");
  return c;
}
