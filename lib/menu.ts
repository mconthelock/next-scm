/** เมนูย่อยที่ใช้ทั้งใน API และ Header */
export interface MenuChildItem {
    title: string;
    href: string;
    requireAuth?: boolean;
}

/** เมนูย่อยดิบจาก mock API ที่ส่งชื่อไทย/อังกฤษมาแยก field */
export interface RawMenuChildItem {
    en_title: string;
    th_title: string;
    href: string;
    requireAuth?: boolean;
}

/** เมนูหลักที่อาจมี children อยู่ด้านใน */
export interface MenuItem {
    title: string;
    href?: string;
    requireAuth?: boolean;
    children?: MenuChildItem[];
}

/** เมนูหลักดิบจาก mock API ที่ส่งชื่อไทย/อังกฤษมาแยก field */
export interface RawMenuItem {
    en_title: string;
    th_title: string;
    href?: string;
    requireAuth?: boolean;
    children?: RawMenuChildItem[];
}

/** รูปแบบ response ตอนดึงเมนูสำเร็จ */
export interface MenuResponse {
    menu: MenuItem[];
}

/** รูปแบบ response ตอน API ส่งข้อความ error กลับมา */
export interface MenuErrorResponse {
    message: string;
}

/** ข้อมูลดิบจาก authen API ของ json-server */
export interface AuthenMenuRecord {
    USER_GROUP: number;
    MENU: RawMenuItem[];
}

/** เมนู public สำหรับผู้ใช้ที่ยังไม่ login */
export const publicNavItems: MenuItem[] = [
    { title: 'Home', href: '/', requireAuth: false },
    { title: 'About', href: '/about', requireAuth: false },
];
