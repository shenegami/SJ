import type { AppLocale } from './config';

type Dictionary = Record<string, string>;

const ar: Dictionary = {
  'nav.dashboard': 'لوحة التحكم',
  'nav.projects': 'المشاريع',
  'nav.tasks': 'المهام',
  'nav.policies': 'السياسات',
  'nav.salary': 'الرواتب',
  'nav.aiChat': 'المساعد الذكي',
  'nav.admin': 'لوحة الإدارة',
  'nav.settings': 'الإعدادات',
  'action.signIn': 'تسجيل الدخول',
  'action.signOut': 'تسجيل الخروج',
  'dashboard.welcome': 'مرحباً بك في مساعد الشركة بالذكاء الاصطناعي',
  'dashboard.subtitle': 'تابع المشاريع والمهام والسياسات واطلب المساعدة الفورية.',
  'language.toggle': 'تغيير اللغة',
};

const en: Dictionary = {
  'nav.dashboard': 'Dashboard',
  'nav.projects': 'Projects',
  'nav.tasks': 'Tasks',
  'nav.policies': 'Policies',
  'nav.salary': 'Salary Intelligence',
  'nav.aiChat': 'AI Assistant',
  'nav.admin': 'Admin Panel',
  'nav.settings': 'Settings',
  'action.signIn': 'Sign in',
  'action.signOut': 'Sign out',
  'dashboard.welcome': 'Welcome to the AI Company Assistant',
  'dashboard.subtitle': 'Monitor projects, tasks, and policies while getting instant help.',
  'language.toggle': 'Switch language',
};

const dictionaries: Record<AppLocale, Dictionary> = {
  ar,
  en,
};

export const getDictionary = (locale: AppLocale) => dictionaries[locale];
