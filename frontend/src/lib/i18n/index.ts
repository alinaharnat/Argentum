import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonUk from './locales/uk/common.json';
import authUk from './locales/uk/auth.json';
import landingUk from './locales/uk/landing.json';
import dashboardUk from './locales/uk/dashboard.json';
import accountsUk from './locales/uk/accounts.json';
import goalsUk from './locales/uk/goals.json';
import budgetsUk from './locales/uk/budgets.json';
import transactionsUk from './locales/uk/transactions.json';
import categoriesUk from './locales/uk/categories.json';

import commonEn from './locales/en/common.json';
import authEn from './locales/en/auth.json';
import landingEn from './locales/en/landing.json';
import dashboardEn from './locales/en/dashboard.json';
import accountsEn from './locales/en/accounts.json';
import goalsEn from './locales/en/goals.json';
import budgetsEn from './locales/en/budgets.json';
import transactionsEn from './locales/en/transactions.json';
import categoriesEn from './locales/en/categories.json';

export const defaultNS = 'common';
export const resources = {
  uk: {
    common: commonUk,
    auth: authUk,
    landing: landingUk,
    dashboard: dashboardUk,
    accounts: accountsUk,
    goals: goalsUk,
    budgets: budgetsUk,
    transactions: transactionsUk,
    categories: categoriesUk,
  },
  en: {
    common: commonEn,
    auth: authEn,
    landing: landingEn,
    dashboard: dashboardEn,
    accounts: accountsEn,
    goals: goalsEn,
    budgets: budgetsEn,
    transactions: transactionsEn,
    categories: categoriesEn,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;