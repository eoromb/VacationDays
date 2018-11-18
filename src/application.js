const JSONFileDataStorage = require('./data-access/json-file-data-storage');
const JSONFileResultWriter = require('./data-access/json-file-result-writer');
const EmployeeRepository = require('./repositories/employee-repository');
const VacationCalculator = require('./services/vacation-calculator');

class Application {
    static Start(inputFileName, outputFileName, year) {
        const jsonDataStorage = new JSONFileDataStorage({fileName: inputFileName});
        const employeeRepository = new EmployeeRepository(jsonDataStorage);
        const vacationCalculator = new VacationCalculator(employeeRepository);
        const results = vacationCalculator.calculateVacationDays(year);

        JSONFileResultWriter.writeResultsToFile(results, outputFileName);

        return results;
    }
}

module.exports = Application;