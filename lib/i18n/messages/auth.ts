import type { Locale } from '@/lib/i18n/config';
import type { AuthMessages } from '@/lib/i18n/types';

/** ข้อความในกลุ่ม auth เช่น login และ change password */
export const authMessages: Record<Locale, AuthMessages> = {
    th: {
        login: {
            title: 'Supply Chain Management',
            subtitle: 'เข้าสู่ระบบเพื่อดำเนินการต่อ',
            username: 'ชื่อผู้ใช้',
            password: 'รหัสผ่าน',
            submit: 'เข้าสู่ระบบ',
            forgotPassword: 'ลืมรหัสผ่าน?',
            invalidCredentials: 'Username หรือ Password ไม่ถูกต้อง',
            passwordExpiredError:
                'รหัสผ่านหมดอายุ กรุณาเปลี่ยนรหัสผ่านก่อนเข้าสู่ระบบ',
            passwordChangedSuccess:
                'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่',
            startResetFailed: 'ไม่สามารถเริ่มขั้นตอนเปลี่ยนรหัสผ่านได้',
        },
        changePassword: {
            title: 'เปลี่ยนรหัสผ่าน',
            subtitle: 'เปลี่ยนรหัสผ่านก่อนเข้าสู่ระบบอีกครั้ง',
            username: 'ชื่อผู้ใช้',
            newPassword: 'รหัสผ่านใหม่',
            confirmNewPassword: 'ยืนยันรหัสผ่านใหม่',
            submit: 'เปลี่ยนรหัสผ่าน',
            checkingAccess: 'กำลังตรวจสอบสิทธิ์...',
            submitting: 'กำลังเปลี่ยนรหัสผ่าน...',
            invalidTicket: 'ลิงก์เปลี่ยนรหัสผ่านไม่ถูกต้องหรือหมดอายุ',
            unableToChange: 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
            backToLogin: 'กลับไปหน้า Login',
            policyTitle: 'Password policy',
            policyItems: [
                'ต้องมีความยาวอย่างน้อย 14 ตัวอักษร',
                'ต้องมีตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษอย่างละ 1',
                'ต้องไม่เป็น pattern เรียงหรือเดาง่าย',
                'ต้องไม่ซ้ำกับรหัสผ่านปัจจุบันหรือประวัติรหัสผ่าน 3 ครั้งล่าสุด',
            ],
        },
    },
    en: {
        login: {
            title: 'Supply Chain Management',
            subtitle: 'Sign in to continue',
            username: 'Username',
            password: 'Password',
            submit: 'Sign In',
            forgotPassword: 'Forgot password?',
            invalidCredentials: 'Username or password is incorrect',
            passwordExpiredError:
                'Your password has expired. Please change it before signing in.',
            passwordChangedSuccess:
                'Password changed successfully. Please sign in with your new password.',
            startResetFailed: 'Unable to start the password change flow',
        },
        changePassword: {
            title: 'Change Password',
            subtitle: 'Change your password before signing in again',
            username: 'Username',
            newPassword: 'New Password',
            confirmNewPassword: 'Confirm New Password',
            submit: 'Change Password',
            checkingAccess: 'Checking access...',
            submitting: 'Changing password...',
            invalidTicket: 'This password reset link is invalid or expired',
            unableToChange: 'Unable to change password',
            backToLogin: 'Back to Login',
            policyTitle: 'Password policy',
            policyItems: [
                'Must be at least 14 characters long',
                'Must include uppercase, lowercase, number, and special character',
                'Must not use an easy sequential or predictable pattern',
                'Must not match the current password or the last 3 password history entries',
            ],
        },
    },
};
