import { promises as fs } from 'node:fs';
import path from 'node:path';

/** กลุ่มของผู้ใช้จากฐานข้อมูล mock */
interface ApiUserGroup {
    GRP_ID: number;
    GRP_CODE: string;
    GRP_NAME: string;
}

/** โครงสร้าง user ที่อ่านจาก db.json */
export interface ApiUserRecord {
    USR_ID: number;
    USR_LOGIN: string;
    USR_PASSWORD: string;
    USR_PASSWORD1?: string;
    USR_PASSWORD2?: string;
    USR_PASSWORD3?: string;
    USR_NAME: string;
    USR_EMAIL: string;
    USR_POSITION: string;
    USER_STATUS: number;
    USR_RESETDATE?: string;
    GROUPS?: ApiUserGroup[];
}

/** โครงสร้างฐานข้อมูล mock ทั้งไฟล์ */
interface MockDatabase {
    users: ApiUserRecord[];
    users_group: unknown[];
    authen: unknown[];
}

const DB_PATH = path.join(process.cwd(), 'db.json');

async function readDatabase() {
    const databaseText = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(databaseText) as MockDatabase;
}

async function writeDatabase(database: MockDatabase) {
    await fs.writeFile(
        DB_PATH,
        JSON.stringify(database, null, 2) + '\n',
        'utf8',
    );
}

export async function getUserRecordByUsername(username: string) {
    const database = await readDatabase();

    return (
        database.users.find((user) => user.USR_LOGIN === username.trim()) ??
        null
    );
}

export async function updateUserPasswordRecord(params: {
    username: string;
    newPasswordHash: string;
    nextResetDate: string;
}) {
    const database = await readDatabase();
    const userIndex = database.users.findIndex(
        (user) => user.USR_LOGIN === params.username.trim(),
    );

    if (userIndex === -1) {
        return null;
    }

    const currentUser = database.users[userIndex];

    database.users[userIndex] = {
        ...currentUser,
        USR_PASSWORD: params.newPasswordHash,
        USR_PASSWORD1: currentUser.USR_PASSWORD,
        USR_PASSWORD2: currentUser.USR_PASSWORD1 ?? currentUser.USR_PASSWORD2,
        USR_PASSWORD3: currentUser.USR_PASSWORD2 ?? currentUser.USR_PASSWORD3,
        USR_RESETDATE: params.nextResetDate,
    };

    await writeDatabase(database);

    return database.users[userIndex];
}
