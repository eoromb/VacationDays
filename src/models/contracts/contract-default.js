const ContractBase = require('./contract-base');

const DefaultVacationDays = 26;
const AgeOfBeginningIncreasingVacationDays = 35;
const PeriodOfVacationDaysIncreasing = 5;

/**
 * Default contract. Employee has 26 days by default and +1 day for each 5 years after 30
 * @extends ContractBase
 */
class ContractDefault extends ContractBase {
    /**
     * Creates special contract
     * @param startDate
     */
    constructor(startDate) {
        super(startDate);
    }

    /**
     * @inheritdoc
     */
    getVacationDaysInYear(employee, year) {
        // If employee has birthday, when number of vacation days changes, (for example from 34 to 35 yo) in Nth month of the current year
        // then number of vacation days will be 26*N/12 + 27*(12-N)/12 = 27 - N/12 where 1<=N<=12.
        // And because of use of truncation the result will be 26.
        // So take the age of employee in the first day of the year and use it for vacation days calculation.
        const firstDayOfYear = new Date(year, 0, 1);
        const employeeAge = employee.getAgeByDate(firstDayOfYear);

        return Math.trunc(this.getWorkingMonthsInYear(year) * this.getVacationDaysInYearByAge(employeeAge) / 12);
    }

    /**
     * Gets number of vacation days in year base on age
     * @private
     * @param {number} age
     * @return {number}
     */
    getVacationDaysInYearByAge(age) {
        if (age < 0) {
            return 0;
        }
        if (age < AgeOfBeginningIncreasingVacationDays) {
            return DefaultVacationDays;
        }
        return (DefaultVacationDays + Math.trunc(1 + (age - AgeOfBeginningIncreasingVacationDays) / PeriodOfVacationDaysIncreasing));
    }
}
module.exports = ContractDefault;
