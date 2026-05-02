// ============================================================
// data.js
// Purpose : Static data source for the Employee Management System
//           Contains (1) preloaded employee records
//                    (2) initial admin credentials
// Rules   : No logic. No functions. Data declarations only.
//           No other file modifies this file at runtime.
// ============================================================

const initialEmployees = [
    {
        id: 1,
        firstName: 'Priya',
        lastName: 'Menon',
        email: 'priya.menon@XYZ.com',
        phone: '9876543210',
        department: 'Engineering',
        designation: 'Software Engineer',
        salary: 750000,
        joinDate: '2021-06-15',
        status: 'Active'
    },
    {
        id: 2,
        firstName: 'Rahul',
        lastName: 'Sharma',
        email: 'rahul.sharma@XYZ.com',
        phone: '9823456781',
        department: 'Marketing',
        designation: 'Marketing Executive',
        salary: 550000,
        joinDate: '2020-03-10',
        status: 'Active'
    },
    {
        id: 3,
        firstName: 'Anjali',
        lastName: 'Verma',
        email: 'anjali.verma@XYZ.com',
        phone: '9712345678',
        department: 'HR',
        designation: 'HR Executive',
        salary: 480000,
        joinDate: '2019-08-01',
        status: 'Active'
    },
    {
        id: 4,
        firstName: 'Suresh',
        lastName: 'Iyer',
        email: 'suresh.iyer@XYZ.com',
        phone: '9654321098',
        department: 'Finance',
        designation: 'Financial Analyst',
        salary: 820000,
        joinDate: '2018-11-20',
        status: 'Active'
    },
    {
        id: 5,
        firstName: 'Neha',
        lastName: 'Gupta',
        email: 'neha.gupta@XYZ.com',
        phone: '9543210987',
        department: 'Operations',
        designation: 'Operations Manager',
        salary: 900000,
        joinDate: '2017-05-25',
        status: 'Active'
    },
    {
        id: 6,
        firstName: 'Arjun',
        lastName: 'Patel',
        email: 'arjun.patel@XYZ.com',
        phone: '9432109876',
        department: 'Engineering',
        designation: 'Senior Software Engineer',
        salary: 1200000,
        joinDate: '2016-02-14',
        status: 'Active'
    },
    {
        id: 7,
        firstName: 'Divya',
        lastName: 'Nair',
        email: 'divya.nair@XYZ.com',
        phone: '9321098765',
        department: 'Marketing',
        designation: 'Content Strategist',
        salary: 620000,
        joinDate: '2022-01-10',
        status: 'Inactive'
    },
    {
        id: 8,
        firstName: 'Kiran',
        lastName: 'Reddy',
        email: 'kiran.reddy@XYZ.com',
        phone: '9210987654',
        department: 'HR',
        designation: 'HR Manager',
        salary: 750000,
        joinDate: '2015-09-30',
        status: 'Active'
    },
    {
        id: 9,
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'vikram.singh@XYZ.com',
        phone: '9109876543',
        department: 'Finance',
        designation: 'Accounts Executive',
        salary: 510000,
        joinDate: '2023-04-05',
        status: 'Active'
    },
    {
        id: 10,
        firstName: 'Sneha',
        lastName: 'Joshi',
        email: 'sneha.joshi@XYZ.com',
        phone: '9098765432',
        department: 'Operations',
        designation: 'Logistics Coordinator',
        salary: 470000,
        joinDate: '2021-11-18',
        status: 'Inactive'
    },
    {
        id: 11,
        firstName: 'Rohit',
        lastName: 'Kumar',
        email: 'rohit.kumar@XYZ.com',
        phone: '8987654321',
        department: 'Engineering',
        designation: 'QA Engineer',
        salary: 680000,
        joinDate: '2020-07-22',
        status: 'Active'
    },
    {
        id: 12,
        firstName: 'Meera',
        lastName: 'Pillai',
        email: 'meera.pillai@XYZ.com',
        phone: '8876543210',
        department: 'Marketing',
        designation: 'Brand Manager',
        salary: 950000,
        joinDate: '2019-03-15',
        status: 'Inactive'
    },
    {
        id: 13,
        firstName: 'Aditya',
        lastName: 'Chopra',
        email: 'aditya.chopra@XYZ.com',
        phone: '8765432109',
        department: 'Finance',
        designation: 'Senior Financial Analyst',
        salary: 1100000,
        joinDate: '2018-06-01',
        status: 'Active'
    },
    {
        id: 14,
        firstName: 'Pooja',
        lastName: 'Desai',
        email: 'pooja.desai@XYZ.com',
        phone: '8654321098',
        department: 'Operations',
        designation: 'Supply Chain Analyst',
        salary: 720000,
        joinDate: '2022-08-09',
        status: 'Active'
    },
    {
        id: 15,
        firstName: 'Manish',
        lastName: 'Tiwari',
        email: 'manish.tiwari@XYZ.com',
        phone: '8543210987',
        department: 'HR',
        designation: 'Talent Acquisition Specialist',
        salary: 530000,
        joinDate: '2023-02-28',
        status: 'Inactive'
    }
];

// ============================================================
// Initial Admin Credentials
// Used by authService.js to seed the in-memory admin store
// ============================================================

const initialAdmin = {
    username: 'admin',
    password: 'admin123'
};
