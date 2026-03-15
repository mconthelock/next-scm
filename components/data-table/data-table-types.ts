'use client';

import { type Cell, type ColumnDef } from '@tanstack/react-table';

/** option ของ dropdown filter */
export interface DataTableSelectFilterOption {
    label: string;
    value: string;
}

/** config ของ dropdown filter ที่จะ bind กับ column id ในตาราง */
export interface DataTableSelectFilter {
    columnId: string;
    placeholder: string;
    options: DataTableSelectFilterOption[];
}

/** ข้อมูลที่ component filter bar ใช้ render select แต่ละตัว */
export interface DataTableFilterSelectItem {
    columnId: string;
    placeholder: string;
    options: DataTableSelectFilterOption[];
    selectedValue: string;
    onValueChange: (nextValue: string) => void;
}

/** props หลักของ DataTable ที่หน้าอื่นจะส่งเข้ามาใช้ซ้ำ */
export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterColumnId?: string;
    filterColumnIds?: string[];
    filterPlaceholder?: string;
    pageSize?: number;
    /** รายการ select filter สำหรับกรองข้อมูลบางคอลัมน์แบบเลือกค่าเดียว */
    selectFilters?: DataTableSelectFilter[];
}

/** meta เพิ่มเติมของคอลัมน์ที่ DataTable ใช้จัดการ UX บน mobile และ i18n */
export interface DataTableColumnMeta {
    /** key สำหรับ map label ด้วย messages.table.columnLabels */
    i18nLabelKey?: string;
    /** ซ่อนฟิลด์นี้จาก desktop table */
    desktopHidden?: boolean;
    /** ซ่อนฟิลด์นี้จาก mobile card view */
    mobileHidden?: boolean;
}

/** cell ที่ถูกส่งเข้า mobile row component เพื่อ render ข้อมูลแต่ละส่วน */
export interface DataTableRowCellGroup<TData> {
    summaryCells: Cell<TData, unknown>[];
    detailCells: Cell<TData, unknown>[];
}
