/**
 * Mocks for repository. Allowed to add Employee programmatically
 */
class EmployeeRepositoryMock {
    constructor () {
        this.employees = [];
    }
    add(employee) {
        this.employees.push(employee);
    }
    getAll() {
        return this.employees;
    }
    clear() {
        this.employees = [];
    }
}

module.exports = EmployeeRepositoryMock;