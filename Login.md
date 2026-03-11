# Login System Guide

เอกสารนี้อธิบายระบบ Login, Session, Menu และการไหลของข้อมูลในโปรเจกต์นี้แบบละเอียด โดยเขียนสำหรับคนที่ยังไม่คุ้นกับ Next.js มาก่อน

## 1. โปรเจกต์นี้คืออะไร

โปรเจกต์นี้เป็นเว็บแอปที่สร้างด้วย Next.js แบบ App Router

สิ่งที่ระบบทำในส่วนที่เกี่ยวกับการเข้าสู่ระบบมี 4 เรื่องหลัก

1. แสดงหน้า Login ให้ผู้ใช้กรอก `username` และ `password`
2. ส่งข้อมูลไปตรวจสอบกับ NextAuth
3. ให้ NextAuth ไปเรียกข้อมูลผู้ใช้จาก mock API ที่รันด้วย `json-server`
4. หลัง Login สำเร็จ ระบบจะสร้าง session และดึงเมนูตามกลุ่มผู้ใช้มาแสดงใน Header
5. ถ้า password หมดอายุ ระบบจะยังไม่สร้าง session แต่จะบังคับให้ไปหน้า Change Password ก่อน

สรุปแบบสั้นมาก

- หน้า Login อยู่ฝั่ง client
- การตรวจสอบผู้ใช้อยู่ฝั่ง server
- ข้อมูลผู้ใช้และเมนูถูกอ่านจาก `db.json` ผ่าน `json-server`
- Header ใช้ session เพื่อรู้ว่าใคร login อยู่ และต้องโหลดเมนูอะไร

## 2. เทคโนโลยีที่ใช้ใน flow นี้

- Next.js 16: เฟรมเวิร์กหลักของระบบ
- App Router: ระบบ route แบบใช้โฟลเดอร์ `app/`
- NextAuth v5: ระบบจัดการ login, session, JWT
- json-server: mock backend สำหรับจำลอง API จริง
- React: ใช้สร้าง UI และ state ฝั่งหน้าเว็บ
- TypeScript: ช่วยกำหนดชนิดข้อมูลให้โค้ดอ่านง่ายและปลอดภัยขึ้น

## 3. คำสั่งที่ใช้รันระบบ

ดูจาก `package.json`

```bash
npm run server
```

ใช้รัน mock API จาก `db.json` ที่พอร์ต `3002`

```bash
npm run dev
```

ใช้รัน Next.js ที่พอร์ต `3000`

```bash
npm run dev:all
```

ใช้รันทั้งสองตัวพร้อมกัน เป็นคำสั่งที่เหมาะที่สุดตอนพัฒนา

## 4. ภาพรวมโครงสร้างไฟล์ที่เกี่ยวข้อง

ไฟล์สำคัญในระบบ login และ menu มีดังนี้

### โฟลเดอร์ `app/`

- `app/layout.tsx`
  ใช้เป็น Root Layout ของทั้งแอป และครอบระบบด้วย SessionProvider

- `app/(auth)/login/page.tsx`
  หน้า Login ที่ผู้ใช้กรอกข้อมูล

- `app/(auth)/change-password/page.tsx`
  หน้าเปลี่ยนรหัสผ่านที่ใช้ในกรณี password หมดอายุและต้องเปลี่ยนก่อนเข้าใช้งาน

- `app/api/auth/[...nextauth]/route.ts`
  route ที่ NextAuth ใช้รับ request เช่น sign in, sign out, session

- `app/api/auth/password-reset-ticket/route.ts`
  route สำหรับออก reset ticket ชั่วคราวหลังยืนยันว่าผู้ใช้กรอกรหัสเดิมถูกและ password หมดอายุจริง

- `app/api/auth/change-password/route.ts`
  route สำหรับตรวจ ticket และบันทึกรหัสผ่านใหม่

- `app/api/menu/me/route.ts`
  route สำหรับคืนเมนูของผู้ใช้ที่ login อยู่ โดยอ่านกลุ่มจาก session

- `app/(main)/layout.tsx`
  layout ของหน้าภายในระบบที่มี Header และ Footer

### โฟลเดอร์ `components/`

- `components/providers/SessionProvider.tsx`
  ครอบแอปด้วย NextAuth SessionProvider เพื่อให้ `useSession()` ใช้งานได้

- `components/layout/Header.tsx`
  ตัวกลางที่ประกอบ header ทั้งหมด และเรียก hook โหลดเมนู

- `components/layout/header/DesktopNav.tsx`
  ส่วนแสดงเมนูบน desktop

