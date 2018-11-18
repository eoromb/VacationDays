const expect = require('chai').expect;
const Employee = require('../../src/models/employee');
const ContractDefault = require('../../src/models/contracts/contract-default');

const year = 2017;
const numberOfVacationDaysDefault = 26;

describe('test of ContractDefault model', () => {
    describe('getVacationDaysInYearByAge', () => {
        let contract;
        before('initialize', done => {
            contract = new ContractDefault(new Date(year, 0, 1));
            done();
        });
        it('should get 26 vacation days for all below 35 years', done => {
            for (let age = 1; age < 35; age++) {
                expect(contract.getVacationDaysInYearByAge(age)).to.be.equal(numberOfVacationDaysDefault);
            }
            done();
        });
        it('should add 1 vacation day to 26 for each 5 years above 35 years', done => {
            for (let age = 35; age < 100; age++) {
                const numberOfVacationDays = numberOfVacationDaysDefault + Math.trunc(1 + (age - 35) / 5);
                expect(contract.getVacationDaysInYearByAge(age)).to.be.equal(numberOfVacationDays);
            }
            done();
        });
        it('should not break on 0 year', done => {
            expect(contract.getVacationDaysInYearByAge(0)).to.be.equal(numberOfVacationDaysDefault);
            done();
        });
        it('should not break on negative age', done => {
            expect(contract.getVacationDaysInYearByAge(-1)).to.be.equal(0);
            done();
        });
    });
    describe('getVacationDaysInYear', () => {
        describe('first month accounting', () => {
            let employeeStartedIn1st;
            let employeeStartedIn15st;
            before('initialize', done => {
                employeeStartedIn1st = new Employee('name', new Date(year - 25, 0, 1), new ContractDefault(new Date(year, 0, 1)));
                employeeStartedIn15st = new Employee('name2', new Date(year - 25, 0, 1), new ContractDefault(new Date(year, 0, 15)));
                done();
            });
            it('should get 26 vacation days in year for under 35 yo if started in 1st of Jan', done => {
                expect(employeeStartedIn1st.contract.getVacationDaysInYear(employeeStartedIn1st, year)).to.be.equal(numberOfVacationDaysDefault);
                done();
            });
            it('should get trunc(11*26/12) vacation days in year for under 35 yo if started in 15st of Jan', done => {
                expect(employeeStartedIn15st.contract.getVacationDaysInYear(employeeStartedIn15st, year)).to.be.equal(Math.trunc(11*numberOfVacationDaysDefault/12));
                done();
            });
        });
        describe('employee under 35', () => {
            let employee;
            before('initialize', done => {
                employee = new Employee('name', new Date(year - 25, 0, 1), new ContractDefault(new Date(year, 0, 1)));
                done();
            });
            it('should get 26 vacation days for the full year', done => {
                expect(employee.contract.getVacationDaysInYear(employee, year)).to.be.equal(numberOfVacationDaysDefault);
                done();
            });
        });
        describe('employee between 34 and 35', () => {
            let employeeBornAt1st;
            let employeeBornAt2nd;
            before('initialize', done => {
                employeeBornAt1st = new Employee('name', new Date(year - 35, 0, 1), new ContractDefault(new Date(year - 1, 0, 1)));
                employeeBornAt2nd = new Employee('name', new Date(year - 35, 0, 2), new ContractDefault(new Date(year - 1, 0, 1)));
                done();
            });
            it('should get 27 vacation days if has 35 birthday in 1st of Jan', done => {
                expect(employeeBornAt1st.contract.getVacationDaysInYear(employeeBornAt1st, year)).to.be.equal(numberOfVacationDaysDefault + 1);
                done();
            });
            it('should get 26 vacation days if has 35 birthday after 1st of Jan', done => {
                expect(employeeBornAt2nd.contract.getVacationDaysInYear(employeeBornAt2nd, year)).to.be.equal(numberOfVacationDaysDefault);
                done();
            });
        });
        describe('employee at 35', () => {
            let employee;
            before('initialize', done => {
                employee = new Employee('name', new Date(year - 35, 0, 1), new ContractDefault(new Date(year - 1, 0, 1)));
                done();
            });
            it('should get 27 vacation days for the full year', done => {
                expect(employee.contract.getVacationDaysInYear(employee, year)).to.be.equal(numberOfVacationDaysDefault + 1);
                done();
            })
        });
        describe('for all ages', () => {
            it('should get 26 vacation days for under 35 then add by 1 day for each 5 year', done => {
                for (let age = 0; age < 100; age++) {
                    const expectedVacationDays = age < 35 ? 26 : 26 + Math.trunc(1 + (age - 35) / 5);
                    const employee = new Employee('name', new Date(year - age, 0, 1), new ContractDefault(new Date(year, 0, 1)));
                    expect(employee.contract.getVacationDaysInYear(employee, year)).to.be.equal(expectedVacationDays);
                }
                done();
            });
        });
    });
});