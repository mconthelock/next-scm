/** ข้อความทั่วไปที่ใช้ซ้ำหลายจุด */
export interface CommonMessages {
    loading: string;
    signingIn: string;
    language: string;
    thai: string;
    english: string;
}

/** ข้อความในส่วน header และ navigation */
export interface HeaderMessages {
    profile: string;
    settings: string;
    logout: string;
    login: string;
    tickets: string;
    manual: string;
    accountLogin: string;
    noRoleAssigned: string;
    mobileTagline: string;
}

/** ข้อความในหน้า login */
export interface LoginMessages {
    title: string;
    subtitle: string;
    username: string;
    password: string;
    submit: string;
    forgotPassword: string;
    invalidCredentials: string;
    passwordExpiredError: string;
    passwordChangedSuccess: string;
    startResetFailed: string;
}

/** ข้อความในหน้า change password */
export interface ChangePasswordMessages {
    title: string;
    subtitle: string;
    username: string;
    newPassword: string;
    confirmNewPassword: string;
    submit: string;
    checkingAccess: string;
    submitting: string;
    invalidTicket: string;
    unableToChange: string;
    backToLogin: string;
    policyTitle: string;
    policyItems: string[];
}

/** ข้อความในกลุ่ม auth */
export interface AuthMessages {
    login: LoginMessages;
    changePassword: ChangePasswordMessages;
}

/** ข้อความใน footer */
export interface FooterMessages {
    description: string;
    products: string;
    about: string;
    support: string;
    privacyPolicy: string;
    termsOfUse: string;
    copyright: string;
    productLinks: string[];
    aboutLinks: string[];
    supportLinks: string[];
}

/** map สำหรับแปลชื่อเมนูที่มาจาก config หรือ API แบบง่าย ๆ */
export interface MenuLabelMessages {
    [label: string]: string;
}

/** ข้อความใน component ตารางที่ใช้ซ้ำหลายหน้า */
export interface TableMessages {
    noResults: string;
    previous: string;
    next: string;
    showMore: string;
    showLess: string;
    pageStatus: string;
    morePages: string;
    filterPlaceholder: string;
    /** label ของ filter กลาง เช่น ทุกสถานะ / ทุกกลุ่ม */
    filterLabels: Record<string, string>;
    sortColumnLabel: string;
    sortDirectionAsc: string;
    sortDirectionDesc: string;
    /** map key -> label สำหรับหัวตารางและ label ใน mobile card */
    columnLabels: Record<string, string>;
}

/** ข้อความทั้งหมดของแต่ละภาษา */
export interface AppMessages {
    common: CommonMessages;
    header: HeaderMessages;
    auth: AuthMessages;
    footer: FooterMessages;
    menuLabels: MenuLabelMessages;
    pageTitle: import('@/lib/i18n/messages/page-title').PageTitleMessages;
    table: TableMessages;
}
