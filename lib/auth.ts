import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// ขยาย type ของ next-auth เพื่อเพิ่ม role และ department
declare module 'next-auth' {
    /** ข้อมูล session.user ที่จะเข้าถึงได้ใน client */
    interface User {
        role?: string;
        department?: string;
    }
}

/**
 * NextAuth configuration
 *
 * ใช้ Credentials provider (username + password) — คล้ายกับ Passport Local Strategy
 * ตอนนี้เป็น mock user สำหรับ dev, เปลี่ยนเป็นเรียก API จริงได้ใน authorize()
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    // ต้องมี secret สำหรับเข้ารหัส JWT/session และ token ภายในของ Auth.js
    secret: process.env.AUTH_SECRET,

    providers: [
        Credentials({
            // ฟิลด์ที่จะแสดงในฟอร์ม (ใช้เฉพาะ built-in page ถ้าไม่ได้สร้าง custom)
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            /**
             * authorize — ตรวจสอบ username/password
             * TODO: เปลี่ยนเป็นเรียก API จริง หรือเช็คกับ database
             */
            async authorize(credentials) {
                const { username, password } = credentials as {
                    username: string;
                    password: string;
                };

                // --- Mock users สำหรับทดสอบ ---
                const mockUsers = [
                    {
                        id: '1',
                        username: 'admin',
                        password: 'admin123',
                        name: 'Somsak Mitsubishi',
                        email: 'somsak@mea.co.th',
                        role: 'Administrator',
                        department: 'SCM Department',
                    },
                    {
                        id: '2',
                        username: 'user',
                        password: 'user123',
                        name: 'Somchai Test',
                        email: 'somchai@mea.co.th',
                        role: 'User',
                        department: 'Logistics',
                    },
                ];

                const user = mockUsers.find(
                    (u) => u.username === username && u.password === password,
                );

                if (!user) return null;

                // ส่งกลับ user object (จะถูกเก็บใน JWT token)
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                };
            },
        }),
    ],

    // กำหนดหน้า login เอง (ไม่ใช้ built-in)
    pages: {
        signIn: '/login',
    },

    callbacks: {
        /**
         * jwt callback — เพิ่ม role และ department เข้าไปใน token
         */
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as Record<string, unknown>).role as string;
                token.department = (user as Record<string, unknown>)
                    .department as string;
            }
            return token;
        },

        /**
         * session callback — ส่ง role และ department ไปยัง client session
         */
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.department = token.department as string;
            }
            return session;
        },
    },

    // ใช้ JWT strategy (ไม่ต้องมี database)
    session: {
        strategy: 'jwt',
    },
});
