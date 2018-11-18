const fs = require('fs');
const VacationResult = require('../services/models/vacation-result');

/**
 * Write vacation result into JSON file
 */
class JSONFileResultWriter {
    /**
     *
     * @param {VacationResult[]} results - results to save to JSON file
     * @param {string} outputFile - output file name
     */
    static writeResultsToFile(results, outputFile) {
        const content = JSON.stringify(results.map(r => ({name: r.employee.name, vacationDays: r.vacationDays})), null, 4);
        fs.writeFileSync(outputFile, content);
    }
}
module.exports = JSONFileResultWriter;