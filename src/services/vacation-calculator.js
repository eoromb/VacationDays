const VacationResult = require('./models/vacation-result');

/**
 * Makes a vacation calculation for employees
 */
class VacationCalculator {
    constructor (employeeRepository) {
        if (employeeRepository == null) {
            throw new Error('Invalid employee repository');
        }
        this.employeeRepository = employeeRepository;
    }

    /**
     * Calculate number of vacation days in year for all employees
     * @param {number} year
     * @return {[VacationResult]}
     */
    calculateVacationDays (year) {
        return this.employeeRepository
            .getAll()
            .map(employee => (
                new VacationResult(employee, employee.isWorkInYear(year) ? employee.contract.getVacationDaysInYear(employee, year) : -1))
            );
    }
}

module.exports = VacationCalculator;