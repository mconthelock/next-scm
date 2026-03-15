import type { Locale } from '@/lib/i18n/config';
import type { FooterMessages } from '@/lib/i18n/types';

/** ข้อความใน footer */
export const footerMessages: Record<Locale, FooterMessages> = {
    th: {
        description:
            'มุ่งมั่นสร้างสรรค์สังคมที่ดีขึ้นผ่านเทคโนโลยีที่ล้ำสมัย ตามวิสัยทัศน์ "Changes for the Better"',
        products: 'ผลิตภัณฑ์',
        about: 'เกี่ยวกับเรา',
        support: 'ช่วยเหลือ',
        privacyPolicy: 'นโยบายความเป็นส่วนตัว',
        termsOfUse: 'ข้อกำหนดการใช้งาน',
        copyright: 'Mitsubishi Electric SCM (Thailand) Co., Ltd.',
        productLinks: ['เครื่องปรับอากาศ', 'ยานยนต์', 'ระบบอัตโนมัติโรงงาน'],
        aboutLinks: ['ประวัติองค์กร', 'ความยั่งยืน'],
        supportLinks: ['ติดต่อเรา', 'ข้อกฎหมาย'],
    },
    en: {
        description:
            'Creating a better society through advanced technology under the vision "Changes for the Better".',
        products: 'Products',
        about: 'About',
        support: 'Support',
        privacyPolicy: 'Privacy Policy',
        termsOfUse: 'Terms of Use',
        copyright: 'Mitsubishi Electric SCM (Thailand) Co., Ltd.',
        productLinks: ['Air Conditioning', 'Automotive', 'Factory Automation'],
        aboutLinks: ['Our History', 'Sustainability'],
        supportLinks: ['Contact Us', 'Legal Notice'],
    },
};
