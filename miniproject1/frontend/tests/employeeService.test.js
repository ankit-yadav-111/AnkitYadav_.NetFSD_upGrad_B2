// ============================================================
// employeeService.test.js
// Purpose : Unit tests for all employeeService functions.
//           Tests run against a controlled mock dataset
//           injected via storageService.
// Coverage: add, update, remove, search, filterByDepartment,
//           filterByStatus, applyFilters, sortBy
// ============================================================

// ============================================================
// MOCK DATASET
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
        },
        reset(data) { employees = data.map(emp => Object.assign({}, emp)); }
    };
}

function createEmployeeService(storage) {
    return {
        getAll() { return storage.getAll(); },
        getById(id) { return storage.getById(id); },
        add(data) {
            const newEmployee = {
                id: storage.nextId(),
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: data.email.trim(),
                phone: data.phone.trim(),
                department: data.department.trim(),
                designation: data.designation.trim(),
                salary: Number(data.salary),
                joinDate: data.joinDate.trim(),
                status: data.status.trim()
            };
            storage.add(newEmployee);
            return newEmployee;
        },
        update(id, data) {
            storage.update(id, {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: data.email.trim(),
                phone: data.phone.trim(),
                department: data.department.trim(),
                designation: data.designation.trim(),
                salary: Number(data.salary),
                joinDate: data.joinDate.trim(),
                status: data.status.trim()
            });
        },
        remove(id) { storage.remove(id); },
        search(query) {
            if (!query || query.trim() === '') return storage.getAll();
            const lowerQuery = query.trim().toLowerCase();
            return storage.getAll().filter(emp => {
                const fullName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
                return fullName.includes(lowerQuery) || emp.email.toLowerCase().includes(lowerQuery);
            });
        },
        filterByDepartment(dept) {
            if (!dept || dept.trim() === '' || dept.trim() === 'All') return storage.getAll();
            return storage.getAll().filter(emp => emp.department === dept.trim());
        },
        filterByStatus(status) {
            if (!status || status.trim() === '' || status.trim() === 'All') return storage.getAll();
            return storage.getAll().filter(emp => emp.status === status.trim());
        },
        applyFilters(searchQuery, dept, status) {
            let results = storage.getAll();
            if (searchQuery && searchQuery.trim() !== '') {
                const lowerQuery = searchQuery.trim().toLowerCase();
                results = results.filter(emp => {
                    const fullName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
                    return fullName.includes(lowerQuery) || emp.email.toLowerCase().includes(lowerQuery);
                });
            }
            if (dept && dept.trim() !== '' && dept.trim() !== 'All') {
                results = results.filter(emp => emp.department === dept.trim());
            }
            if (status && status.trim() !== '' && status.trim() !== 'All') {
                results = results.filter(emp => emp.status === status.trim());
            }
            return results;
        },
        sortBy(employees, field, direction) {
            const sorted = [...employees];
            sorted.sort((a, b) => {
                if (field === 'name') {
                    const valA = a.lastName.toLowerCase();
                    const valB = b.lastName.toLowerCase();
                    if (valA < valB) return direction === 'asc' ? -1 : 1;
                    if (valA > valB) return direction === 'asc' ? 1 : -1;
                    return 0;
                }
                if (field === 'salary') {
                    return direction === 'asc'
                        ? Number(a.salary) - Number(b.salary)
                        : Number(b.salary) - Number(a.salary);
                }
                if (field === 'joinDate') {
                    return direction === 'asc'
                        ? new Date(a.joinDate) - new Date(b.joinDate)
                        : new Date(b.joinDate) - new Date(a.joinDate);
                }
                return 0;
            });
            return sorted;
        }
    };
}

// ============================================================
// TEST SETUP
// ============================================================

let storage;
let employeeService;

beforeEach(() => {
    storage = createStorageService(mockEmployees);
    employeeService = createEmployeeService(storage);
});

// ============================================================
// TESTS : add
// ============================================================