- `components/layout/header/MobileNavDrawer.tsx`
  ส่วนแสดงเมนูบนมือถือ

- `components/layout/header/MenuSkeletons.tsx`
  โครง loading ขณะกำลังโหลดเมนู

### โฟลเดอร์ `lib/`

- `lib/auth.ts`
  หัวใจของระบบ login และ session

- `lib/password-utils.ts`
  รวมฟังก์ชัน hash password, ตรวจวันหมดอายุ และตรวจ password policy

- `lib/password-reset-ticket.ts`
  สร้างและตรวจสอบ reset ticket แบบ signed token อายุสั้น

- `lib/user-store.ts`
  อ่านและเขียน `db.json` โดยตรงตอนเปลี่ยนรหัสผ่านและเลื่อนประวัติรหัสผ่าน

- `lib/menu.ts`
  รวม type และข้อมูลเมนูที่ใช้ร่วมกัน

- `lib/use-user-menu.ts`
  custom hook สำหรับโหลดเมนูของผู้ใช้ปัจจุบัน

### ไฟล์ระดับ root

- `proxy.ts`
  บังคับให้หน้าที่ต้อง login ถูกป้องกัน ถ้ายังไม่ login จะ redirect ไป `/login`

- `db.json`
  ฐานข้อมูลจำลองของระบบ มีทั้ง users, groups และ menu permissions

## 5. คำอธิบายโครงสร้างแบบง่ายสำหรับคนเริ่มต้น Next.js

### 5.1 `app/` คืออะไร

ใน Next.js App Router โฟลเดอร์ `app/` ใช้แทนแนวคิด route ของระบบ

ตัวอย่าง

- `app/(auth)/login/page.tsx` จะกลายเป็น URL `/login`
- `app/api/menu/me/route.ts` จะกลายเป็น API URL `/api/menu/me`

### 5.2 `page.tsx` คืออะไร

ไฟล์ `page.tsx` คือหน้าเว็บ

ตัวอย่าง

- `app/(auth)/login/page.tsx` คือหน้า login

### 5.3 `layout.tsx` คืออะไร

`layout.tsx` คือโครงที่ครอบหลายหน้า

ตัวอย่าง

- `app/layout.tsx` ครอบทั้งระบบ
- `app/(main)/layout.tsx` ครอบหน้าภายในที่ต้องมี Header และ Footer

### 5.4 `route.ts` คืออะไร

`route.ts` คือ API endpoint ฝั่ง server

ตัวอย่าง

- `app/api/menu/me/route.ts` ใช้คืนเมนูเป็น JSON

## 6. โครงสร้างข้อมูลใน `db.json`

มี 3 ส่วนสำคัญ

### 6.1 `users`

เก็บข้อมูลผู้ใช้ เช่น

- `USR_LOGIN`: username
- `USR_PASSWORD`: รหัสผ่านแบบ MD5 hash
- `USR_PASSWORD1`, `USR_PASSWORD2`, `USR_PASSWORD3`: ประวัติรหัสผ่านย้อนหลัง 3 ครั้ง
- `USR_NAME`: ชื่อผู้ใช้
- `USR_EMAIL`: อีเมล
- `USR_POSITION`: ตำแหน่งงาน
- `USR_RESETDATE`: วันที่ใช้ตรวจว่ารหัสผ่านหมดอายุแล้วหรือยัง
- `GROUPS`: กลุ่มของผู้ใช้ เช่น Admin, Buyer, Supplier

ตัวอย่างแนวคิด

```json
{
    "USR_LOGIN": "user1",
    "USR_PASSWORD": "827ccb0eea8a706c4c34a16891f84e7b",
    "GROUPS": [
        {
            "GRP_ID": 1,
            "GRP_CODE": "ADM",
            "GRP_NAME": "Admin"
        }
    ]
}
```

หมายเหตุ

- ค่า `827ccb0eea8a706c4c34a16891f84e7b` คือ MD5 ของ `12345`
- นั่นแปลว่าผู้ใช้ตัวอย่างอย่าง `user1` ใช้ password เป็น `12345`

### 6.2 `users_group`

เก็บรายการกลุ่มผู้ใช้ เช่น

- Admin
- Buyer
- Supplier

### 6.3 `authen`

เก็บสิทธิ์เมนูตามกลุ่ม

ตัวอย่างแนวคิด

```json
{
    "USER_GROUP": 1,
    "MENU": [
        {
            "title": "Home",
            "href": "/",
            "requireAuth": true
        }
    ]
}
```

ความหมายคือ

