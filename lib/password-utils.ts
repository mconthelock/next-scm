import { createHash } from 'node:crypto';

/** ผลลัพธ์จากการตรวจ password policy */
export interface PasswordPolicyResult {
    isValid: boolean;
    errors: string[];
}

/** ข้อมูลที่ใช้ตรวจ password policy เทียบกับผู้ใช้ปัจจุบัน */
export interface PasswordPolicyContext {
    password: string;
    username?: string;
    passwordHistoryHashes?: string[];
}

const MIN_PASSWORD_LENGTH = 14;
const COMMON_WEAK_PATTERNS = [
    'password',
    'qwerty',
    'asdf',
    'zxcv',
    'admin',
    'welcome',
    'letmein',
    'mitsubishi',
    'elevator',
    'scm',
];

export function hashPassword(password: string) {
    return createHash('md5').update(password).digest('hex');
}

export function isPasswordResetRequired(resetDate?: string) {
    if (!resetDate) {
        return false;
    }

    const parsedResetDate = new Date(resetDate);

    if (Number.isNaN(parsedResetDate.getTime())) {
        return false;
    }

    return parsedResetDate.getTime() <= Date.now();
}

export function getNextPasswordResetDate(days = 90) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function hasSequentialPattern(password: string) {
    const normalized = password.toLowerCase();

    for (let index = 0; index <= normalized.length - 4; index += 1) {
        const chunk = normalized.slice(index, index + 4);
        let ascending = true;
        let descending = true;

        for (let offset = 1; offset < chunk.length; offset += 1) {
            const previous = chunk.charCodeAt(offset - 1);
            const current = chunk.charCodeAt(offset);

            ascending &&= current === previous + 1;
            descending &&= current === previous - 1;
        }

        if (ascending || descending) {
            return true;
        }
    }

    return false;
}

function hasRepeatedPattern(password: string) {
    return /(.)\1{3,}/.test(password);
}

function hasWeakDictionaryPattern(password: string, username?: string) {
    const normalized = password.toLowerCase();
    const normalizedUsername = username?.toLowerCase().trim();

    if (normalizedUsername && normalized.includes(normalizedUsername)) {
        return true;
    }

    return COMMON_WEAK_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function validatePasswordPolicy({
    password,
    username,
    passwordHistoryHashes = [],
}: PasswordPolicyContext): PasswordPolicyResult {
    const errors: string[] = [];

    if (password.length < MIN_PASSWORD_LENGTH) {
        errors.push('Password ต้องมีความยาวอย่างน้อย 14 ตัวอักษร');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password ต้องมีตัวพิมพ์เล็กภาษาอังกฤษอย่างน้อย 1 ตัว');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password ต้องมีตัวพิมพ์ใหญ่ภาษาอังกฤษอย่างน้อย 1 ตัว');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password ต้องมีตัวเลขอย่างน้อย 1 ตัว');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push('Password ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว');
    }

    if (hasSequentialPattern(password) || hasRepeatedPattern(password)) {
        errors.push('Password ต้องไม่เป็น pattern เรียงหรือซ้ำเดาง่าย');
    }

    if (hasWeakDictionaryPattern(password, username)) {
        errors.push(
            'Password ต้องไม่เป็นคำที่เดาง่ายหรือเกี่ยวข้องกับชื่อผู้ใช้',
        );
    }

    const nextPasswordHash = hashPassword(password);

    if (passwordHistoryHashes.includes(nextPasswordHash)) {
        errors.push(
            'Password ใหม่ต้องไม่ซ้ำกับรหัสผ่านปัจจุบันหรือประวัติรหัสผ่านเดิม',
        );
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
