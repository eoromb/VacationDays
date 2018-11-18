const EmployeeFactory = require('./employee-factory');
const Employee = require('../models/employee');
const DataStorageBase = require('../data-access/data-sotrage-base');

/**
 * Employee's repository.
 */
class EmployeeRepository {
    /**
     *
     * @param {DataStorageBase} dataStorage - data storage
     */
    constructor (dataStorage) {
        if (!(dataStorage instanceof DataStorageBase)) {
            throw new Error('Invalid data storage type');
        }
        this.dataStorage = dataStorage;
    }

    /**
     * Get all employees
     * @return {[Employee]}
     */
    getAll () {
        return this.dataStorage.getAllEmployees()
            .map(employeeObject => EmployeeFactory.createEmployee((employeeObject)));
    }
}

module.exports = EmployeeRepository;