- ถ้าผู้ใช้มีกลุ่ม `1`
- ระบบจะคืนเมนูจาก `MENU` ก้อนนี้ให้ไปแสดงใน Header

## 7. ลำดับการทำงานตั้งแต่เปิดเว็บจนถึงเห็นเมนู

ส่วนนี้คือหัวใจของการทำความเข้าใจระบบ

### 7.1 ตอนเปิดเว็บ

1. ผู้ใช้เปิดเว็บที่หน้าใดหน้าหนึ่ง
2. `proxy.ts` จะทำงานก่อน
3. ถ้ายังไม่มี session และหน้านั้นเป็นหน้าที่ต้อง login ระบบจะ redirect ไป `/login`
4. พร้อมแนบ `callbackUrl` กลับไปด้วย เพื่อให้ login สำเร็จแล้วกลับมาหน้าเดิมได้

ตัวอย่าง

- ผู้ใช้เปิด `/profile`
- ถ้ายังไม่ login จะถูกส่งไป `/login?callbackUrl=/profile`

### 7.2 ตอน render แอป

1. `app/layout.tsx` ทำงาน
2. Layout นี้ครอบ `<SessionProvider>` จาก `components/providers/SessionProvider.tsx`
3. ทำให้ทุก component ฝั่ง client สามารถเรียก `useSession()` ได้

นี่คือสาเหตุที่ `Header.tsx` และหน้า login ใช้ข้อมูล session ได้

### 7.3 ตอนแสดงหน้า Login

ไฟล์ที่เกี่ยวข้องคือ `app/(auth)/login/page.tsx`

ลำดับการทำงาน

1. หน้า login แสดงฟอร์มให้กรอก `username` และ `password`
2. อ่าน `callbackUrl` จาก query string
3. ถ้ามี query string ว่าเพิ่งเปลี่ยนรหัสผ่านสำเร็จ หน้า login จะแสดงข้อความ success
4. เมื่อกด submit จะเรียก `signIn('credentials', ...)`
5. มีการส่งข้อมูลไปยัง NextAuth โดยไม่ redirect ทันที เพราะกำหนด `redirect: false`
6. ถ้า password หมดอายุ ระบบจะเรียก `/api/auth/password-reset-ticket` เพื่อขอ reset ticket
7. ถ้าได้ ticket แล้ว ระบบจะพาไปหน้า `/change-password?token=...`
8. ถ้า login ไม่ผ่าน จะแสดงข้อความผิดพลาดบนฟอร์ม
9. ถ้า login ผ่าน จะ redirect ด้วย `window.location.href = callbackUrl`

## 8. Flow ของ NextAuth ในระบบนี้

หัวใจอยู่ที่ `lib/auth.ts`

### 8.1 `NextAuth(...)`

ไฟล์นี้ export ออกมา 4 ตัว

- `handlers`
- `signIn`
- `signOut`
- `auth`

แต่ละตัวมีหน้าที่ต่างกัน

- `handlers`: ใช้กับ API route `/api/auth/[...nextauth]`
- `signIn`: ใช้สำหรับสั่ง login
- `signOut`: ใช้สำหรับ logout
- `auth`: ใช้อ่าน session ฝั่ง server เช่นใน `proxy.ts` และ API route

### 8.2 Provider ที่ใช้คือ Credentials Provider

ระบบนี้ไม่ได้ login ด้วย Google หรือ GitHub

ระบบนี้ใช้ `Credentials` provider หมายความว่า login ด้วย username และ password ที่เรากำหนดเอง

### 8.3 `authorize(credentials)` ทำอะไร

นี่คือจุดตรวจ username และ password จริง

ลำดับการทำงาน

1. รับ `username` และ `password` จากหน้า login
2. เรียก `getUserByUsername(username)`
3. ฟังก์ชันนี้จะ fetch ไปที่ `http://127.0.0.1:3002/users?USR_LOGIN=<username>`
4. `json-server` จะค้นหา user จาก `db.json`
5. ถ้าเจอ user จะนำ password ที่ผู้ใช้กรอกมา hash ด้วย MD5
6. เปรียบเทียบกับ `USR_PASSWORD` ใน `db.json`
7. ถ้ารหัสถูกต้อง ระบบจะตรวจ `USR_RESETDATE` ต่อทันที
8. ถ้า `USR_RESETDATE` น้อยกว่าหรือเท่ากับเวลาปัจจุบัน ระบบจะถือว่ารหัสผ่านหมดอายุ
9. ถ้ารหัสผ่านยังใช้ได้และ user active อยู่ จะคืน object ของผู้ใช้กลับไป
10. ถ้าไม่ผ่าน จะคืน `null` หรือโยน custom error ตามกรณี

