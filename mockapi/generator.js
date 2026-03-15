const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

// Import Templates
const { createUserGroup, GROUP_DEFINITIONS } = require('./schemas/users_group');
const { createMenuUser, MENU_DEFINITIONS } = require('./schemas/menu');
const { createStatus, STATUS_DEFINITIONS } = require('./schemas/status');
const createUser = require('./schemas/users');
const createVendor = require('./schemas/vendors');
const createVendorCode = require('./schemas/vendors_code');
const createUserLog = require('./schemas/users_logs');
const createTickets = require('./schemas/tickets');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const generateDB = () => {
    const db = {
        status: [],
        users: [],
        users_group: [],
        vendors: [],
        authen: [],
        logs: [],
        tickets: [],
    };
    // สร้าง status
    db.status = STATUS_DEFINITIONS.map(createStatus);

    // สร้าง vendor และ vendor code
    const usedCodes = new Set();
    for (let i = 1; i <= 1250; i++) {
        const vendor = createVendor(i);
        const codeCount = faker.number.int({ min: 1, max: 3 });

        for (let j = 0; j < codeCount; j++) {
            let uniqueCode;
            do {
                uniqueCode = faker.number
                    .int({ min: 10000, max: 99999 })
                    .toString();
            } while (usedCodes.has(uniqueCode));
            usedCodes.add(uniqueCode);

            const newCode = createVendorCode(vendor.VND_ID, uniqueCode);
            vendor.VENDOR_CODES.push(newCode);
        }
        db.vendors.push(vendor);
    }

    // สร้าง User Group และ User
    db.users_group = GROUP_DEFINITIONS.map(createUserGroup);
    for (let i = 1; i <= 1000; i++) {
        const userStatus = db.status.filter(
            (status) => status.TYPE === 'USERS',
        );
        const randomStatus = userStatus[getRandom(0, userStatus.length)];
        const randomGroup = db.users_group[getRandom(0, db.users_group.length)];
        let vndData = null;
        if (randomGroup.GRP_ID === 3) {
            vndData = db.vendors[getRandom(0, db.vendors.length)];
        }
        let users = createUser(i, randomStatus, randomGroup, vndData);
        db.users.push(users);
    }

    for (let i = 1; i <= 5000; i++) {
        const randomUser = db.users[getRandom(0, db.users.length)].USR_LOGIN;
        const userLog = createUserLog(i, randomUser);
        db.logs.push(userLog);
    }

    db.authen = createMenuUser(MENU_DEFINITIONS);

    for (let i = 1; i <= 2000; i++) {
        const ticket = createTickets(i);
        db.tickets.push(ticket);
    }
    return db;
};

// สั่งเขียนไฟล์
const targetPath = path.join(__dirname, '../db.json');
try {
    const data = generateDB();
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
    console.log('✨ Mock data with Faker.js generated successfully!');
} catch (error) {
    console.error('❌ Error:', error);
}
