const fs = require('fs');
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
const DataStorageBase = require('./data-sotrage-base');

const DefaultDateFormat = 'DD.MM.YYYY';

/**
 * JSON file data storage. Loads employees from the JSON file
 * @extends DataStorageBase
 */
class JSONFileDataStorage extends DataStorageBase {
    /**
     *
     * @param {object} config
     * @param {string} config.fileName - json file name
     * @param {string} [config.dateFormat] - date format in JSON file
     */
    constructor (config) {
        super();
        const dateFormat = config.dateFormat || DefaultDateFormat;

        this.fileSchema = Joi.object().keys({
            employees: Joi.array().items(
                Joi.object().keys({
                    name: Joi.string().required(),
                    dateOfBirth: Joi.date().format(dateFormat).required(),
                    startDate: Joi.date().format(dateFormat).min(Joi.ref('dateOfBirth')).required(),
                    specialContract: {
                        vacationDays: Joi.number().greater(0).less(365).required()
                    },
                }))
        });
        this.fileName = '';
        this.employees = [];
        this.load(config.fileName);
    }

    /**
     * @inheritdoc
     */
    getAllEmployees () {
        return this.employees;
    }

    /**
     * Loads employee from JSON file
     * @param {string} fileName - File name to load repository from
     * @private
     */
    load (fileName) {
        const fileString = fs.readFileSync(fileName, {encoding: 'utf8'});
        const fileData = JSON.parse(fileString);
        const validationResult = Joi.validate(fileData, this.fileSchema);

        if (validationResult.error != null) {
            throw new Error(`Unable to load employees file. Invalid format.\n${validationResult.error}`);
        }

        this.employees = validationResult.value.employees;
        this.fileName = fileName;
    }
}

module.exports = JSONFileDataStorage;