### 8.4 Flow ของ password-expired

ระบบนี้มีเงื่อนไขเพิ่มว่า ต่อให้ username และ password ถูกต้อง แต่ถ้ารหัสผ่านหมดอายุ ผู้ใช้จะยังไม่สามารถเข้าใช้งานระบบได้จนกว่าจะรีเซ็ตรหัสผ่าน

เงื่อนไขที่ใช้ตอนนี้คือ

- ถ้า `USR_RESETDATE <= เวลาปัจจุบัน`
- ระบบถือว่าบัญชีนี้ต้องเปลี่ยนรหัสผ่านก่อน

ลำดับการทำงานจริงมีดังนี้

1. `authorize()` ใน `lib/auth.ts` ตรวจ username และ password ผ่านก่อน
2. ระบบเรียก `isPasswordResetRequired(user.USR_RESETDATE)`
3. ถ้าผลเป็น `true` จะโยน `PasswordResetRequiredError`
4. error นี้สืบทอดจาก `CredentialsSignin`
5. จึงทำให้ NextAuth ส่ง code กลับมาว่า `password-reset-required`
6. หน้า login ตรวจ `result.code` หลัง `signIn(..., { redirect: false })`
7. ถ้า code ตรงกัน หน้า login จะส่ง `username` และ `password` เดิมไปที่ `/api/auth/password-reset-ticket`
8. API นี้จะยืนยันอีกครั้งว่ารหัสถูกต้องและบัญชีนี้ต้องเปลี่ยนรหัสผ่านจริง
9. ถ้าผ่าน ระบบจะสร้าง reset ticket อายุสั้นและส่งกลับมา
10. หน้า login จะ redirect ไป `/change-password` พร้อม `token`, `callbackUrl` และ `reason=password-expired`
11. ตลอด flow นี้จะยังไม่มี session ถูกสร้างขึ้น เพราะ `authorize()` ไม่ได้ return user

แนวทางนี้มีข้อดีคือ

- แยกกรณี “กรอกรหัสผิด” ออกจาก “รหัสผ่านหมดอายุ” ได้ชัดเจน
- ฝั่ง client แสดงข้อความและ redirect ได้ตรงกับสาเหตุจริง
- ผู้ใช้จะยังไม่ถือว่า login สำเร็จจนกว่าจะเปลี่ยนรหัสผ่านเสร็จ
- ฝั่ง server ยังคุมกติกาความปลอดภัยไว้ใน `authorize()`

### 8.5 Reset Ticket คืออะไร

reset ticket คือ token ชั่วคราวที่ใช้อนุญาตให้ผู้ใช้เข้า flow เปลี่ยนรหัสผ่านได้โดยยังไม่ต้องมี session

ข้อมูลที่เก็บอยู่ใน ticket มีอย่างน้อย

- `username`
- `passwordHash`
- `expiresAt`

แนวคิดสำคัญของ ticket นี้คือ

- ถูก sign ด้วย `AUTH_SECRET`
- มีอายุสั้น 10 นาที
- ผูกกับ hash ของรหัสผ่านปัจจุบัน

ผลคือถ้าผู้ใช้เปลี่ยนรหัสผ่านไปแล้ว ticket เก่าจะใช้ไม่ได้ทันที เพราะ `passwordHash` ในฐานข้อมูลไม่ตรงกับค่าเดิมอีกต่อไป

### 8.6 หน้า Change Password ทำงานอย่างไร

ไฟล์ที่เกี่ยวข้องคือ `app/(auth)/change-password/page.tsx`

ลำดับการทำงาน

1. หน้าอ่าน `token` จาก query string
2. เรียก `GET /api/auth/change-password?token=...` เพื่อตรวจ ticket
3. ถ้า ticket ใช้งานได้ ระบบจะคืน `username` และ `displayName`
4. หน้าแสดงฟอร์มกรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน
5. เมื่อ submit จะเรียก `POST /api/auth/change-password`
6. API จะตรวจ ticket อีกรอบ ตรวจว่า `newPassword` กับ `confirmPassword` ตรงกัน และตรวจ password policy
7. ถ้าผ่าน ระบบจะเขียนรหัสผ่านใหม่ลง `db.json`
8. จากนั้น redirect กลับหน้า `/login?message=password-changed`

### 8.7 Password Policy ที่ใช้อยู่ตอนนี้

logic อยู่ใน `lib/password-utils.ts`

กติกาที่ใช้มีดังนี้

