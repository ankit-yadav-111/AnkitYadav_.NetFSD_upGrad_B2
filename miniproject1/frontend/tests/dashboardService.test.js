// ============================================================
// dashboardService.test.js
// Purpose : Unit tests for all dashboardService functions.
//           Tests run against a controlled mock dataset.
// Coverage: getSummary() correct counts,
//           getDepartmentBreakdown() accurate per-dept totals,
//           getRecentEmployees(n) correct last-n records.
// ============================================================

// ============================================================
// MOCK DATASET
// Controlled test data — independent of data.js
// ============================================================

const mockEmployees = [
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
        status: 'Inactive'
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
        status: 'Inactive'
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
        department: 'Engineering',
        designation: 'QA Engineer',
        salary: 680000,
        joinDate: '2022-01-10',
        status: 'Inactive'
    }
];

// ============================================================
// INLINE SERVICE DEFINITIONS
// ============================================================

function createStorageService(initialData) {
    let employees = initialData.map(emp => Object.assign({}, emp));
    return {
        getAll() { return [...employees]; },
        getById(id) { return employees.find(emp => emp.id === id); },
        add(employee) { employees.push(employee); },
        update(id, data) {
            const index = employees.findIndex(emp => emp.id === id);
            if (index !== -1) {
                employees[index] = Object.assign({}, employees[index], data);
            }
        },
        remove(id) { employees = employees.filter(emp => emp.id !== id); },
        nextId() {
            if (employees.length === 0) return 1;
            return Math.max(...employees.map(emp => emp.id)) + 1;
        }
    };
}

function createEmployeeService(storage) {
    return {
        getAll() { return storage.getAll(); },
        getById(id) { return storage.getById(id); }
    };
}

function createDashboardService(empService) {
    return {
        getSummary() {
            const all = empService.getAll();

            const total = all.length;

            const active = all.filter(emp => emp.status === 'Active').length;

            const inactive = all.filter(emp => emp.status === 'Inactive').length;

            const uniqueDepartments = all
                .map(emp => emp.department)
                .filter((dept, index, self) => self.indexOf(dept) === index);

            return {
                total,
                active,
                inactive,
                departments: uniqueDepartments.length
            };
        },

        getDepartmentBreakdown() {
            const all = empService.getAll();
            const breakdown = {};

            all.forEach(emp => {
                if (breakdown[emp.department]) {
                    breakdown[emp.department]++;
                } else {
                    breakdown[emp.department] = 1;
                }
            });

            return Object.keys(breakdown).map(dept => ({
                department: dept,
                count: breakdown[dept]
            }));
        },

        getRecentEmployees(n) {
            const all = empService.getAll();
            const sorted = all.slice().sort((a, b) => b.id - a.id);
            return sorted.slice(0, n);
        }
    };
}

// ============================================================
// TEST SETUP
// ============================================================

let storage;
let employeeService;
let dashboardService;

beforeEach(() => {
    storage = createStorageService(mockEmployees);
    employeeService = createEmployeeService(storage);
    dashboardService = createDashboardService(employeeService);
});

// ============================================================
// TESTS : getSummary
// ============================================================

describe('dashboardService.getSummary', () => {

    test('should return correct total employee count', () => {
        const summary = dashboardService.getSummary();
        expect(summary.total).toBe(7);
    });

    test('should return correct active employee count', () => {
        const summary = dashboardService.getSummary();
        expect(summary.active).toBe(4);
    });

    test('should return correct inactive employee count', () => {
        const summary = dashboardService.getSummary();
        expect(summary.inactive).toBe(3);
    });

    test('should return correct total departments count', () => {
        const summary = dashboardService.getSummary();
        expect(summary.departments).toBe(5);
    });

    test('active and inactive counts should add up to total', () => {
        const summary = dashboardService.getSummary();
        expect(summary.active + summary.inactive).toBe(summary.total);
    });

    test('should return zero counts when store is empty', () => {
        storage = createStorageService([]);
        employeeService = createEmployeeService(storage);
        dashboardService = createDashboardService(employeeService);
        const summary = dashboardService.getSummary();
        expect(summary.total).toBe(0);
        expect(summary.active).toBe(0);
        expect(summary.inactive).toBe(0);
        expect(summary.departments).toBe(0);
    });

    test('should return summary object with all required keys', () => {
        const summary = dashboardService.getSummary();
        expect(summary).toHaveProperty('total');
        expect(summary).toHaveProperty('active');
        expect(summary).toHaveProperty('inactive');
        expect(summary).toHaveProperty('departments');
    });

});

