// ============================================================
// employeeService.js
// Purpose : Updated — methods are now async delegates
//           to storageService. applyFilters removed —
//           filtering and sorting now happen on the server.
// ============================================================

const employeeService = (function () {

    async function getAll(queryParams = {}) {
        return await storageService.getAll(queryParams);
    }

    async function getById(id) {
        return await storageService.getById(id);
    }

    async function add(data) {
        return await storageService.add(data);
    }

    async function update(id, data) {
        return await storageService.update(id, data);
    }

    async function remove(id) {
        return await storageService.remove(id);
    }

    return {
        getAll:  getAll,
        getById: getById,
        add:     add,
        update:  update,
        remove:  remove
    };

})();