1. ความยาวอย่างน้อย 14 ตัวอักษร
2. ต้องมีตัวพิมพ์เล็กภาษาอังกฤษอย่างน้อย 1 ตัว
3. ต้องมีตัวพิมพ์ใหญ่ภาษาอังกฤษอย่างน้อย 1 ตัว
4. ต้องมีตัวเลขอย่างน้อย 1 ตัว
5. ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว
6. ต้องไม่เป็น pattern เรียงหรือซ้ำเดาง่าย เช่น `abcd`, `1234`, หรืออักขระเดิมซ้ำยาวเกินไป
7. ต้องไม่เป็นคำที่เดาง่าย หรือมี username ปนอยู่ใน password
8. ต้องไม่ซ้ำกับรหัสผ่านปัจจุบันและประวัติรหัสผ่านเดิม 3 ครั้งล่าสุด

### 8.8 ตอนเปลี่ยนรหัสผ่าน ระบบเขียนอะไรกลับลงฐานข้อมูล

logic อยู่ใน `lib/user-store.ts`

เมื่อเปลี่ยนรหัสผ่านสำเร็จ ระบบจะ

1. เอา hash ใหม่ไปใส่ `USR_PASSWORD`
2. เลื่อน `USR_PASSWORD` เดิมไปเก็บใน `USR_PASSWORD1`
3. เลื่อนค่าก่อนหน้าไปที่ `USR_PASSWORD2` และ `USR_PASSWORD3`
4. ตั้ง `USR_RESETDATE` ใหม่เป็น 90 วันถัดไป

ดังนั้นระบบจึงตรวจประวัติรหัสผ่านย้อนหลังได้ในรอบถัดไป

### 8.9 ทำไมต้อง map ข้อมูลด้วย `mapUserToSessionUser()`

เพราะข้อมูลใน `db.json` ใช้ชื่อ field แบบ backend เช่น

- `USR_NAME`
- `USR_EMAIL`
- `GRP_NAME`

แต่ฝั่ง session และ UI ต้องการชื่อที่อ่านง่าย เช่น

- `name`
- `email`
- `role`
- `department`
- `groupId`
- `groupCode`

ดังนั้นฟังก์ชันนี้จึงแปลงข้อมูลจากรูปแบบ backend ไปเป็นรูปแบบที่ frontend ใช้งานง่าย

## 9. JWT และ Session ในระบบนี้

ใน `lib/auth.ts` มี callback สำคัญ 2 ตัว

### 9.1 `jwt()` callback

ทำหน้าที่เอาข้อมูลที่จำเป็นใส่ลง token เช่น

- `role`
- `department`
- `groupId`
- `groupCode`

เหตุผลที่ต้องเก็บข้อมูลนี้ใน token เพราะภายหลังเราจะต้องใช้ข้อมูลผู้ใช้ซ้ำ โดยไม่ต้อง query user ใหม่ทุกครั้ง

### 9.2 `session()` callback

ทำหน้าที่เอาข้อมูลจาก token ส่งต่อไปยัง `session.user`

ผลคือ component ฝั่ง client ที่ใช้ `useSession()` จะเห็นข้อมูลแบบนี้

```ts
session.user.name;
session.user.role;
session.user.department;
session.user.groupId;
```

นั่นคือเหตุผลที่ `Header.tsx` รู้ได้ว่า user คนนี้เป็นใคร และอยู่กลุ่มอะไร

## 10. API route ของ NextAuth ทำงานอย่างไร

ไฟล์ `app/api/auth/[...nextauth]/route.ts` สั้นมาก เพราะมันแค่เอา `handlers` จาก `lib/auth.ts` มาใช้

```ts
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
```

ความหมายคือ request ประเภทที่เกี่ยวกับ auth ทั้งหมด เช่น

- `/api/auth/signin`
- `/api/auth/signout`
- `/api/auth/session`

จะถูกส่งไปให้ NextAuth จัดการทั้งหมด

## 11. การป้องกันหน้าเว็บด้วย `proxy.ts`

ไฟล์ `proxy.ts` ทำหน้าที่เหมือนด่านหน้า

ลำดับการทำงาน

1. ทุก request ที่เข้า route ที่ถูก matcher จับไว้ จะผ่าน `proxy.ts` ก่อน
2. `auth((req) => { ... })` จะช่วยให้เข้าถึง `req.auth`
3. ถ้าไม่มี `req.auth?.user` แปลว่ายังไม่ login
4. ระบบจะ redirect ไป `/login`
5. แนบ `callbackUrl` ไว้เพื่อกลับมาหน้าเดิมหลัง login

ไฟล์นี้ยกเว้น route บางชนิด เช่น

