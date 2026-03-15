'use client';

import { type Cell, type ColumnDef } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';

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

/** config ของ button filter สำหรับคอลัมน์ที่มีค่าจำนวนน้อย */
export interface DataTableButtonFilter {
    columnId: string;
    allLabel: string;
    options: DataTableSelectFilterOption[];
}

/** config ของ date picker filter ที่ใช้เลือกวันเดียวเพื่อกรองข้อมูล */
export interface DataTableDateFilter {
    columnId: string;
    placeholder: string;
    clearLabel: string;
}

/** config ของ date range filter ที่ใช้กรองคอลัมน์วันที่แบบช่วงวัน */
export interface DataTableDateRangeFilter {
    columnId: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    clearLabel: string;
}

/** ข้อมูลที่ component filter bar ใช้ render select แต่ละตัว */
export interface DataTableFilterSelectItem {
    columnId: string;
    placeholder: string;
    options: DataTableSelectFilterOption[];
    selectedValue: string;
    onValueChange: (nextValue: string) => void;
}

/** ข้อมูลที่ component filter bar ใช้ render button filter */
export interface DataTableFilterButtonItem {
    columnId: string;
    allLabel: string;
    options: DataTableSelectFilterOption[];
    selectedValue: string;
    onValueChange: (nextValue: string) => void;
}

/** ข้อมูลที่ component filter bar ใช้ render date picker filter */
export interface DataTableFilterDateItem {
    columnId: string;
    placeholder: string;
    clearLabel: string;
    selectedDate: Date | undefined;
    onDateChange: (nextDate?: Date) => void;
}

/** ข้อมูลที่ component filter bar ใช้ render date range filter */
export interface DataTableFilterDateRangeItem {
    columnId: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    clearLabel: string;
    selectedRange: DateRange | undefined;
    onRangeChange: (nextRange?: DateRange) => void;
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
    /** รายการ button filter สำหรับคอลัมน์ที่มีตัวเลือกไม่มาก */
    buttonFilters?: DataTableButtonFilter[];
    /** รายการ date picker filter สำหรับคอลัมน์วันที่ */
    dateFilters?: DataTableDateFilter[];
    /** รายการ date range filter สำหรับคอลัมน์วันที่แบบจากวันที่ถึงวันที่ */
    dateRangeFilters?: DataTableDateRangeFilter[];
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
