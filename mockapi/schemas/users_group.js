const GROUP_DEFINITIONS = [
    { GRP_ID: 1, GRP_CODE: 'ADM', GRP_NAME: 'Admin', GRP_STATUS: 1 },
    { GRP_ID: 2, GRP_CODE: 'BUYER', GRP_NAME: 'Buyer', GRP_STATUS: 1 },
    { GRP_ID: 3, GRP_CODE: 'VIEW', GRP_NAME: 'Purchase Viewer', GRP_STATUS: 1 },
    {
        GRP_ID: 4,
        GRP_CODE: 'PURSEM',
        GRP_NAME: 'Purchase Manager (SEM)',
        GRP_STATUS: 1,
    },
    {
        GRP_ID: 5,
        GRP_CODE: 'PURDDEM',
        GRP_NAME: 'Purchase Manager (DDEM)',
        GRP_STATUS: 1,
    },
    {
        GRP_ID: 6,
        GRP_CODE: 'PURDEM',
        GRP_NAME: 'Purchase Manager (DEM)',
        GRP_STATUS: 1,
    },
    {
        GRP_ID: 7,
        GRP_CODE: 'PURDDIM',
        GRP_NAME: 'Purchase Manager (DDIM)',
        GRP_STATUS: 1,
    },
    {
        GRP_ID: 8,
        GRP_CODE: 'PURDIM',
        GRP_NAME: 'Purchase Manager (DIM)',
        GRP_STATUS: 1,
    },
    { GRP_ID: 9, GRP_CODE: 'QCREP', GRP_NAME: 'QC Reporter', GRP_STATUS: 1 },
    { GRP_ID: 10, GRP_CODE: 'QCINC', GRP_NAME: 'QC In-change', GRP_STATUS: 1 },
    { GRP_ID: 11, GRP_CODE: 'QCENG', GRP_NAME: 'QC Engineer', GRP_STATUS: 1 },
    { GRP_ID: 12, GRP_CODE: 'QCMAN', GRP_NAME: 'QC Manager', GRP_STATUS: 1 },
    { GRP_ID: 13, GRP_CODE: 'WHR', GRP_NAME: 'Warehouse', GRP_STATUS: 1 },
    { GRP_ID: 14, GRP_CODE: 'PC', GRP_NAME: 'PC User', GRP_STATUS: 1 },
    { GRP_ID: 15, GRP_CODE: 'ACC', GRP_NAME: 'Account user', GRP_STATUS: 1 },
    { GRP_ID: 16, GRP_CODE: 'VENDOR', GRP_NAME: 'Vendor', GRP_STATUS: 1 },
];
const createUserGroup = (group) => group;
module.exports = { createUserGroup, GROUP_DEFINITIONS };