- `/login`
- `/forgot-password`
- `/change-password`
- `/about`
- `/api/auth/*`
- static files

ดังนั้นหน้าเหล่านี้เปิดได้แม้ยังไม่ login

## 12. Header โหลดเมนูอย่างไร

ไฟล์ที่เกี่ยวข้องคือ

- `components/layout/Header.tsx`
- `lib/use-user-menu.ts`
- `app/api/menu/me/route.ts`
- `lib/menu.ts`

### 12.1 `Header.tsx` ทำหน้าที่อะไร

หน้าที่หลักของมันตอนนี้คือ

1. อ่าน session ด้วย `useSession()`
2. เรียก `useUserMenu(...)`
3. ส่งข้อมูลเมนูต่อไปให้ `DesktopNav` และ `MobileNavDrawer`
4. แสดง user dropdown และปุ่ม logout

### 12.2 `useUserMenu()` ทำหน้าที่อะไร

hook นี้รับข้อมูล 3 ตัว

1. `isLoggedIn`
2. `isSessionLoading`
3. `groupId`

แล้วตัดสินใจว่าอะไรควรเกิดขึ้น

กรณีที่เป็นไปได้

- ยังโหลด session อยู่: ยังไม่ดึงเมนู
- ยังไม่ login: ใช้ `publicNavItems`
- login แล้วแต่ไม่มี `groupId`: แสดง error
- login แล้วและมี `groupId`: เรียก `/api/menu/me`

hook นี้ส่งค่ากลับมา 4 ตัว

- `navItems`
- `isMenuLoading`
- `menuError`
- `retryLoadMenu`

### 12.3 `app/api/menu/me/route.ts` ทำหน้าที่อะไร

route นี้เป็น server API ของ Next.js

ลำดับการทำงาน

1. เรียก `auth()` เพื่ออ่าน session ฝั่ง server
2. ถ้าไม่เจอ `session.user.groupId` จะคืน `401 Unauthorized`
3. ถ้ามี `groupId` จะ fetch ไปที่ `http://127.0.0.1:3002/authen?USER_GROUP=<groupId>`
4. `json-server` จะอ่านข้อมูลจาก `db.json`
5. route นี้จะคืนข้อมูลกลับมาในรูป

```json
{
  "menu": [ ... ]
}
```

### 12.4 ทำไมใช้ `/api/menu/me` แทน `/api/menu/:groupId`

เพราะปลอดภัยกว่าและแคบกว่า

แนวคิดคือ client ไม่ควรส่ง group ของตัวเองมาบอก server ว่า “ขอเมนูกลุ่มนี้”

แต่ให้ server อ่าน group จาก session ของผู้ใช้เอง จะลดโอกาสที่ client ส่งค่ากลุ่มปลอมเข้ามาได้

## 13. การแสดงเมนูบนหน้าจอ

### 13.1 Desktop

ไฟล์ `components/layout/header/DesktopNav.tsx`

มีหน้าที่

- แสดง skeleton ระหว่างโหลด
- แสดง error พร้อมปุ่ม retry
- แสดงข้อความ no menu
- แสดงเมนูปกติ
- ถ้ามี `children` จะใช้ dropdown

### 13.2 Mobile

ไฟล์ `components/layout/header/MobileNavDrawer.tsx`

มีหน้าที่คล้าย desktop แต่ใช้รูปแบบ drawer และ expandable menu

ถ้าเมนูมีลูก

- กดหัวข้อหลักเพื่อ expand
- กดเมนูย่อยเพื่อเข้าไปยังหน้าและปิด drawer

## 14. การ logout ทำงานอย่างไร

เมื่อกดปุ่ม Logout ใน Header หรือ Mobile Drawer

1. เรียก `signOut({ callbackUrl: '/login' })`
2. NextAuth ลบ session
3. ระบบพากลับไปหน้า `/login`

## 15. การกรองเมนูด้วย `requireAuth`

ใน `Header.tsx` มีฟังก์ชัน `getVisibleNavItems()`

หน้าที่คือกรองเมนูตามสถานะ login

แนวคิดของ `requireAuth`

- `true` = เห็นเฉพาะตอน login แล้ว
- `false` = เห็นเฉพาะตอนยังไม่ login
- `undefined` = เห็นได้ทั้งสองกรณี

ตอนนี้เมนูจาก `authen` ส่วนใหญ่ใช้ `requireAuth: true`
ส่วนเมนู public เช่น Home และ About ถูกเก็บไว้ใน `publicNavItems`

## 16. ลำดับการรับส่งข้อมูลแบบ end-to-end

