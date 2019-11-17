import chai, {expect} from 'chai';
import spies from 'chai-spies';
chai.use(spies);
import Manager from '../src/js/Manager';
import dataset from './test-data/mock-data';

let manager;

describe("Manager", () => {
  beforeEach(() => {
    manager = new Manager('customer');
    manager.data = dataset.bookings;
  });

  it("should be function", () => {
    expect(Manager).to.be.a('function');
  });

  it("should be an instance of Manager", () => {
    expect(manager).to.be.an.instanceof(Manager);
  });

  it("should keep status info", () => {
    expect(manager.status).to.equal('customer');
  });

  it("should have name Anna Smith as default", () => {
    expect(manager.name).to.equal('Anna Smith');
  });

  it("should delete user booking from API", () => {
    manager.deleteBooking(9, 12);
    expect(global.fetch).to.have.been.called(2);
  });
});
