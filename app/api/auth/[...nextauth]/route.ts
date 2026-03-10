/**
 * NextAuth API Route Handler
 * จัดการ /api/auth/* ทั้งหมด เช่น signin, signout, callback, session
 */
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
