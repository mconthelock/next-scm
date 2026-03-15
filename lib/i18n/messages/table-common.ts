import type { Locale } from '@/lib/i18n/config';
import type { TableMessages } from '@/lib/i18n/types';

type TableCommonMessages = Omit<TableMessages, 'columnLabels'>;

/** ข้อความกลางของ DataTable ที่ใช้ร่วมกันทุกหน้า */
export const tableCommon: Record<Locale, TableCommonMessages> = {
    th: {
        noResults: 'ไม่พบข้อมูล',
        previous: 'ก่อนหน้า',
        next: 'ถัดไป',
        showMore: 'แสดงเพิ่มเติม',
        showLess: 'ซ่อนรายละเอียด',
        pageStatus: 'หน้า {current} จาก {total}',
        morePages: 'มีหน้าเพิ่มเติม',
        filterPlaceholder: 'ค้นหาข้อมูล...',
        filterLabels: {
            allGroups: 'ทุกกลุ่มผู้ใช้',
            allStatus: 'ทุกสถานะ',
            pickDate: 'เลือกวันที่',
            clearDate: 'ล้างวันที่',
            fromDate: 'จากวันที่',
            toDate: 'ถึงวันที่',
        },
        sortColumnLabel: 'เรียงตาม',
        sortDirectionAsc: 'น้อยไปมาก',
        sortDirectionDesc: 'มากไปน้อย',
    },
    en: {
        noResults: 'No results.',
        previous: 'Previous',
        next: 'Next',
        showMore: 'Show more',
        showLess: 'Show less',
        pageStatus: 'Page {current} of {total}',
        morePages: 'More pages',
        filterPlaceholder: 'Search records...',
        filterLabels: {
            allGroups: 'All groups',
            allStatus: 'All status',
            pickDate: 'Pick a date',
            clearDate: 'Clear date',
            fromDate: 'From date',
            toDate: 'To date',
        },
        sortColumnLabel: 'Sort by',
        sortDirectionAsc: 'Ascending',
        sortDirectionDesc: 'Descending',
    },
};
