const STATUS_DEFINITIONS = [
    {
        id: 1,
        STATUS_ID: 0,
        STATUS_DESC: 'Inactive',
        TYPE: 'USERS',
        TONE: 'danger',
    },
    {
        id: 2,
        STATUS_ID: 1,
        STATUS_DESC: 'Active',
        TYPE: 'USERS',
        TONE: 'success',
    },
    {
        id: 3,
        STATUS_ID: 2,
        STATUS_DESC: 'Locked',
        TYPE: 'USERS',
        TONE: 'warning',
    },
];
const createStatus = (status) => status;
module.exports = { createStatus, STATUS_DEFINITIONS };
