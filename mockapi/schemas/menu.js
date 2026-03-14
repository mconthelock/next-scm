const MENU_DEFINITIONS = [
    {
        id: 1,
        USER_GROUP: 1,
        MENU: [
            { title: 'Home', href: '/', requireAuth: true },
            {
                title: 'Purchase Orders',
                href: '/orders',
                requireAuth: true,
                children: [
                    { title: 'Users', href: '/users', requireAuth: true },
                    { title: 'Settings', href: '/settings', requireAuth: true },
                    { title: 'Profile', href: '/profile', requireAuth: true },
                ],
            },
            {
                title: 'Claim slip',
                href: '/logistics',
                requireAuth: true,
                children: [
                    { title: 'Users', href: '/users', requireAuth: true },
                    { title: 'Settings', href: '/settings', requireAuth: true },
                    { title: 'Profile', href: '/profile', requireAuth: true },
                ],
            },
            {
                title: 'Drawing',
                href: '/analytics',
                requireAuth: true,
            },
            {
                title: 'Other',
                requireAuth: true,
                children: [
                    {
                        title: 'Changing Notice',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        title: 'Kaizen 4M Change',
                        href: '/settings',
                        requireAuth: true,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        USER_GROUP: 2,
        MENU: [
            { title: 'Home', href: '/', requireAuth: true },
            {
                title: 'Purchase Orders',
                href: '/orders',
                requireAuth: true,
                children: [
                    { title: 'Users', href: '/users', requireAuth: true },
                    { title: 'Settings', href: '/settings', requireAuth: true },
                    { title: 'Profile', href: '/profile', requireAuth: true },
                ],
            },
            {
                title: 'Claim slip',
                href: '/logistics',
                requireAuth: true,
                children: [
                    { title: 'Users', href: '/users', requireAuth: true },
                    { title: 'Settings', href: '/settings', requireAuth: true },
                    { title: 'Profile', href: '/profile', requireAuth: true },
                ],
            },
            {
                title: 'Drawing',
                href: '/analytics',
                requireAuth: true,
            },
            {
                title: 'Other',
                requireAuth: true,
                children: [
                    {
                        title: 'Changing Notice',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        title: 'Kaizen 4M Change',
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
            { title: 'Home', href: '/', requireAuth: true },
            {
                title: 'Purchase Orders',
                href: '/orders',
                requireAuth: true,
                children: [
                    { title: 'Users', href: '/users', requireAuth: true },
                    { title: 'Settings', href: '/settings', requireAuth: true },
                    { title: 'Profile', href: '/profile', requireAuth: true },
                ],
            },
            {
                title: 'Claim slip',
                href: '/logistics',
                requireAuth: true,
                children: [
                    { title: 'Users', href: '/users', requireAuth: true },
                    { title: 'Settings', href: '/settings', requireAuth: true },
                    { title: 'Profile', href: '/profile', requireAuth: true },
                ],
            },
            {
                title: 'Drawing',
                href: '/analytics',
                requireAuth: true,
            },
            {
                title: 'Other',
                requireAuth: true,
                children: [
                    {
                        title: 'Changing Notice',
                        href: '/users',
                        requireAuth: true,
                    },
                    {
                        title: 'Kaizen 4M Change',
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
