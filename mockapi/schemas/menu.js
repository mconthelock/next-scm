const MENU_DEFINITIONS = [
    {
        id: 1,
        USER_GROUP: 1,
        MENU: [
            {
                en_title: 'Home',
                th_title: 'หน้าแรก',
                href: '/',
                requireAuth: true,
            },
            {
                en_title: 'Users Management',
                th_title: 'ข้อมูลผู้ใช้',
                href: '/users',
                requireAuth: true,
            },
            {
                en_title: 'Users Logs',
                th_title: 'ประวัติการเข้าใช้งาน',
                href: '/logs',
                requireAuth: true,
            },
            {
                en_title: 'Ticket Management',
                th_title: 'จัดการการขอความช่วยเหลือ',
                href: '/tickets',
                requireAuth: true,
            },
        ],
    },
    {
        id: 2,
        USER_GROUP: 2,
        MENU: [
            {
                en_title: 'Home',
                th_title: 'หน้าแรก',
                href: '/',
                requireAuth: true,
            },
            {
                en_title: 'Purchase Orders',
                th_title: 'คำสั่งซื้อ',
                href: '/orders',
                requireAuth: true,
                children: [
                    {
                        en_title: 'Users',
                        th_title: 'ผู้ใช้',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Settings',
                        th_title: 'ตั้งค่า',
                        href: '/settings',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Profile',
                        th_title: 'โปรไฟล์',
                        href: '/profile',
                        requireAuth: true,
                    },
                ],
            },
            {
                en_title: 'Claim slip',
                th_title: 'ใบเคลม',
                href: '/logistics',
                requireAuth: true,
                children: [
                    {
                        en_title: 'Users',
                        th_title: 'ผู้ใช้',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Settings',
                        th_title: 'ตั้งค่า',
                        href: '/settings',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Profile',
                        th_title: 'โปรไฟล์',
                        href: '/profile',
                        requireAuth: true,
                    },
                ],
            },
            {
                en_title: 'Drawing',
                th_title: 'วาด',
                href: '/analytics',
                requireAuth: true,
            },
            {
                en_title: 'Other',
                th_title: 'อื่น ๆ',
                requireAuth: true,
                children: [
                    {
                        en_title: 'Changing Notice',
                        th_title: 'ประกาศการเปลี่ยนแปลง',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Kaizen 4M Change',
                        th_title: 'การเปลี่ยนแปลง Kaizen 4M',
                        href: '/settings',
                        requireAuth: true,
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        USER_GROUP: 3,
        MENU: [
            {
                en_title: 'Home',
                th_title: 'หน้าแรก',
                href: '/',
                requireAuth: true,
            },
            {
                en_title: 'Purchase Orders',
                th_title: 'คำสั่งซื้อ',
                href: '/orders',
                requireAuth: true,
                children: [
                    {
                        en_title: 'Users',
                        th_title: 'ผู้ใช้',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Settings',
                        th_title: 'ตั้งค่า',
                        href: '/settings',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Profile',
                        th_title: 'โปรไฟล์',
                        href: '/profile',
                        requireAuth: true,
                    },
                ],
            },
            {
                en_title: 'Claim slip',
                th_title: 'ใบเคลม',
                href: '/logistics',
                requireAuth: true,
                children: [
                    {
                        en_title: 'Users',
                        th_title: 'ผู้ใช้',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Settings',
                        th_title: 'ตั้งค่า',
                        href: '/settings',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Profile',
                        th_title: 'โปรไฟล์',
                        href: '/profile',
                        requireAuth: true,
                    },
                ],
            },
            {
                en_title: 'Drawing',
                th_title: 'วาด',
                href: '/analytics',
                requireAuth: true,
            },
            {
                en_title: 'Other',
                th_title: 'อื่น ๆ',
                requireAuth: true,
                children: [
                    {
                        en_title: 'Changing Notice',
                        th_title: 'ประกาศการเปลี่ยนแปลง',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        en_title: 'Kaizen 4M Change',
                        th_title: 'การเปลี่ยนแปลง Kaizen 4M',
                        href: '/settings',
                        requireAuth: true,
                    },
                ],
            },
        ],
    },
];
const createMenuUser = (menu) => menu;
module.exports = { createMenuUser, MENU_DEFINITIONS };
