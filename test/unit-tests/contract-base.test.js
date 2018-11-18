const expect = require('chai').expect;
const ContractBase = require('../../src/models/contracts/contract-base');

const year = 2017;
const month = 1;
const day = 1;
const monthInYear = 12;

describe('test of ContractBase model', () => {
    let contract;
    before('initialize', done => {
        contract = new ContractBase(new Date(year, month, day));
        done();
    });
    describe('constructor', () => {
        it('should throw error if start date is not Date type', done => {
            expect(() => new ContractBase(1)).to.throw(Error);
            done();
        })
    });
    describe('isStartedBeforeDate', () => {
        it('should not be started in day before start date', done => {
            expect(contract.isStartedBeforeDate(new Date(year, month, day - 1)));
            done();
        });
        it('should be started at start date', done => {
            expect(contract.isStartedBeforeDate(new Date(year, month, day)));
            done();
        });
        it('should be started next day after start date', done => {
            expect(contract.isStartedBeforeDate(new Date(year, month, day + 1)));
            done();
        });
    });
    describe('isValidInYear', () => {
        it('should not be valid in year before start one', done => {
            expect(contract.isValidInYear(year - 1)).to.be.equal(false);
            done();
        });
        it('should be valid in start year', done => {
            expect(contract.isValidInYear(year)).to.be.equal(true);
            done();
        });
        it('should be valid in year after start one', done => {
            expect(contract.isValidInYear(year + 1)).to.be.equal(true);
            done();
        });
    });
    describe('getWorkingMonthsInYear', () => {
        it('should include month in working if started in 1st', done => {
            contract = new ContractBase(new Date(year, 0, 1));
            expect(contract.getWorkingMonthsInYear(year)).to.be.equal(monthInYear);
            done();
        });
        it('should not include month in working if started in 15st', done => {
            contract = new ContractBase(new Date(year, 0, 15));
            expect(contract.getWorkingMonthsInYear(year)).to.be.equal(monthInYear - 1);
            done();
        });
    });
});