// ============================================================
// TESTS : getDepartmentBreakdown
// ============================================================

describe('dashboardService.getDepartmentBreakdown', () => {

    test('should return breakdown for all departments present', () => {
        const breakdown = dashboardService.getDepartmentBreakdown();
        expect(breakdown.length).toBe(5);
    });

    test('should return correct count for Engineering department', () => {
        const breakdown = dashboardService.getDepartmentBreakdown();
        const eng = breakdown.find(item => item.department === 'Engineering');
        expect(eng).toBeDefined();
        expect(eng.count).toBe(3);
    });

    test('should return correct count for Marketing department', () => {
        const breakdown = dashboardService.getDepartmentBreakdown();
        const mkt = breakdown.find(item => item.department === 'Marketing');
        expect(mkt).toBeDefined();
        expect(mkt.count).toBe(1);
    });

    test('should return correct count for HR department', () => {
        const breakdown = dashboardService.getDepartmentBreakdown();
        const hr = breakdown.find(item => item.department === 'HR');
        expect(hr).toBeDefined();
        expect(hr.count).toBe(1);
    });

    test('should return correct count for Finance department', () => {
        const breakdown = dashboardService.getDepartmentBreakdown();
        const fin = breakdown.find(item => item.department === 'Finance');
        expect(fin).toBeDefined();
        expect(fin.count).toBe(1);
    });

    test('should return correct count for Operations department', () => {
        const breakdown = dashboardService.getDepartmentBreakdown();
        const ops = breakdown.find(item => item.department === 'Operations');
        expect(ops).toBeDefined();
        expect(ops.count).toBe(1);
    });

    test('total of all department counts should equal total employees', () => {
        const breakdown = dashboardService.getDepartmentBreakdown();
        const totalCount = breakdown.reduce((sum, item) => sum + item.count, 0);
        expect(totalCount).toBe(7);
    });

    test('each breakdown item should have department and count keys', () => {
        const breakdown = dashboardService.getDepartmentBreakdown();
        breakdown.forEach(item => {
            expect(item).toHaveProperty('department');
            expect(item).toHaveProperty('count');
        });
    });

    test('should return empty array when store is empty', () => {
        storage = createStorageService([]);
        employeeService = createEmployeeService(storage);
        dashboardService = createDashboardService(employeeService);
        const breakdown = dashboardService.getDepartmentBreakdown();
        expect(breakdown.length).toBe(0);
    });

});

// ============================================================
// TESTS : getRecentEmployees(n)
// ============================================================

describe('dashboardService.getRecentEmployees', () => {

    test('should return correct number of recent employees', () => {
        const recent = dashboardService.getRecentEmployees(5);
        expect(recent.length).toBe(5);
    });

    test('should return employees with highest ids first', () => {
        const recent = dashboardService.getRecentEmployees(3);
        expect(recent[0].id).toBe(7);
        expect(recent[1].id).toBe(6);
        expect(recent[2].id).toBe(5);
    });

    test('should return only 1 employee when n is 1', () => {
        const recent = dashboardService.getRecentEmployees(1);
        expect(recent.length).toBe(1);
        expect(recent[0].id).toBe(7);
    });

    test('should return all employees when n exceeds total count', () => {
        const recent = dashboardService.getRecentEmployees(20);
        expect(recent.length).toBe(7);
    });

    test('should return empty array when store is empty', () => {
        storage = createStorageService([]);
        employeeService = createEmployeeService(storage);
        dashboardService = createDashboardService(employeeService);
        const recent = dashboardService.getRecentEmployees(5);
        expect(recent.length).toBe(0);
    });

    test('most recently added employee should always be first', () => {
        const recent = dashboardService.getRecentEmployees(5);
        expect(recent[0].id).toBe(7);
        expect(recent[0].firstName).toBe('Divya');
    });

});
