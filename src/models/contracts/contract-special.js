const ContractBase = require('./contract-base');

/**
 * Special contract. Employee has predefined number of vacation days regardless of age
 * @extends ContractBase
 */
class ContractSpecial extends ContractBase {
    /**
     * Creates special contract
     * @param {Date} startDate - contract's start date
     * @param {number} vacationDays - number of vacation days in year
     */
    constructor(startDate, vacationDays) {
        super(startDate);
        if (!Number.isInteger(vacationDays) || vacationDays < 1 || vacationDays > 365) {
            throw new Error(`Invalid number of vacation days: ${vacationDays}`);
        }
        this.vacationDays = vacationDays;
    }

    /**
     * Get vacation days in year
     * @param employee
     * @param year
     * @return {number}
     */
    getVacationDaysInYear(employee, year) {
        return Math.trunc(this.getWorkingMonthsInYear(year) * this.vacationDays / 12);
    }
}
module.exports = ContractSpecial;
