// ============================================================
// app.js
// Purpose : Updated — all data operations are now
//           async/await. Pagination state tracked.
//           Debounced search.
// ============================================================

$(document).ready(function () {

    // --------------------------------------------------------
    // State — filters, sort, pagination
    // --------------------------------------------------------
    const _state = {
        search:    '',
        dept:      '',
        status:    '',
        sortBy:    'name',
        sortDir:   'asc',
        page:      1,
        pageSize:  PAGE_SIZE
    };

    let _searchDebounceTimer = null;

    // --------------------------------------------------------
    // showView(viewId)
    // --------------------------------------------------------
    function showView(viewId) {
        $('#signup-view').hide();
        $('#login-view').hide();
        $('#dashboard-view').hide();
        $('#employee-view').hide();
        $('#' + viewId).show();

        if (viewId === 'dashboard-view' || viewId === 'employee-view') {
            $('#main-navbar').show();
        } else {
            $('#main-navbar').hide();
        }
    }

    // --------------------------------------------------------
    // refreshDashboard()
    // --------------------------------------------------------
    async function refreshDashboard() {
        try {
            const data = await dashboardService.getDashboard();
            uiService.renderDashboardCards({
                total:       data.totalEmployees,
                active:      data.activeEmployees,
                inactive:    data.inactiveEmployees,
                departments: data.totalDepartments
            });
            uiService.renderDepartmentBreakdown(data.departmentBreakdown);
            uiService.renderRecentEmployees(data.recentEmployees);
        } catch (error) {
            uiService.showToast('Failed to load dashboard.', 'error');
        }
    }

    // --------------------------------------------------------
    // refreshEmployeeTable()
    // --------------------------------------------------------
    async function refreshEmployeeTable() {
        try {
            const result = await employeeService.getAll({
                search:   _state.search,
                department: _state.dept,
                status:   _state.status,
                sortBy:   _state.sortBy,
                sortDir:  _state.sortDir,
                page:     _state.page,
                pageSize: _state.pageSize
            });

            uiService.renderEmployeeTable(result.data);
            uiService.renderPagination(result);
           
        //    Check this result.role has been adede
            uiService.applyRoleUI();
        } catch (error) {
            uiService.showToast('Failed to load employees.', 'error');
        }
    }

    // --------------------------------------------------------
    // init()
    // --------------------------------------------------------
    function init() {
        $('#main-navbar').hide();
        if (authService.isLoggedIn()) {
            refreshDashboard();
            showView('dashboard-view');
            setActiveNav('dashboard');
            updateNavbarRole();

             uiService.applyRoleUI();
        } else {
            showView('login-view');
        }
    }

    init();

    // --------------------------------------------------------
    // updateNavbarRole()
    // --------------------------------------------------------
    function updateNavbarRole() {
        const role = authService.getRole();
        $('#navbar-role-badge')
            .text(role)
            .removeClass('bg-success bg-info')
            .addClass(role === 'Admin' ? 'bg-success' : 'bg-info');
    }

    // --------------------------------------------------------
    // setActiveNav(view)
    // --------------------------------------------------------
    function setActiveNav(view) {
        $('#nav-dashboard').removeClass('active');
        $('#nav-employees').removeClass('active');
        if (view === 'dashboard')  $('#nav-dashboard').addClass('active');
        if (view === 'employees')  $('#nav-employees').addClass('active');
    }

    // ========================================================
    // NAVIGATION
    // ========================================================

    $('#nav-dashboard').on('click', async function (e) {
        e.preventDefault();
        if (!authService.isLoggedIn()) { showView('login-view'); return; }
        await refreshDashboard();
        showView('dashboard-view');
        setActiveNav('dashboard');
    });

    $('#nav-employees').on('click', async function (e) {
        e.preventDefault();
        if (!authService.isLoggedIn()) { showView('login-view'); return; }
        _state.page = 1;
        await refreshEmployeeTable();
        showView('employee-view');
        setActiveNav('employees');
    });

    $('#nav-add-employee').on('click', function (e) {
        e.preventDefault();
        if (!authService.isLoggedIn()) { showView('login-view'); return; }
        uiService.showModal('add', null);
    });

    $('#logout-btn').on('click', function (e) {
        e.preventDefault();
        authService.logout();
        $('#main-navbar').hide();
        showView('login-view');
        uiService.showToast('Logged out successfully.', 'success');
    });

    $('#go-to-signup').on('click', function (e) {
        e.preventDefault();
        showView('signup-view');
    });

    $('#go-to-login').on('click', function (e) {
        e.preventDefault();
        showView('login-view');
    });

    // ========================================================
    // AUTH
    // ========================================================

    $('#signup-form').on('submit', async function (e) {
        e.preventDefault();

        const formData = {
            username:        $('#auth-signup-username').val(),
            password:        $('#auth-signup-password').val(),
            confirmPassword: $('#auth-signup-confirmPassword').val()
        };

        const errors = validationService.validateAuthForm(formData);
        if (Object.keys(errors).length > 0) {
            uiService.showAuthInlineErrors(errors);
            return;
        }

        const result = await authService.signup(
            formData.username,
            formData.password,
            'Viewer'
        );

        if (!result.success) {
            uiService.showAuthInlineErrors({ username: result.error });
            return;
        }

        uiService.showToast('Signup successful! Please login.', 'success');
        setTimeout(function () {
            $('#signup-form')[0].reset();
            $('.auth-field-error').text('').hide();
            showView('login-view');
        }, 1500);
    });

    $('#login-form').on('submit', async function (e) {
        e.preventDefault();

        const formData = {
            username: $('#auth-login-username').val(),
            password: $('#auth-login-password').val()
        };

        const errors = validationService.validateAuthForm(formData);
        if (Object.keys(errors).length > 0) {
            uiService.showAuthInlineErrors(errors);
            return;
        }

        const result = await authService.login(formData.username, formData.password);

        if (!result.success) {
            uiService.showAuthInlineErrors({ password: result.error });
            return;
        }

        $('#login-form')[0].reset();
        $('.auth-field-error').text('').hide();
        updateNavbarRole();

         uiService.applyRoleUI();
        await refreshDashboard();
        showView('dashboard-view');
        setActiveNav('dashboard');
        uiService.showToast('Welcome, ' + authService.getCurrentUser() + '!', 'success');
    });

    // ========================================================
    // EMPLOYEE CRUD
    // ========================================================

    $('#employee-form').on('submit', async function (e) {
        e.preventDefault();

        const currentId = $('#employee-modal-id').val();
        const isEdit    = currentId !== '';

        const formData = {
            firstName:   $('#emp-firstName').val(),
            lastName:    $('#emp-lastName').val(),
            email:       $('#emp-email').val(),
            phone:       $('#emp-phone').val(),
            department:  $('#emp-department').val(),
            designation: $('#emp-designation').val(),
            salary:      Number($('#emp-salary').val()),
            joinDate:    $('#emp-joinDate').val(),
            status:      $('#emp-status').val()
        };

        const errors = validationService.validateEmployeeForm(
            formData,
            isEdit ? Number(currentId) : undefined
        );

        if (Object.keys(errors).length > 0) {
            uiService.showInlineErrors(errors);
            return;
        }

        try {
            if (isEdit) {
                await employeeService.update(Number(currentId), formData);
                uiService.showToast('Employee updated successfully.', 'success');
            } else {
                await employeeService.add(formData);
                uiService.showToast('Employee added successfully.', 'success');
            }

            $('#employeeModal').modal('hide');
            uiService.clearForm();
            _state.page = 1;
            await refreshEmployeeTable();
            await refreshDashboard();

        } catch (error) {
            if (error.status === 409) {
                const fieldErrors = validationService.mapServerErrors(error.message);
                uiService.showInlineErrors(fieldErrors);
            } else {
                uiService.showToast('Something went wrong. Please try again.', 'error');
            }
        }
    });

    $('#employee-table-body').on('click', '.btn-view', async function () {
        const id       = Number($(this).attr('data-id'));
        const employee = await employeeService.getById(id);
        uiService.showModal('view', employee);
    });

    $('#employee-table-body').on('click', '.btn-edit', async function () {
        const id       = Number($(this).attr('data-id'));
        const employee = await employeeService.getById(id);
        uiService.showModal('edit', employee);
    });

    $('#employee-table-body').on('click', '.btn-delete', async function () {
        const id       = Number($(this).attr('data-id'));
        const employee = await employeeService.getById(id);
        uiService.showModal('delete', employee);
    });

    $('#confirm-delete-btn').on('click', async function () {
        const id       = Number($(this).attr('data-id'));
        const employee = await employeeService.getById(id);
        const name     = employee.firstName + ' ' + employee.lastName;

        try {
            await employeeService.remove(id);
            $('#deleteConfirmModal').modal('hide');
            _state.page = 1;
            await refreshEmployeeTable();
            await refreshDashboard();
            uiService.showToast(name + ' deleted successfully.', 'success');
        } catch (error) {
            uiService.showToast('Failed to delete employee.', 'error');
        }
    });

    // ========================================================
    // SEARCH, FILTER, SORT
    // ========================================================

    $('#search-input').on('input', function () {
        clearTimeout(_searchDebounceTimer);
        const val = $(this).val();
        _searchDebounceTimer = setTimeout(async function () {
            _state.search = val;
            _state.page   = 1;
            await refreshEmployeeTable();
        }, 350);
    });

    $('#filter-department').on('change', async function () {
        _state.dept = $(this).val() === 'All' ? '' : $(this).val();
        _state.page = 1;
        await refreshEmployeeTable();
    });

    $('input[name="filter-status"]').on('change', async function () {
        _state.status = $(this).val() === 'All' ? '' : $(this).val();
        _state.page   = 1;
        await refreshEmployeeTable();
    });

    $('#sort-select').on('change', async function () {
        const value = $(this).val();
        if (value === '') {
            _state.sortBy  = 'name';
            _state.sortDir = 'asc';
        } else {
            const lastHyphen = value.lastIndexOf('-');
            _state.sortBy  = value.substring(0, lastHyphen);
            _state.sortDir = value.substring(lastHyphen + 1);
        }
        _state.page = 1;
        await refreshEmployeeTable();
    });

    // ========================================================
    // PAGINATION
    // ========================================================

    $(document).on('click', '.pagination-btn', async function (e) {
        e.preventDefault();
        const page = Number($(this).attr('data-page'));
        if (page < 1) return;
        _state.page = page;
        await refreshEmployeeTable();
    });

});