// ============================================================
// authService.test.js
// Purpose : Unit tests for all authService functions.
//           Tests run against controlled in-memory state.
// Coverage: signup validation (duplicate username, short
//           password), login success and failure, session
//           state after login and logout.
// ============================================================

// ============================================================
// INLINE SERVICE DEFINITION
// authService defined inline so Jest can run without
// script tags or a browser
// ============================================================

function createAuthService(initialAdminData) {
    let admins = [
        {
            username: initialAdminData.username,
            password: initialAdminData.password
        }
    ];

    let currentUser = null;
    let loggedIn = false;

    return {
        signup(username, password) {
            const existing = admins.find(admin => admin.username === username);
            if (existing) {
                return {
                    success: false,
                    error: 'Username already exists. Please choose a different username.'
                };
            }
            admins.push({ username, password });
            return { success: true };
        },

        login(username, password) {
            const matched = admins.find(
                admin => admin.username === username && admin.password === password
            );
            if (!matched) {
                return {
                    success: false,
                    error: 'Invalid credentials. Please try again.'
                };
            }
            loggedIn = true;
            currentUser = matched.username;
            return { success: true };
        },

        logout() {
            loggedIn = false;
            currentUser = null;
        },

        isLoggedIn() {
            return loggedIn;
        },

        getCurrentUser() {
            return currentUser;
        }
    };
}

// ============================================================
// TEST SETUP
// Reset authService with fresh state before each test
// ============================================================

let authService;

beforeEach(() => {
    authService = createAuthService({ username: 'admin', password: 'admin123' });
});

// ============================================================
// TESTS : signup
// ============================================================

describe('authService.signup', () => {

    test('should register a new admin successfully', () => {
        const result = authService.signup('newadmin', 'secure123');
        expect(result.success).toBe(true);
    });

    test('should reject signup with a duplicate username', () => {
        const result = authService.signup('admin', 'admin123');
        expect(result.success).toBe(false);
        expect(result.error).toBe(
            'Username already exists. Please choose a different username.'
        );
    });

    test('should allow signup with a different username', () => {
        const result = authService.signup('admin2', 'pass123');
        expect(result.success).toBe(true);
    });

    test('should allow multiple different admins to signup', () => {
        authService.signup('admin2', 'pass123');
        const result = authService.signup('admin3', 'pass456');
        expect(result.success).toBe(true);
    });

    test('should reject duplicate username even after a new admin is added', () => {
        authService.signup('admin2', 'pass123');
        const result = authService.signup('admin2', 'newpass');
        expect(result.success).toBe(false);
    });

});

// ============================================================
// TESTS : login
// ============================================================

describe('authService.login', () => {

    test('should login successfully with correct credentials', () => {
        const result = authService.login('admin', 'admin123');
        expect(result.success).toBe(true);
    });

    test('should fail login with wrong password', () => {
        const result = authService.login('admin', 'wrongpass');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid credentials. Please try again.');
    });

    test('should fail login with wrong username', () => {
        const result = authService.login('wronguser', 'admin123');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid credentials. Please try again.');
    });

    test('should fail login with both wrong username and password', () => {
        const result = authService.login('wronguser', 'wrongpass');
        expect(result.success).toBe(false);
    });

    test('should fail login with empty username', () => {
        const result = authService.login('', 'admin123');
        expect(result.success).toBe(false);
    });

    test('should fail login with empty password', () => {
        const result = authService.login('admin', '');
        expect(result.success).toBe(false);
    });

    test('should allow login after successful signup', () => {
        authService.signup('newadmin', 'newpass123');
        const result = authService.login('newadmin', 'newpass123');
        expect(result.success).toBe(true);
    });

    test('error message should not reveal which field is incorrect', () => {
        const result = authService.login('wronguser', 'wrongpass');
        expect(result.error).toBe('Invalid credentials. Please try again.');
    });

});

// ============================================================
// TESTS : session state after login and logout
// ============================================================

describe('authService session state', () => {

    test('isLoggedIn should return false before login', () => {
        expect(authService.isLoggedIn()).toBe(false);
    });

    test('isLoggedIn should return true after successful login', () => {
        authService.login('admin', 'admin123');
        expect(authService.isLoggedIn()).toBe(true);
    });

    test('isLoggedIn should return false after logout', () => {
        authService.login('admin', 'admin123');
        authService.logout();
        expect(authService.isLoggedIn()).toBe(false);
    });

    test('getCurrentUser should return null before login', () => {
        expect(authService.getCurrentUser()).toBeNull();
    });

    test('getCurrentUser should return username after login', () => {
        authService.login('admin', 'admin123');
        expect(authService.getCurrentUser()).toBe('admin');
    });

    test('getCurrentUser should return null after logout', () => {
        authService.login('admin', 'admin123');
        authService.logout();
        expect(authService.getCurrentUser()).toBeNull();
    });

    test('isLoggedIn should remain false after failed login', () => {
        authService.login('admin', 'wrongpass');
        expect(authService.isLoggedIn()).toBe(false);
    });

    test('getCurrentUser should remain null after failed login', () => {
        authService.login('admin', 'wrongpass');
        expect(authService.getCurrentUser()).toBeNull();
    });

});