describe('employeeService.add', () => {

    test('should add a new employee to the store', () => {
        const newEmp = {
            firstName: 'Kiran', lastName: 'Reddy',
            email: 'kiran.reddy@XYZ.com', phone: '9210987654',
            department: 'HR', designation: 'HR Manager',
            salary: 750000, joinDate: '2015-09-30', status: 'Active'
        };
        employeeService.add(newEmp);
        expect(employeeService.getAll().length).toBe(6);
    });

    test('should auto-increment id correctly', () => {
        const newEmp = {
            firstName: 'Kiran', lastName: 'Reddy',
            email: 'kiran.reddy@XYZ.com', phone: '9210987654',
            department: 'HR', designation: 'HR Manager',
            salary: 750000, joinDate: '2015-09-30', status: 'Active'
        };
        const added = employeeService.add(newEmp);
        expect(added.id).toBe(6);
    });

    test('should trim whitespace and convert salary to number', () => {
        const newEmp = {
            firstName: '  Kiran  ', lastName: '  Reddy  ',
            email: '  kiran.reddy@XYZ.com  ', phone: '9210987654',
            department: 'HR', designation: 'HR Manager',
            salary: '750000', joinDate: '2015-09-30', status: 'Active'
        };
        const added = employeeService.add(newEmp);
        expect(added.firstName).toBe('Kiran');
        expect(added.salary).toBe(750000);
    });

});

// ============================================================
// TESTS : update
// ============================================================

describe('employeeService.update', () => {

    test('should update the correct employee fields', () => {
        const updatedData = {
            firstName: 'Priya', lastName: 'Menon',
            email: 'priya.menon@XYZ.com', phone: '9876543210',
            department: 'Engineering', designation: 'Senior Software Engineer',
            salary: '950000', joinDate: '2021-06-15', status: 'Active'
        };
        employeeService.update(1, updatedData);
        const emp = employeeService.getById(1);
        expect(emp.designation).toBe('Senior Software Engineer');
        expect(emp.salary).toBe(950000);
    });

    test('should not affect other employees when updating one', () => {
        const updatedData = {
            firstName: 'Priya', lastName: 'Menon',
            email: 'priya.menon@XYZ.com', phone: '9876543210',
            department: 'Engineering', designation: 'Lead Engineer',
            salary: '1000000', joinDate: '2021-06-15', status: 'Active'
        };
        employeeService.update(1, updatedData);
        expect(employeeService.getById(2).firstName).toBe('Rahul');
    });

});

// ============================================================
// TESTS : remove
// ============================================================

describe('employeeService.remove', () => {

    test('should remove the employee with the given id', () => {
        employeeService.remove(1);
        expect(employeeService.getById(1)).toBeUndefined();
    });

    test('should reduce total employee count by 1', () => {
        employeeService.remove(1);
        expect(employeeService.getAll().length).toBe(4);
    });

    test('should not affect other employees', () => {
        employeeService.remove(1);
        expect(employeeService.getById(2)).toBeDefined();
        expect(employeeService.getById(2).firstName).toBe('Rahul');
    });

});

// ============================================================
// TESTS : search
// ============================================================

describe('employeeService.search', () => {

    test('should return employees matching first name', () => {
        const results = employeeService.search('Priya');
        expect(results.length).toBe(1);
        expect(results[0].firstName).toBe('Priya');
    });

    test('should return employees matching last name', () => {
        const results = employeeService.search('Sharma');
        expect(results.length).toBe(1);
        expect(results[0].lastName).toBe('Sharma');
    });

    test('should return employees matching email', () => {
        const results = employeeService.search('anjali.verma@XYZ.com');
        expect(results.length).toBe(1);
        expect(results[0].firstName).toBe('Anjali');
    });

    test('should be case-insensitive', () => {
        const results = employeeService.search('priya');
        expect(results.length).toBe(1);
        expect(results[0].firstName).toBe('Priya');
    });

    test('should return all employees when query is empty', () => {
        expect(employeeService.search('').length).toBe(5);
    });

    test('should return empty array when no match found', () => {
        expect(employeeService.search('nonexistent').length).toBe(0);
    });

});

// ============================================================
// TESTS : filterByDepartment
// ============================================================

describe('employeeService.filterByDepartment', () => {

    test('should return only employees in the given department', () => {
        const results = employeeService.filterByDepartment('Engineering');
        expect(results.length).toBe(1);
        expect(results[0].department).toBe('Engineering');
    });

    test('should return all employees when dept is All', () => {
        expect(employeeService.filterByDepartment('All').length).toBe(5);
    });

    test('should return all employees when dept is empty', () => {
        expect(employeeService.filterByDepartment('').length).toBe(5);
    });

    test('should return empty array when no employees in department', () => {
        expect(employeeService.filterByDepartment('Legal').length).toBe(0);
    });

});

