const moment = require('moment');
const ContractBase = require('./contracts/contract-base');

/**
 * Employee class
 */
class Employee {
    /**
     *
     * @param {string} name
     * @param {Date} dateOfBirth
     * @param {ContractBase} contract
     */
    constructor(name, dateOfBirth, contract) {
        if (name == null) {
            throw new Error('Invalid name');
        }
        if (!(dateOfBirth instanceof Date)){
            throw new Error('Invalid date of birth')
        }
        if (!(contract instanceof ContractBase)) {
            throw new Error('Invalid contract for employee');
        }
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        if (!this.isBornBeforeDate(contract.getStartDate())) {
            throw new Error('Invalid contract for employee. Employee was born after contract start date');
        }
        this.contract = contract;
    }

    /**
     * If employee was born before or at specified date
     * @param date
     * @return {boolean}
     */
    isBornBeforeDate(date) {
        return moment(this.dateOfBirth).isSameOrBefore(date);
    }

    /**
     * If employee works in specified year
     * @param {number} year - year
     * @return {boolean}
     */
    isWorkInYear(year) {
        return this.contract.isValidInYear(year);
    }

    /**
     * Get age of employee on specified date
     * @param {Date} date
     * @return {number}
     */
    getAgeByDate(date) {
        const dateMoment = moment(date);
        const dateOfBirthMoment = moment(this.dateOfBirth);
        const age = dateMoment.diff(dateOfBirthMoment, 'years');
        return age < 0 ? 0 : age;
    }
}
module.exports =  Employee;
