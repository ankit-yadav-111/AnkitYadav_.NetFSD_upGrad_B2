// ============================================================
// uiService.js
// Purpose : Owns all DOM rendering and UI feedback.
//           Uses jQuery for all DOM operations.
// Rules   : Never contains business logic.
//           Never calls other services directly.
//           Only receives plain data objects from app.js.
// ============================================================

const uiService = (function () {

    // --------------------------------------------------------
    // renderEmployeeTable(employees)
    // Renders all employee rows into the employee table body
    // Columns : ID, Full Name, Email, Department, Designation,
    //           Salary, Join Date, Status, Actions
    // All rows rendered dynamically — no hardcoded HTML rows
    // --------------------------------------------------------
    function renderEmployeeTable(employees) {
        const tbody = $('#employee-table-body');
        tbody.empty();

        if (!employees || employees.length === 0) {
            tbody.append(
                '<tr id="no-employees-row">' +
                '<td colspan="9" class="text-center text-muted py-4">' +
                'No employees found.' +
                '</td>' +
                '</tr>'
            );
            return;
        }

        employees.forEach(function (emp, index) {
            const statusBadgeClass = emp.status === 'Active'
                ? 'badge-status-active'
                : 'badge-status-inactive';

            const deptBadgeClass = getDepartmentBadgeClass(emp.department);

            const formattedSalary = formatSalary(emp.salary);

            const row =
                '<tr class="' + (index % 2 === 0 ? 'row-even' : 'row-odd') + '">' +
                '<td>' + emp.id + '</td>' +
                '<td>' + emp.firstName + ' ' + emp.lastName + '</td>' +
                '<td>' + emp.email + '</td>' +
                '<td><span class="dept-badge ' + deptBadgeClass + '">' + emp.department + '</span></td>' +
                '<td>' + emp.designation + '</td>' +
                '<td>' + formattedSalary + '</td>' +
                '<td>' + emp.joinDate + '</td>' +
                '<td><span class="status-badge ' + statusBadgeClass + '">' + emp.status + '</span></td>' +
                '<td>' +
'<button class="btn btn-sm btn-view me-1" data-id="' + emp.id + '" title="View">' +
'<i class="bi bi-eye"></i>' +
'</button>' +
(authService.isAdmin() ?
'<button class="btn btn-sm btn-edit me-1" data-id="' + emp.id + '" title="Edit">' +
'<i class="bi bi-pencil"></i>' +
'</button>' +
'<button class="btn btn-sm btn-delete" data-id="' + emp.id + '" title="Delete">' +
'<i class="bi bi-trash"></i>' +
'</button>' : '') +
'</td>'
                '</tr>';

            tbody.append(row);
        });
    }

    // --------------------------------------------------------
    // renderDashboardCards(summary)
    // Renders KPI summary cards on the dashboard
    // summary : { total, active, inactive, departments }
    // --------------------------------------------------------
    function renderDashboardCards(summary) {
        $('#card-total-employees').text(summary.total);
        $('#card-active-employees').text(summary.active);
        $('#card-inactive-employees').text(summary.inactive);
        $('#card-total-departments').text(summary.departments);
    }

    // --------------------------------------------------------
    // renderDepartmentBreakdown(data)
    // Renders the department-wise employee count table
    // data : [{ department, count }, ...]
    // --------------------------------------------------------
    function renderDepartmentBreakdown(data) {
        const tbody = $('#department-breakdown-body');
        tbody.empty();

        if (!data || data.length === 0) {
            tbody.append(
                '<tr><td colspan="3" class="text-center text-muted">No data available.</td></tr>'
            );
            return;
        }

        const total = data.reduce(function (sum, item) {
            return sum + item.count;
        }, 0);

        data.forEach(function (item) {
            const percentage = total > 0
                ? Math.round((item.count / total) * 100)
                : 0;

            const deptBadgeClass = getDepartmentBadgeClass(item.department);

            const row =
                '<tr>' +
                '<td><span class="dept-badge ' + deptBadgeClass + '">' + item.department + '</span></td>' +
                '<td>' + item.count + '</td>' +
                '<td>' +
                '<div class="dept-bar-wrapper">' +
                '<div class="dept-bar ' + deptBadgeClass + '" style="width:' + percentage + '%"></div>' +
                '</div>' +
                '<span class="dept-bar-label">' + percentage + '%</span>' +
                '</td>' +
                '</tr>';

            tbody.append(row);
        });
    }

    // --------------------------------------------------------
    // renderRecentEmployees(employees)
    // Renders the last 5 added employees in the recent panel
    // Each entry : ID, Full Name, Department badge,
    //              Designation, Status badge
    // --------------------------------------------------------
    function renderRecentEmployees(employees) {
        const container = $('#recent-employees-list');
        container.empty();

        if (!employees || employees.length === 0) {
            container.append(
                '<p class="text-muted text-center">No recent employees.</p>'
            );
            return;
        }

        employees.forEach(function (emp) {
            const statusBadgeClass = emp.status === 'Active'
                ? 'badge-status-active'
                : 'badge-status-inactive';

            const deptBadgeClass = getDepartmentBadgeClass(emp.department);

            const item =
                '<div class="recent-employee-item">' +
                '<div class="recent-employee-info">' +
                '<span class="recent-employee-id">#' + emp.id + '</span>' +
                '<span class="recent-employee-name">' + emp.firstName + ' ' + emp.lastName + '</span>' +
                '<span class="dept-badge ' + deptBadgeClass + '">' + emp.department + '</span>' +
                '</div>' +
                '<div class="recent-employee-meta">' +
                '<span class="recent-employee-designation">' + emp.designation + '</span>' +
                '<span class="status-badge ' + statusBadgeClass + '">' + emp.status + '</span>' +
                '</div>' +
                '</div>';

            container.append(item);
        });
    }

    // --------------------------------------------------------
    // showModal(type, data)
    // Opens the correct Bootstrap modal with data
    // type : 'add' | 'edit' | 'view' | 'delete'
    // data : employee object (null for add)
    // --------------------------------------------------------
    function showModal(type, data) {
        if (type === 'add') {
            clearForm();
            $('#employee-modal-title').text('Add Employee');
            $('#employee-form-submit-btn').text('Add Employee');
            $('#employee-modal-id').val('');
            $('#employeeModal').modal('show');
        }

        if (type === 'edit') {
            clearForm();
            $('#employee-modal-title').text('Edit Employee');
            $('#employee-form-submit-btn').text('Update Employee');
            populateForm(data);
            $('#employeeModal').modal('show');
        }

        if (type === 'view') {
            populateViewModal(data);
            $('#viewEmployeeModal').modal('show');
        }

        if (type === 'delete') {
            $('#delete-employee-name').text(data.firstName + ' ' + data.lastName);
            $('#confirm-delete-btn').attr('data-id', data.id);
            $('#deleteConfirmModal').modal('show');
        }
    }

    // --------------------------------------------------------
    // populateForm(employee)
    // Pre-populates the Add/Edit modal form
    // with the given employee's current data
    // --------------------------------------------------------
    function populateForm(employee) {
        $('#employee-modal-id').val(employee.id);
        $('#emp-firstName').val(employee.firstName);
        $('#emp-lastName').val(employee.lastName);
        $('#emp-email').val(employee.email);
        $('#emp-phone').val(employee.phone);
        $('#emp-department').val(employee.department);
        $('#emp-designation').val(employee.designation);
        $('#emp-salary').val(employee.salary);
        $('#emp-joinDate').val(employee.joinDate);
        $('#emp-status').val(employee.status);
    }

    // --------------------------------------------------------
    // showToast(message, type)
    // Shows a Bootstrap Toast notification
    // type : 'success' | 'error'
    // --------------------------------------------------------
    function showToast(message, type) {
        const toastEl = $('#app-toast');
        const toastBody = $('#app-toast-body');

        toastEl.removeClass('bg-success bg-danger text-white');

        if (type === 'success') {
            toastEl.addClass('bg-success text-white');
        } else if (type === 'error') {
            toastEl.addClass('bg-danger text-white');
        }

        toastBody.text(message);

        const toast = new bootstrap.Toast(toastEl[0], { delay: 3000 });
        toast.show();
    }

    // --------------------------------------------------------
    // showInlineErrors(errors)
    // Displays field-level error messages below each field
    // errors : object of { fieldName: errorMessage }
    // --------------------------------------------------------
    function showInlineErrors(errors) {
        // Clear all existing errors first
        $('.field-error').text('').hide();
        $('.form-control, .form-select').removeClass('is-invalid');

        Object.keys(errors).forEach(function (field) {
            const errorEl = $('#error-' + field);
            const inputEl = $('#emp-' + field);

            if (errorEl.length) {
                errorEl.text(errors[field]).show();
            }
            if (inputEl.length) {
                inputEl.addClass('is-invalid');
            }
        });
    }

    // --------------------------------------------------------
    // showAuthInlineErrors(errors)
    // Displays field-level error messages for auth forms
    // errors : object of { fieldName: errorMessage }
    // --------------------------------------------------------
    function showAuthInlineErrors(errors) {
        $('.auth-field-error').text('').hide();
        $('.auth-form-control').removeClass('is-invalid');

        Object.keys(errors).forEach(function (field) {
            const errorEl = $('#auth-error-' + field);
            const inputEl = $('#auth-' + field);

            if (errorEl.length) {
                errorEl.text(errors[field]).show();
            }
            if (inputEl.length) {
                inputEl.addClass('is-invalid');
            }
        });
    }

    // --------------------------------------------------------
    // clearForm()
    // Clears all form fields and inline error messages
    // in the Add/Edit Employee modal
    // --------------------------------------------------------
    function clearForm() {
        $('#employee-form')[0].reset();
        $('#employee-modal-id').val('');
        $('.field-error').text('').hide();
        $('.form-control, .form-select').removeClass('is-invalid');
    }

    // --------------------------------------------------------
    // populateViewModal(employee)
    // Private helper
    // Fills the read-only View Employee modal
    // with the given employee data
    // --------------------------------------------------------
    function populateViewModal(employee) {
        $('#view-emp-id').text(employee.id);
        $('#view-emp-firstName').text(employee.firstName);
        $('#view-emp-lastName').text(employee.lastName);
        $('#view-emp-email').text(employee.email);
        $('#view-emp-phone').text(employee.phone);
        $('#view-emp-department').text(employee.department);
        $('#view-emp-designation').text(employee.designation);
        $('#view-emp-salary').text(formatSalary(employee.salary));
        $('#view-emp-joinDate').text(employee.joinDate);

        const statusBadgeClass = employee.status === 'Active'
            ? 'badge-status-active'
            : 'badge-status-inactive';

        $('#view-emp-status')
            .text(employee.status)
            .removeClass('badge-status-active badge-status-inactive')
            .addClass('status-badge ' + statusBadgeClass);
    }

    // --------------------------------------------------------
    // formatSalary(salary)
    // Private helper
    // Formats salary as Indian currency ₹X,XX,XXX
    // --------------------------------------------------------
    function formatSalary(salary) {
        return '₹' + Number(salary).toLocaleString('en-IN');
    }

    // --------------------------------------------------------
    // getDepartmentBadgeClass(department)
    // Private helper
    // Returns CSS class for department badge color
    // --------------------------------------------------------
    function getDepartmentBadgeClass(department) {
        const classes = {
            'Engineering': 'dept-engineering',
            'Marketing': 'dept-marketing',
            'HR': 'dept-hr',
            'Finance': 'dept-finance',
            'Operations': 'dept-operations'
        };
        return classes[department] || 'dept-default';
    }


// --------------------------------------------------------
// renderPagination(pagedResult)
// Renders Bootstrap pagination bar
// --------------------------------------------------------
function renderPagination(pagedResult) {
    const container = $('#pagination-container');
    container.empty();

    if (!pagedResult || pagedResult.totalPages <= 1) {
        return;
    }

    const { page, totalPages, totalCount, pageSize } = pagedResult;

    const start = (page - 1) * pageSize + 1;
    const end   = Math.min(page * pageSize, totalCount);

    let html = `<div class="d-flex justify-content-between align-items-center mt-3">`;
    html += `<span class="pagination-label">Showing ${start}–${end} of ${totalCount} employees</span>`;
    html += `<ul class="pagination mb-0">`;

    // Prev button
    html += `<li class="page-item ${!pagedResult.hasPrevPage ? 'disabled' : ''}">
        <a class="page-link pagination-btn" data-page="${page - 1}" href="#">Prev</a>
    </li>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === page ? 'active' : ''}">
            <a class="page-link pagination-btn" data-page="${i}" href="#">${i}</a>
        </li>`;
    }

    // Next button
    html += `<li class="page-item ${!pagedResult.hasNextPage ? 'disabled' : ''}">
        <a class="page-link pagination-btn" data-page="${page + 1}" href="#">Next</a>
    </li>`;

    html += `</ul></div>`;
    container.html(html);
}

// --------------------------------------------------------
// applyRoleUI()
// Shows/hides write buttons based on Admin/Viewer role
// --------------------------------------------------------
function applyRoleUI() {
     const isAdmin = authService.isAdmin();

    if (isAdmin) {
        $('#nav-add-employee').show();
        $('.btn-edit').show();
        $('.btn-delete').show();
        $('#viewer-notice').hide();
    } else {
        $('#nav-add-employee').hide();
        $('.btn-edit').hide();
        $('.btn-delete').hide();
        $('#viewer-notice').show();
    }
}


    // --------------------------------------------------------
    // Expose public methods only
    // --------------------------------------------------------
    return {
        renderEmployeeTable: renderEmployeeTable,
        renderDashboardCards: renderDashboardCards,
        renderDepartmentBreakdown: renderDepartmentBreakdown,
        renderRecentEmployees: renderRecentEmployees,
        showModal: showModal,
        populateForm: populateForm,
        showToast: showToast,
        showInlineErrors: showInlineErrors,
        showAuthInlineErrors: showAuthInlineErrors,
        clearForm: clearForm,
        renderPagination:       renderPagination,
    applyRoleUI:            applyRoleUI
    };

})();
