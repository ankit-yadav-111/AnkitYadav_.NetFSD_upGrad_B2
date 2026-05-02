// ============================================================
// storageService.js
// Purpose : Replaced — all methods now make fetch() calls
//           to the API. Sends Authorization Bearer token
//           on every request using authService.getToken()
// ============================================================

const storageService = (function () {

    // --------------------------------------------------------
    // _headers — attach JWT token to every request
    // --------------------------------------------------------
    function _headers(withAuth = true) {
        const headers = { 'Content-Type': 'application/json' };
        if (withAuth) {
            const token = authService.getToken();
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    // --------------------------------------------------------
    // getAll(queryParams)
    // GET /api/employees with search, filter, sort, pagination
    // --------------------------------------------------------
    async function getAll(queryParams = {}) {
        const params = new URLSearchParams();

        if (queryParams.search)     params.append('search',     queryParams.search);
        if (queryParams.department) params.append('department', queryParams.department);
        if (queryParams.status)     params.append('status',     queryParams.status);
        if (queryParams.sortBy)     params.append('sortBy',     queryParams.sortBy);
        if (queryParams.sortDir)    params.append('sortDir',    queryParams.sortDir);
        if (queryParams.page)       params.append('page',       queryParams.page);
        if (queryParams.pageSize)   params.append('pageSize',   queryParams.pageSize);

        const response = await fetch(
            `${API_BASE_URL}/employees?${params.toString()}`,
            { headers: _headers() }
        );

        if (!response.ok) throw new Error('Failed to fetch employees.');
        return await response.json();
    }

    // --------------------------------------------------------
    // getById(id)
    // GET /api/employees/{id}
    // --------------------------------------------------------
    async function getById(id) {
        const response = await fetch(
            `${API_BASE_URL}/employees/${id}`,
            { headers: _headers() }
        );

        if (!response.ok) throw new Error('Employee not found.');
        return await response.json();
    }

    // --------------------------------------------------------
    // add(employeeData)
    // POST /api/employees
    // --------------------------------------------------------
    async function add(employeeData) {
        const response = await fetch(
            `${API_BASE_URL}/employees`,
            {
                method:  'POST',
                headers: _headers(),
                body:    JSON.stringify(employeeData)
            }
        );

        if (response.status === 409) {
            const error = await response.json();
            throw { status: 409, message: error.message };
        }

        if (!response.ok) throw new Error('Failed to add employee.');
        return await response.json();
    }

    // --------------------------------------------------------
    // update(id, employeeData)
    // PUT /api/employees/{id}
    // --------------------------------------------------------
    async function update(id, employeeData) {
        const response = await fetch(
            `${API_BASE_URL}/employees/${id}`,
            {
                method:  'PUT',
                headers: _headers(),
                body:    JSON.stringify(employeeData)
            }
        );

        if (response.status === 409) {
            const error = await response.json();
            throw { status: 409, message: error.message };
        }

        if (response.status === 404) throw new Error('Employee not found.');
        if (!response.ok) throw new Error('Failed to update employee.');
        return await response.json();
    }

    // --------------------------------------------------------
    // remove(id)
    // DELETE /api/employees/{id}
    // --------------------------------------------------------
    async function remove(id) {
        const response = await fetch(
            `${API_BASE_URL}/employees/${id}`,
            {
                method:  'DELETE',
                headers: _headers()
            }
        );

        if (response.status === 404) throw new Error('Employee not found.');
        if (!response.ok) throw new Error('Failed to delete employee.');
        return await response.json();
    }

    // --------------------------------------------------------
    // getDashboard()
    // GET /api/employees/dashboard
    // --------------------------------------------------------
    async function getDashboard() {
        const response = await fetch(
            `${API_BASE_URL}/employees/dashboard`,
            { headers: _headers() }
        );

        if (!response.ok) throw new Error('Failed to fetch dashboard.');
        return await response.json();
    }

    // --------------------------------------------------------
    // login(credentials)
    // POST /api/auth/login
    // --------------------------------------------------------
    async function login(credentials) {
        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method:  'POST',
                headers: _headers(false),
                body:    JSON.stringify(credentials)
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw { status: response.status, message: error.message };
        }

        return await response.json();
    }

    // --------------------------------------------------------
    // register(userData)
    // POST /api/auth/register
    // --------------------------------------------------------
    async function register(userData) {
        const response = await fetch(
            `${API_BASE_URL}/auth/register`,
            {
                method:  'POST',
                headers: _headers(false),
                body:    JSON.stringify(userData)
            }
        );

        if (response.status === 409) {
            const error = await response.json();
            throw { status: 409, message: error.message };
        }

        if (!response.ok) throw new Error('Registration failed.');
        return await response.json();
    }

    return {
        getAll:       getAll,
        getById:      getById,
        add:          add,
        update:       update,
        remove:       remove,
        getDashboard: getDashboard,
        login:        login,
        register:     register
    };

})();