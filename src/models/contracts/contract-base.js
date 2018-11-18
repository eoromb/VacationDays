const moment = require('moment');
const Employee = require('../employee');

const monthInYear = 12;
/**
 * Contract base class
 */
class ContractBase {
    /**
     * Creates base contract
     * @param {Date} startDate - start date of contract
     */
    constructor (startDate) {
        if (!(startDate instanceof Date)) {
            throw new Error('Invalid startDate');
        }
        this.startDate = startDate;
    }

    /**
     * Gets start date of contract
     * @return {Date}
     */
    getStartDate() {
        return this.startDate;
    }

    /**
     * If contract was started before the date
     * @param {Date} date
     * @return {boolean}
     */
    isStartedBeforeDate (date) {
        return moment(this.startDate).isSameOrBefore(date);
    }

    /**
     * If contract is valid in specified year (at least in one month of year)
     * @param {number} year - year
     * @return {boolean}
     */
    isValidInYear (year) {
        return this.startDate.getFullYear() <= year;
    }

    /**
     * Gets number of working months in specified year
     * @param {number} year - year
     * @return {number}
     */
    getWorkingMonthsInYear (year) {
        const firstDateOfYear = new Date(year, 0, 1);
        if (this.isStartedBeforeDate(firstDateOfYear)) {
            return monthInYear;
        }
        // Month is working if contract has started before this month or at 1st day of this month.
        let workingMonthsInYear = monthInYear - (this.startDate.getMonth() + 1);
        if (this.startDate.getDate() === 1) {
            workingMonthsInYear += 1;
        }
        return workingMonthsInYear;
    }

    /**
     * Gets number of vacation days for employees in specified year
     * @param {Employee} employee
     * @param {number} year
     * @return {number}
     * @abstract
     */
    getVacationDaysInYear (employee, year) {
        throw new Error('Not implemented');
    }
}
module.exports = ContractBase;