ส่วนนี้คือภาพรวมตั้งแต่ผู้ใช้พิมพ์รหัสผ่านจนเห็นเมนู

### Flow A: Login

1. ผู้ใช้กรอก username/password ที่ `app/(auth)/login/page.tsx`
2. หน้า login เรียก `signIn('credentials', ...)`
3. NextAuth ส่ง request ไปยัง `/api/auth/*`
4. route `app/api/auth/[...nextauth]/route.ts` ส่งต่อให้ `lib/auth.ts`
5. `authorize()` ใน `lib/auth.ts` fetch ไป `json-server` ที่ `/users?USR_LOGIN=...`
6. `json-server` อ่านข้อมูลจาก `db.json`
7. ถ้า username และ password ถูกต้อง ระบบจะตรวจ `USR_RESETDATE`
8. ถ้า password หมดอายุ ระบบจะตอบกลับด้วย code `password-reset-required`
9. หน้า login จะเรียก `/api/auth/password-reset-ticket` เพื่อขอ ticket ชั่วคราว
10. ถ้า password ยังใช้งานได้ NextAuth จะสร้าง JWT/session
11. callback `jwt()` และ `session()` เติม `role`, `department`, `groupId`, `groupCode`
12. หน้า login พา user ไป `callbackUrl`

### Flow A.1: Forced Reset เมื่อ password หมดอายุ

1. ผู้ใช้กรอก username/password ถูกต้อง
2. `authorize()` ตรวจพบว่า `USR_RESETDATE` หมดอายุแล้ว
3. ระบบโยน `PasswordResetRequiredError`
4. `signIn(..., { redirect: false })` ได้ `result.code === 'password-reset-required'`
5. หน้า login เรียก `POST /api/auth/password-reset-ticket`
6. route นี้ตรวจ username/password กับข้อมูลใน `db.json` ซ้ำอีกครั้ง และตรวจว่า password หมดอายุจริง
7. ถ้าผ่าน route จะสร้าง signed ticket อายุสั้นกลับมา
8. หน้า login redirect ไปหน้า change password แบบนี้

```text
/change-password?callbackUrl=/หน้าที่จะกลับไป&token=<reset-ticket>&reason=password-expired
```

9. หน้า `change-password` เรียก `GET /api/auth/change-password?token=...` เพื่อตรวจ ticket
10. ถ้า ticket ผ่าน ผู้ใช้จึงเห็นฟอร์มกรอกรหัสผ่านใหม่
11. เมื่อ submit หน้า `change-password` จะเรียก `POST /api/auth/change-password`
12. API จะตรวจ password policy และตรวจไม่ให้ซ้ำกับ `USR_PASSWORD`, `USR_PASSWORD1`, `USR_PASSWORD2`, `USR_PASSWORD3`
13. ถ้าสำเร็จ ระบบจะบันทึกลง `db.json` และพากลับหน้า login พร้อมข้อความสำเร็จ
14. หลังจากนั้นผู้ใช้ต้อง login ใหม่ด้วยรหัสผ่านใหม่ จึงจะได้ session จริง

### Flow B: เปิดหน้าภายในระบบหลัง login

1. ผู้ใช้เข้า route ภายใน เช่น `/profile`
2. `proxy.ts` ตรวจพบว่ามี session แล้ว จึงให้ผ่าน
3. `app/(main)/layout.tsx` แสดง `Header`
4. `Header.tsx` ใช้ `useSession()` อ่านข้อมูล user
5. `useUserMenu()` เห็นว่ามี `groupId` จึงเรียก `/api/menu/me`
6. `app/api/menu/me/route.ts` อ่าน `groupId` จาก session
7. route นี้ fetch ไป `json-server` ที่ `/authen?USER_GROUP=<groupId>`
8. `json-server` อ่านเมนูจาก `db.json`
9. route คืน `{ menu: [...] }`
10. `Header` ส่งเมนูไปแสดงใน DesktopNav และ MobileNavDrawer

## 17. ถ้าอยากแก้ระบบในอนาคต ควรแก้ไฟล์ไหน

### อยากเปลี่ยนหน้าตา login

แก้ที่

- `app/(auth)/login/page.tsx`

### อยากเปลี่ยนวิธีตรวจ username/password

แก้ที่

- `lib/auth.ts`

โดยเฉพาะในฟังก์ชัน

- `authorize()`
- `getUserByUsername()`
- `hashPassword()`

### อยากเปลี่ยนกติกา password policy หรือจำนวนวันหมดอายุ

แก้ที่

- `lib/password-utils.ts`

โดยเฉพาะ

