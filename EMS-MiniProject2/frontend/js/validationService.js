// ============================================================
// validationService.js
// Purpose : Owns all client-side form validation logic.
//           Returns field-level error message objects.
// Rules   : Never touches the DOM.
//           Only allowed coupling is employeeService
//           for duplicate email check.
// ============================================================

const validationService = (function () {

    // --------------------------------------------------------
    // validateEmployeeForm(formData, currentId)
    // Validates all fields of the Add / Edit Employee form
    // formData  — plain object with employee field values
    // currentId — (optional) id of employee being edited
    //             passed to skip duplicate email check on
    //             the same employee during edit
    // Returns   — object of field-level error messages
    //             Empty object {} means no errors
    // --------------------------------------------------------
    function validateEmployeeForm(formData, currentId) {
        const errors = {};

        // --- First Name ---
        if (!formData.firstName || formData.firstName.trim() === '') {
            errors.firstName = 'First name is required.';
        }

        // --- Last Name ---
        if (!formData.lastName || formData.lastName.trim() === '') {
            errors.lastName = 'Last name is required.';
        }

        // --- Email ---
        if (!formData.email || formData.email.trim() === '') {
            errors.email = 'Email is required.';
        } else if (!isValidEmail(formData.email.trim())) {
            errors.email = 'Please enter a valid email address.';
        }
        //  else {
        //     // Duplicate email check via employeeService
        //     const existingEmployee = employeeService.getAll().find(function (emp) {
        //         return emp.email.toLowerCase() === formData.email.trim().toLowerCase();
        //     });
        //     if (existingEmployee && existingEmployee.id !== currentId) {
        //         errors.email = 'This email address already exists.';
        //     }
        // }

        // --- Phone ---
        if (!formData.phone || formData.phone.trim() === '') {
            errors.phone = 'Phone number is required.';
        } else if (!/^\d{10}$/.test(formData.phone.trim())) {
            errors.phone = 'Phone number must be exactly 10 digits.';
        }

        // --- Department ---
        const validDepartments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations'];
        if (!formData.department || formData.department.trim() === '') {
            errors.department = 'Department is required.';
        } else if (!validDepartments.includes(formData.department.trim())) {
            errors.department = 'Please select a valid department.';
        }

        // --- Designation ---
        if (!formData.designation || formData.designation.trim() === '') {
            errors.designation = 'Designation is required.';
        }

        // --- Salary ---
        if (!formData.salary && formData.salary !== 0) {
            errors.salary = 'Salary is required.';
        } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
            errors.salary = 'Salary must be a positive number.';
        }

        // --- Join Date ---
        if (!formData.joinDate || formData.joinDate.trim() === '') {
            errors.joinDate = 'Join date is required.';
        }

        // --- Status ---
        const validStatuses = ['Active', 'Inactive'];
        if (!formData.status || formData.status.trim() === '') {
            errors.status = 'Status is required.';
        } else if (!validStatuses.includes(formData.status.trim())) {
            errors.status = 'Please select a valid status.';
        }

        return errors;
    }

    // --------------------------------------------------------
    // validateAuthForm(formData)
    // Validates Signup and Login forms
    // formData  — plain object with auth field values
    //             For login  : { username, password }
    //             For signup : { username, password, confirmPassword }
    // Returns   — object of field-level error messages
    //             Empty object {} means no errors
    // --------------------------------------------------------
    function validateAuthForm(formData) {
        const errors = {};

        // --- Username ---
        if (!formData.username || formData.username.trim() === '') {
            errors.username = 'Username is required.';
        }

        // --- Password ---
        if (!formData.password || formData.password.trim() === '') {
            errors.password = 'Password is required.';
        } else if (formData.password.trim().length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        // --- Confirm Password (Signup only) ---
        if (formData.hasOwnProperty('confirmPassword')) {
            if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
                errors.confirmPassword = 'Please confirm your password.';
            } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
                errors.confirmPassword = 'Passwords do not match.';
            }
        }

        return errors;
    }

    // --------------------------------------------------------
    // isValidEmail(email)
    // Private helper — validates email format
    // --------------------------------------------------------
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

// --------------------------------------------------------
// mapServerErrors(message)
// Translates API 409 Conflict responses into
// field-level inline errors
// --------------------------------------------------------
function mapServerErrors(message) {
    const errors = {};
    if (message && message.toLowerCase().includes('email')) {
        errors.email = message;
    }
    return errors;
}


    // --------------------------------------------------------
    // Expose public methods only
    // --------------------------------------------------------
    return {
        validateEmployeeForm: validateEmployeeForm,
        validateAuthForm: validateAuthForm,
          mapServerErrors:      mapServerErrors
    };

})();
