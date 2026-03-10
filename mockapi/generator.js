const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

// Import Templates
const createVendor = require('./schemas/vendors');
const createVendorCode = require('./schemas/vendors_code');

const generateDB = () => {
    const db = { vendors: [] };

    //Create Vendor data
    const usedCodes = new Set();
    let codeIdCounter = 1;
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