- `validatePasswordPolicy()`
- `isPasswordResetRequired()`
- `getNextPasswordResetDate()`

### อยากเปลี่ยนวิธีออก ticket หรืออายุของ ticket

แก้ที่

- `lib/password-reset-ticket.ts`
- `app/api/auth/password-reset-ticket/route.ts`
- `app/api/auth/change-password/route.ts`

### อยากเปลี่ยนวิธีบันทึกรหัสผ่านลง mock database

แก้ที่

- `lib/user-store.ts`

### อยากเปลี่ยนโครงสร้างข้อมูลเมนู

แก้ที่

- `lib/menu.ts`

### อยากเปลี่ยน source ของเมนู

แก้ที่

- `app/api/menu/me/route.ts`
- `lib/use-user-menu.ts`

### อยากเปลี่ยนวิธีแสดงเมนูใน header

แก้ที่

- `components/layout/header/DesktopNav.tsx`
- `components/layout/header/MobileNavDrawer.tsx`
- `components/layout/header/MenuSkeletons.tsx`

### อยากเปลี่ยนหน้าที่ต้อง login

แก้ที่

- `proxy.ts`

## 18. ตัวอย่างข้อมูลสำหรับทดสอบ

จาก `db.json` สามารถทดลองได้เช่น

```text
username: user1
password: 12345
```

กลุ่มที่ได้คือ `Admin`

ตัวอย่างอื่น

- `user2 / 12345` จะได้กลุ่ม `Buyer`
- `user3 / 12345` จะได้กลุ่ม `Supplier`

## 19. ปัญหาที่พบบ่อย

### 19.1 Login ไม่ผ่านทั้งที่กรอกรหัสถูก

ให้ตรวจว่าได้รัน `json-server` หรือยัง

```bash
npm run server
```

หรือรันพร้อมกันเลย

```bash
npm run dev:all
```

ถ้ายังกรอกรหัสถูกแต่เข้าไม่ได้ ให้ตรวจต่อว่า user อาจติดเงื่อนไข `USR_RESETDATE` และถูกบังคับไป flow เปลี่ยนรหัสผ่านหรือไม่

### 19.1.1 Login ผ่านรหัสเดิมได้ แต่ถูกพาไป Change Password

กรณีนี้ถือเป็นพฤติกรรมปกติ ถ้า `USR_RESETDATE` หมดอายุแล้ว

สิ่งสำคัญคือ

- ผู้ใช้ยังไม่ได้ session
- ผู้ใช้ต้องเปลี่ยนรหัสผ่านให้สำเร็จก่อน
- หลังเปลี่ยนรหัสผ่านแล้ว ต้องกลับมา login ใหม่ด้วยรหัสผ่านใหม่

### 19.2 เปิดหน้าแล้วโดนเด้งกลับ login ตลอด

ให้ตรวจว่า

- `AUTH_SECRET` ถูกตั้งไว้ใน `.env.local`
- route นั้นไม่ได้ถูก `proxy.ts` บล็อกโดยไม่มี session

### 19.3 Login ผ่าน แต่เมนูไม่ขึ้น

ให้ตรวจว่า user นั้นมี `GROUPS[0].GRP_ID` หรือไม่

และใน `db.json` มี record ใน `authen` ที่ `USER_GROUP` ตรงกันหรือไม่

## 20. สรุปสั้นที่สุด

ถ้าจะจำ flow นี้ให้จำประโยคเดียว

> หน้า Login ส่ง username/password ไปให้ NextAuth, NextAuth ไปอ่าน user จาก `json-server`, ถ้า password ยังใช้ได้จึงสร้าง session ที่มี `groupId`, แต่ถ้า password หมดอายุระบบจะออก reset ticket ชั่วคราว พาไปหน้า Change Password และจะยังไม่ถือว่า login สำเร็จจนกว่าจะเปลี่ยนรหัสผ่านเสร็จ จากนั้น Header จึงใช้ `groupId` ไปดึงเมนูของผู้ใช้จาก `/api/menu/me`

ถ้าจะอ่านโค้ดต่อเอง แนะนำลำดับนี้

1. `app/(auth)/login/page.tsx`
2. `app/api/auth/[...nextauth]/route.ts`
3. `lib/auth.ts`
4. `proxy.ts`
5. `app/api/menu/me/route.ts`
6. `lib/use-user-menu.ts`
7. `components/layout/Header.tsx`
8. `components/layout/header/DesktopNav.tsx`
9. `components/layout/header/MobileNavDrawer.tsx`

อ่านตามลำดับนี้จะเข้าใจภาพรวมเร็วที่สุด
