const moment = require('moment');
const Employee = require('../models/employee');
const ContractSpecial = require('../models/contracts/contract-special');
const ContractDefault = require('../models/contracts/contract-default');

/**
 * Creates instance of Employee from the data level's Objects
 */
class EmployeeFactory {
    /**
     * Creates instance of Employee
     * @param {object} employeeObject to create instance of Employee
     * @return {Employee}
     */
    static createEmployee(employeeObject) {
        if (!EmployeeFactory.isEmployeeObjectHasValidFormat(employeeObject)) {
            throw new Error('Unable to create employee. Invalid object format.');
        }
        if (!EmployeeFactory.isEmployeeHasValidDates(employeeObject)) {
            throw new Error(`Employees has dateOfBirth after startDate. Name: ${employeeObject.name}`);
        }

        // TODO: Could be refactored to create factory to create different types of contract
        const contract = employeeObject.specialContract != null ?
            new ContractSpecial(employeeObject.startDate, employeeObject.specialContract.vacationDays) :
            new ContractDefault(employeeObject.startDate);
        return new Employee(employeeObject.name, employeeObject.dateOfBirth, contract);
    }

    /**
     * Validates employeeObject format
     * @param {object} employeeObject
     * @private
     * @return {boolean}
     */
    static isEmployeeObjectHasValidFormat(employeeObject) {
        return (
            employeeObject != null &&
            employeeObject.name != null &&
            employeeObject.dateOfBirth != null &&
            employeeObject.startDate != null
        );
    }

    /**
     * Validates dates in employeeObject
     * @param {object} employeeObject
     * @private
     * @return {boolean}
     */
    static isEmployeeHasValidDates(employeeObject) {
        return (
            moment(employeeObject.dateOfBirth).isSameOrBefore(employeeObject.startDate)
        );
    };
}

module.exports = EmployeeFactory;
