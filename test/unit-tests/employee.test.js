const expect = require('chai').expect;
const Employee = require('../../src/models/employee');
const ContractDefault = require('../../src/models/contracts/contract-default');

const year = 2017;
const month = 1;
const day = 1;

describe('tests of Employee model', () => {
    let employee;
    before('initialize', done => {
        employee = new Employee('name', new Date(year, month, day), new ContractDefault(new Date(year, month, day)));
        done();
    });
    describe('constructor', () => {
        it('should not have empty name', done => {
            expect(() => new Employee(null, new Date(year, month, day), new ContractDefault(new Date(year, month, day)))).to.throw(Error);
            done();
        });
        it('should not have dateOfBirth which is not Date type', done => {
            expect(() => new Employee('name', 1, new ContractDefault(new Date(year, month, day)))).to.throw(Error);
            done();
        });
        it('should not have contract which is not ContractBase derived type', done => {
            expect(() => new Employee('name', new Date(year, month, day), 1)).to.throw(Error);
            done();
        });
        it('should not have contract started before birth date', done => {
            expect(() => new Employee('name', new Date(year, month, day), new ContractDefault(new Date(year, month, day - 1)))).to.throw(Error);
            done();
        });
    });
    describe('getAgeByDate', () => {
        it('should get 0 for date before the birth', done => {
            expect(employee.getAgeByDate(new Date(year - 1, month, day))).to.be.equal(0);
            expect(employee.getAgeByDate(new Date(year, month - 1, day))).to.be.equal(0);
            expect(employee.getAgeByDate(new Date(year, month, day - 1))).to.be.equal(0);
            done();
        });
        it('should get 0 for date equal to birth date', done => {
            expect(employee.getAgeByDate(new Date(year, month, day))).to.be.equal(0);
            done();
        });
        it('should get 0 for the first year after the birth', done => {
            expect(employee.getAgeByDate(new Date(year, month, day + 1))).to.be.equal(0);
            expect(employee.getAgeByDate(new Date(year + 1, month, day - 1))).to.be.equal(0);
            expect(employee.getAgeByDate(new Date(year, month + 12, day - 1))).to.be.equal(0);
            done();
        });
        it('should get 1 after one year after the birth', done => {
            expect(employee.getAgeByDate(new Date(year + 1, month, day))).to.be.equal(1);
            done();
        });
    });
    describe('isBornBeforeDate', () => {
        it('should not be born in day before birth date', done => {
            expect(employee.isBornBeforeDate(new Date(year, month, day - 1))).to.be.equal(false);
            done();
        });
        it('should be born in day of birth date', done => {
            expect(employee.isBornBeforeDate(employee.dateOfBirth)).to.be.equal(true);
            done();
        });
        it('should be born in day after birth date', done => {
            expect(employee.isBornBeforeDate(new Date(year, month, day + 1))).to.be.equal(true);
            done();
        });
    });
    describe('isWorkInYear', () => {
        it('should not work in year before contract start year', done => {
            expect(employee.isWorkInYear(year - 1)).to.be.equal(false);
            done();
        });
        it('should work in contract start year', done => {
            expect(employee.isWorkInYear(year)).to.be.equal(true);
            done();
        });
        it('should work in year after contract start year', done => {
            expect(employee.isWorkInYear(year + 1)).to.be.equal(true);
            done();
        });
    })
});