// ============================================================
// TESTS : filterByStatus
// ============================================================

describe('employeeService.filterByStatus', () => {

    test('should return only Active employees', () => {
        const results = employeeService.filterByStatus('Active');
        expect(results.length).toBe(3);
        results.forEach(emp => expect(emp.status).toBe('Active'));
    });

    test('should return only Inactive employees', () => {
        const results = employeeService.filterByStatus('Inactive');
        expect(results.length).toBe(2);
        results.forEach(emp => expect(emp.status).toBe('Inactive'));
    });

    test('should return all employees when status is All', () => {
        expect(employeeService.filterByStatus('All').length).toBe(5);
    });

    test('should return all employees when status is empty', () => {
        expect(employeeService.filterByStatus('').length).toBe(5);
    });

});

// ============================================================
// TESTS : applyFilters (AND logic)
// ============================================================

describe('employeeService.applyFilters', () => {

    test('should apply search and department filter together', () => {
        const results = employeeService.applyFilters('Priya', 'Engineering', 'All');
        expect(results.length).toBe(1);
        expect(results[0].firstName).toBe('Priya');
    });

    test('should apply department and status filter together', () => {
        const results = employeeService.applyFilters('', 'HR', 'Inactive');
        expect(results.length).toBe(1);
        expect(results[0].firstName).toBe('Anjali');
    });

    test('should return empty when filters match nothing', () => {
        expect(employeeService.applyFilters('Priya', 'HR', 'All').length).toBe(0);
    });

    test('should return all employees when all filters are default', () => {
        expect(employeeService.applyFilters('', 'All', 'All').length).toBe(5);
    });

    test('should apply all three filters simultaneously', () => {
        const results = employeeService.applyFilters('Rahul', 'Marketing', 'Active');
        expect(results.length).toBe(1);
        expect(results[0].firstName).toBe('Rahul');
    });

});

// ============================================================
// TESTS : sortBy
// ============================================================

describe('employeeService.sortBy', () => {

    test('should sort by name A-Z', () => {
        const sorted = employeeService.sortBy(employeeService.getAll(), 'name', 'asc');
        expect(sorted[0].lastName).toBe('Gupta');
        expect(sorted[sorted.length - 1].lastName).toBe('Verma');
    });

    test('should sort by name Z-A', () => {
        const sorted = employeeService.sortBy(employeeService.getAll(), 'name', 'desc');
        expect(sorted[0].lastName).toBe('Verma');
        expect(sorted[sorted.length - 1].lastName).toBe('Gupta');
    });

    test('should sort by salary low to high', () => {
        const sorted = employeeService.sortBy(employeeService.getAll(), 'salary', 'asc');
        expect(sorted[0].salary).toBe(480000);
        expect(sorted[sorted.length - 1].salary).toBe(900000);
    });

    test('should sort by salary high to low', () => {
        const sorted = employeeService.sortBy(employeeService.getAll(), 'salary', 'desc');
        expect(sorted[0].salary).toBe(900000);
        expect(sorted[sorted.length - 1].salary).toBe(480000);
    });

    test('should sort by joinDate newest first', () => {
        const sorted = employeeService.sortBy(employeeService.getAll(), 'joinDate', 'desc');
        expect(sorted[0].joinDate).toBe('2021-06-15');
        expect(sorted[sorted.length - 1].joinDate).toBe('2017-05-25');
    });

    test('should sort by joinDate oldest first', () => {
        const sorted = employeeService.sortBy(employeeService.getAll(), 'joinDate', 'asc');
        expect(sorted[0].joinDate).toBe('2017-05-25');
        expect(sorted[sorted.length - 1].joinDate).toBe('2021-06-15');
    });

    test('should not mutate the original array', () => {
        const all = employeeService.getAll();
        const originalFirst = all[0].id;
        employeeService.sortBy(all, 'salary', 'asc');
        expect(all[0].id).toBe(originalFirst);
    });

});
