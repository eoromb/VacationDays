const expect = require('chai').expect;
const Employee = require('../../src/models/employee');
const ContractSpecial = require('../../src/models/contracts/contract-special');

const year = 2017;
const numberOfVacationDays = 27;

describe('test of ContractSpecial model', () => {
    let contract;
    let employee;
    before('initialize', done => {
        contract = new ContractSpecial(new Date(year, 0, 1), numberOfVacationDays);
        employee = new Employee('name', new Date(year - 25, 0, 1), contract);
        done();
    });
    describe('getVacationDaysInSpecifiedMonth', () => {
        describe('first month accounting', () => {
            let employeeStartedIn1st;
            let employeeStartedIn15st;
            before('initialize', done => {
                employeeStartedIn1st = new Employee('name', new Date(year - 25, 0, 1), new ContractSpecial(new Date(year, 0, 1), numberOfVacationDays));
                employeeStartedIn15st = new Employee('name2', new Date(year - 25, 0, 1), new ContractSpecial(new Date(year, 0, 15), numberOfVacationDays));
                done();
            });
            it('should get number of vacation days specified in contract if started in 1st of Jan', done => {
                expect(employeeStartedIn1st.contract.getVacationDaysInYear(employeeStartedIn1st, year)).to.be.equal(numberOfVacationDays);
                done();
            });
            it('should get 11/12 of number of vacation days specified in contract if started in 15st of Jan', done => {
                expect(employeeStartedIn15st.contract.getVacationDaysInYear(employeeStartedIn15st, year)).to.be.equal(Math.trunc(11 * numberOfVacationDays / 12));
                done();
            });
        });
        describe('for all ages', () => {
            it('should get number of vacation days specified in contract independently of age', done => {
                for (let age = 0; age < 100; age++) {
                    const employ = new Employee('name', new Date(year - age, 0, 1), new ContractSpecial(new Date(year, 0, 1), numberOfVacationDays));
                    expect(employ.contract.getVacationDaysInYear(employee, year)).to.be.equal(numberOfVacationDays);
                }
                done();
            });
        });
    });
});