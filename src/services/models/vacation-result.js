const Employee = require('../../models/employee');

/**
 * Vacation calculator result
 */
class VacationResult {
    /**
     *
     * @param {Employee} employee
     * @param {number} vacationDays
     */
    constructor(employee, vacationDays) {
        this.employee = employee;
        this.vacationDays = vacationDays;
    }
}
module.exports = VacationResult;