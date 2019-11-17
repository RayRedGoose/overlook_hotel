import chai, {expect} from 'chai';
import spies from 'chai-spies';
chai.use(spies);
import Customer from '../src/js/Customer';
import dataset from './test-data/mock-data';

let customer, days;

describe("Customer", () => {
  beforeEach(() => {
    const currentUser = dataset.users[0];
    customer = new Customer('customer', currentUser);
    customer.data = dataset.bookings;
    days = {allDays: ["2019/10/23", "2019/11/20", "2019/11/21"]}
  });

  it("should be function", () => {
    expect(Customer).to.be.a('function');
  });

  it("should be an instance of Customer", () => {
    expect(customer).to.be.an.instanceof(Customer);
  });

  it("should keep status info", () => {
    expect(customer.status).to.equal('customer');
  });

  it("should have id", () => {
    expect(customer.id).to.equal(1);
  });

  it("should have name", () => {
    expect(customer.name).to.equal('Leatha Ullrich');
  });

  describe("find user info method", () => {

    it("should find all user booking info", () => {
      let allDays = ['2019/10/23', '2019/11/20', '2019/11/21'];
      let info = customer.findUserBookingInfo(allDays);
      expect(info).to.deep.equal([{
        id: 1572293130170,
        userID: 1,
        date: "2019/11/20",
        roomNumber: 1
      }, {
        id: 1572293130172,
        userID: 1,
        date: "2019/11/21",
        roomNumber: 1
      }, {
        id: 1572293130176,
        userID: 1,
        date: "2019/10/23",
        roomNumber: 1
      }]);
    });

    it("should find today user booking info", () => {
      let today = '2019/11/20';
      let info = customer.findUserBookingInfo(today);
      expect(info).to.deep.equal([{
        id: 1572293130170,
        userID: 1,
        date: "2019/11/20",
        roomNumber: 1
      }]);
    });
  });

  it("should find total spent amount", () => {
    let amount = customer.findSpentTotal(days.allDays, dataset.rooms);
    expect(amount).to.equal(1075.2);
  });

  it("should use inherent method findBookingInfo", () => {
    let parentSpy = chai.spy.on(customer, 'findBookingInfo', () => [{
      id: 1572293130172,
      userID: 1,
      date: "2019/11/21",
      roomNumber: 1
    }]);
    customer.findUserBookingInfo('2019/11/21');
    customer.findSpentTotal(days.allDays, dataset.rooms);
    expect(parentSpy).to.have.been.called(2);
  });

  it("should reserve room", () => {
    let parentSpy = chai.spy.on(customer, 'addBookingToAPI', () => {
      return new Promise((resolve) => {
        resolve({message: "Data has been fetched"});
      })
    });
    customer.reserveRoom('2019/11/21', 3);
    expect(parentSpy).to.have.been.called(1);
  });
});
