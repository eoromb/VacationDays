/**
 * Data storage base class.
 */
class DataStorageBase {
    /**
     * Get array of employees data level's object
     * @abstract
     * @return {Array}
     */
    getAllEmployees() {
        throw new Error('Not implemented');
    }
}

module.exports = DataStorageBase;