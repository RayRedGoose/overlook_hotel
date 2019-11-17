import chai, {expect} from 'chai';
import spies from 'chai-spies';
chai.use(spies);
import User from '../src/js/User';
import dataset from './test-data/mock-data';

let user;

describe("User", () => {
  beforeEach(() => {
    user = new User('manager');
    user.data = dataset.bookings;
    user.id = 1;
  });

  it("should be function", () => {
    expect(User).to.be.a('function');
  });

  it("should be an instance of User", () => {
    expect(user).to.be.an.instanceof(User);
  });

  it("should keep status info", () => {
    expect(user.status).to.equal('manager');
  });

  it("should get bookings info from API", () => {
    let parentSpy = chai.spy.on(user, 'getAPIData', () => {
      return new Promise((resolve) => {
        resolve({message: "Data has been fetched"});
      })
    });
    user.getBookingFromAPI();
    expect(parentSpy).to.have.been.called(1);
  });

  it("should use inherent method getAllBookingInfo", () => {
    let parentSpy = chai.spy.on(user, 'getAllBookingInfo', () => [{
      id: 1572293130172,
      userID: 1,
      date: "2019/11/21",
      roomNumber: 1
    }]);

    user.findBookingInfo('2019/11/21', user);
    expect(parentSpy).to.have.been.called(1);
  });

  it("should find user booking info for chosen day", () => {
    let bookings = user.findBookingInfo('2019/11/21', user);
    expect(bookings).to.deep.equal([{
      id: 1572293130172,
      userID: 1,
      date: "2019/11/21",
      roomNumber: 1
    }]);
  });
});
