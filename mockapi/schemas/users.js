const crypto = require('crypto');
const { faker } = require('@faker-js/faker');

const DEFAULT_PASSWORD = '12345';

const hashPassword = (password) =>
    crypto.createHash('md5').update(password).digest('hex');

// ฟังก์ชันสำหรับสร้าง User 1 คน
const createUser = (id, status, group, vnd) => ({
    id: id,
    USR_ID: id,
    USR_LOGIN: `user${id}`,
    USR_PASSWORD: hashPassword(DEFAULT_PASSWORD),
    USR_PASSWORD1: hashPassword(DEFAULT_PASSWORD),
    USR_PASSWORD2: hashPassword(DEFAULT_PASSWORD),
    USR_PASSWORD3: hashPassword(DEFAULT_PASSWORD),
    USR_NAME: faker.person.fullName(),
    USR_EMAIL: faker.internet.email(),
    USR_POSITION: faker.person.jobTitle(),
    USR_RESETDATE: faker.date.past().toISOString(),
    USER_STATUS: status,
    GROUPS: group,
    VENDORS: vnd,
    USR_CREATED: faker.date.past().toISOString(),
});

module.exports = createUser;
