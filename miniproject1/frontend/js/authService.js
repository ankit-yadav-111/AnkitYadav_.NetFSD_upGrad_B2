// ============================================================
// authService.js
// Purpose : Updated — login() and signup() now call API.
//           Stores JWT token and role in-memory.
//           Exposes getToken() for storageService.
// ============================================================

const authService = (function () {

    // In-memory session state
    let _session = null;

    // --------------------------------------------------------
    // signup(username, password, role)
    // Calls POST /api/auth/register
    // --------------------------------------------------------
    async function signup(username, password, role = 'Viewer') {
        try {
            const result = await storageService.register({
                username,
                password,
                role
            });
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Registration failed.'
            };
        }
    }

    // --------------------------------------------------------
    // login(username, password)
    // Calls POST /api/auth/login
    // Stores JWT token and role in-memory
    // --------------------------------------------------------
    async function login(username, password) {
        try {
            const result = await storageService.login({ username, password });
            _session = {
                username: result.username,
                role:     result.role,
                token:    result.token
            };
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Invalid credentials. Please try again.'
            };
        }
    }

    // --------------------------------------------------------
    // logout()
    // Clears in-memory session
    // --------------------------------------------------------
    function logout() {
        _session = null;
    }

    // --------------------------------------------------------
    // isLoggedIn()
    // --------------------------------------------------------
    function isLoggedIn() {
        return _session !== null;
    }

    // --------------------------------------------------------
    // getCurrentUser()
    // --------------------------------------------------------
    function getCurrentUser() {
        return _session ? _session.username : null;
    }

    // --------------------------------------------------------
    // getToken()
    // Used by storageService to attach Bearer token
    // --------------------------------------------------------
    function getToken() {
        return _session ? _session.token : null;
    }

    // --------------------------------------------------------
    // getRole()
    // --------------------------------------------------------
    function getRole() {
        return _session ? _session.role : null;
    }

    // --------------------------------------------------------
    // isAdmin()
    // --------------------------------------------------------
    function isAdmin() {
        return _session?.role === 'Admin';
    }

    return {
        signup:         signup,
        login:          login,
        logout:         logout,
        isLoggedIn:     isLoggedIn,
        getCurrentUser: getCurrentUser,
        getToken:       getToken,
        getRole:        getRole,
        isAdmin:        isAdmin
    };

})();