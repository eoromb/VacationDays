const expect = require('chai').expect;
const Employee = require('../../src/models/employee');
const VacationCalculator = require('../../src/services/vacation-calculator');
const ContractDefault = require('../../src/models/contracts/contract-default');
const ContractSpecial = require('../../src/models/contracts/contract-special');
const RepositoryMock = require('../unit-tests/utils/employee-repository-mock');

const year = 2017;
const month = 1;
const day = 1;
const specialContractDays = 27;
const invalidVacationDays = -1;

describe('tests of VacationCalculator model', () => {
    let repository;
    let vacationCalculator;
    before('initialize', done => {
        repository = new RepositoryMock();
        vacationCalculator = new VacationCalculator(repository);

        done();
    });
    afterEach('clean repository', done => {
        repository.clear();
        done();
    });
    describe('employee with special contract', () => {
        describe('started in year before current one', () => {
            it('should have vacation days specified in contract', done => {
                repository.add(new Employee('name', new Date(year - 25, month, day), new ContractSpecial(new Date(year - 1, 0, 1), specialContractDays)));

                const expectedVacationDays = specialContractDays;
                const result = vacationCalculator.calculateVacationDays(year);
                expect(result).to.have.lengthOf(1);
                expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                done();
            });
        });
        describe('started in current year', () => {
            it('should have vacation days specified in contract if started at 1.1.year', done => {
                repository.add(new Employee('name', new Date(year - 25, month, day), new ContractSpecial(new Date(year, 0, 1), specialContractDays)));

                const expectedVacationDays = specialContractDays;
                const result = vacationCalculator.calculateVacationDays(year);
                expect(result).to.have.lengthOf(1);
                expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                done();
            });
            it('should have 11*contract/12 vacation days if started at 15.1.year', done => {
                repository.add(new Employee('name', new Date(year - 25, month, day), new ContractSpecial(new Date(year, 0, 15), specialContractDays)));
                const expectedVacationDays = Math.trunc(11 * specialContractDays / 12);
                const result = vacationCalculator.calculateVacationDays(year);
                expect(result).to.have.lengthOf(1);
                expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                done();
            });
        });
        describe('started in year after current one', () => {
            it('should have -1 days', done => {
                repository.add(new Employee('name', new Date(year - 25, month, day), new ContractSpecial(new Date(year + 1, 0, 1), specialContractDays)));
                const expectedVacationDays = invalidVacationDays;
                const result = vacationCalculator.calculateVacationDays(year);
                expect(result).to.have.lengthOf(1);
                expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                done();
            });
        });
    });
    describe('employee with default contract', () => {
        describe('born', () => {
            describe('under 35', () => {
                const employee = {
                    name: 'name',
                    dateOfBirth: new Date(year - 25, 0, 1)
                };
                describe('started in year before current one', () => {
                    it('should have 26 days', done => {
                        repository.add(new Employee('name', new Date(year - 25, month, day), new ContractDefault(new Date(year - 1, 0, 1))));
                        const expectedVacationDays = 26;
                        const result = vacationCalculator.calculateVacationDays(year);
                        expect(result).to.have.lengthOf(1);
                        expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                        done();
                    });
                });
                describe('started in current year', () => {
                    it('should have 26 days if started at 1.1.year', done => {
                        repository.add(new Employee('name', new Date(year - 25, month, day), new ContractDefault(new Date(year, 0, 1))));
                        const expectedVacationDays = 26;
                        const result = vacationCalculator.calculateVacationDays(year);
                        expect(result).to.have.lengthOf(1);
                        expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                        done();
                    });
                    it('should have 11*26/12 days if started at 15.1.year', done => {
                        repository.add(new Employee('name', new Date(year - 25, month, day), new ContractDefault(new Date(year, 0, 15))));
                        const expectedVacationDays = Math.trunc(11 * 26 / 12);
                        const result = vacationCalculator.calculateVacationDays(year);
                        expect(result).to.have.lengthOf(1);
                        expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                        done();
                    });
                });
                describe('started in year after current one', () => {
                    it('should have -1 vacation days', done => {
                        repository.add(new Employee('name', new Date(year - 25, month, day), new ContractDefault(new Date(year + 1, 0, 1))));
                        const expectedVacationDays = invalidVacationDays;
                        const result = vacationCalculator.calculateVacationDays(year);
                        expect(result).to.have.lengthOf(1);
                        expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                        done();
                    });
                });
            });
            describe('older then 35', () => {
                describe('started in year before current one', () => {
                    it('should have 26 days + 1 day for each 5 years', done => {
                        const expectedDays = {};
                        for (let i = 0; i < 10; i++) {
                            const birthYear = year - 35 - 5*i;
                            const name = `name${2*i}`;
                            const name2 = `name${2*i + 1}`;
                            repository.add(new Employee(name, new Date(birthYear, 0, 1), new ContractDefault(new Date(year - 1, 0, 1))));
                            repository.add(new Employee(name2, new Date(birthYear + 1, 0, 1), new ContractDefault(new Date(year - 1, 0, 1))));

                            expectedDays[name] = 26 + i + 1;
                            expectedDays[name2] = 26 + i;
                        }
                        const result = vacationCalculator.calculateVacationDays(year);
                        result.forEach(r => expect(r.vacationDays).to.be.equal(expectedDays[r.employee.name]));

                        done();
                    });
                    describe('with 35 birthday in current year', () => {
                        it('should have 26 days for the months before birthday and 27 days - for ones after (26 because of truncation)', done => {
                            repository.add(new Employee('name', new Date(year - 35, 5, 1), new ContractDefault(new Date(year - 1, 0, 1))));
                            const expectedVacationDays = 26;
                            const result = vacationCalculator.calculateVacationDays(year);
                            expect(result).to.have.lengthOf(1);
                            expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                            done();
                        });
                        it('should have 27 days in case of birthday at 1.1.year', done => {
                            repository.add(new Employee('name', new Date(year - 35, 0, 1), new ContractDefault(new Date(year - 1, 0, 1))));
                            const expectedVacationDays = 27;
                            const result = vacationCalculator.calculateVacationDays(year);
                            expect(result).to.have.lengthOf(1);
                            expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                            done();
                        });
                    });
                });
            });
        });
        describe('not born', () => {
            it('should have -1 vacation days', done => {
                repository.add(new Employee('name', new Date(year + 1, 0, 1), new ContractDefault(new Date(year + 1, 0, 1))));
                const expectedVacationDays = invalidVacationDays;
                const result = vacationCalculator.calculateVacationDays(year);
                expect(result).to.have.lengthOf(1);
                expect(result[0].vacationDays).to.be.equal(expectedVacationDays);
                done();
            });
        });
    });
});
