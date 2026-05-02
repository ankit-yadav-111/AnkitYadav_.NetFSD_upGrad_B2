// ============================================================
// dashboardService.js
// Purpose : Updated — getSummary() now calls
//           /api/employees/dashboard — one API call returns
//           KPIs, department breakdown, and recent employees.
// ============================================================

const dashboardService = (function () {

    async function getDashboard() {
        return await storageService.getDashboard();
    }

    return {
        getDashboard: getDashboard
    };

})();