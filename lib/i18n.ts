import { authMessages } from '@/lib/i18n/messages/auth';
import { commonMessages } from '@/lib/i18n/messages/common';
import { footerMessages } from '@/lib/i18n/messages/footer';
import { headerMessages } from '@/lib/i18n/messages/header';
import { menuLabelMessages } from '@/lib/i18n/messages/menu';
import { pageTitleMessages } from '@/lib/i18n/messages/page-title';
import { tableMessages } from '@/lib/i18n/messages/table';

export {
    DEFAULT_LOCALE,
    isLocale,
    LOCALE_COOKIE_NAME,
    resolveLocale,
    SUPPORTED_LOCALES,
    type Locale,
} from '@/lib/i18n/config';

export type {
    AppMessages,
    AuthMessages,
    ChangePasswordMessages,
    CommonMessages,
    FooterMessages,
    HeaderMessages,
    LoginMessages,
    MenuLabelMessages,
    TableMessages,
} from '@/lib/i18n/types';

import type { AppMessages } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';

export const messagesByLocale: Record<Locale, AppMessages> = {
    th: {
        common: commonMessages.th,
        header: headerMessages.th,
        auth: authMessages.th,
        footer: footerMessages.th,
        menuLabels: menuLabelMessages.th,
        pageTitle: pageTitleMessages.th,
        table: tableMessages.th,
    },
    en: {
        common: commonMessages.en,
        header: headerMessages.en,
        auth: authMessages.en,
        footer: footerMessages.en,
        menuLabels: menuLabelMessages.en,
        pageTitle: pageTitleMessages.en,
        table: tableMessages.en,
    },
};

export function translateMenuLabel(messages: AppMessages, label: string) {
    return messages.menuLabels[label] ?? label;
}
