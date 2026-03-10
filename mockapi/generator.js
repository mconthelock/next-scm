const fs = require('fs');
const path = require('path');

// Import Templates
const userTemplate = require('./schemas/users');
const { createUserGroup, GROUP_DEFINITIONS } = require('./schemas/users_group');
const { createMenuUser, MENU_DEFINITIONS } = require('./schemas/menu');

const generateDB = () => {
    const db = {
        users: [],
        users_group: [],
        authen: [],
    };

    let userGroupId = 1;
    for (let i = 1; i <= 10; i++) {
        const assignedGroup =
            GROUP_DEFINITIONS[(i - 1) % GROUP_DEFINITIONS.length];
        if (i <= 3) {
            db.users_group.push(createUserGroup(userGroupId, i, assignedGroup));
        }
        db.users.push(
            userTemplate(i, [
                {
                    GRP_ID: assignedGroup.GRP_ID,
                    GRP_CODE: assignedGroup.GRP_CODE,
                    GRP_NAME: assignedGroup.GRP_NAME,
                },
            ]),
        );

        userGroupId += 1;
    }
    db.authen = createMenuUser(MENU_DEFINITIONS);

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
