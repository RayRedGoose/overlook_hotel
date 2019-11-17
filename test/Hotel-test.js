import chai, {expect} from 'chai';
import spies from 'chai-spies';
chai.use(spies);
import Hotel from '../src/js/Hotel';
import dataset from './test-data/mock-data';

let hotel;

describe("Hotel", () => {
  beforeEach(() => {
    hotel = new Hotel();
    hotel.data = dataset.users;
  });

  it("should be function", () => {
    expect(Hotel).to.be.a('function');
  });

  it("should be an instance of Hotel", () => {
    expect(hotel).to.be.an.instanceof(Hotel);
  });

  it("should keep fetched data", () => {
    expect(hotel.data).to.deep.equal([
      {id: 1, name: 'Leatha Ullrich'},
      {id: 2, name: 'Rocio Schuster'}
    ]);
  });

  it("should get dataset from API", () => {
    let fetchSpy = chai.spy.on(global, 'fetch', () => {
      return new Promise((resolve) => {
        resolve({message: "Data has been fetched"});
      })
    });
    hotel.getAPIData('https://exmpl.in/api/test/2', 'message');
    expect(fetchSpy).to.have.been.called(1);
  });

  it("should find user by id", () => {
    let user = hotel.findUser('id', 1);
    expect(user).to.deep.equal({
      id: 1,
      name: 'Leatha Ullrich'
    });
  });

  it("should find user by name", () => {
    let user = hotel.findUser('name', 'Rocio Schuster');
    expect(user).to.deep.equal({
      id: 2,
      name: 'Rocio Schuster'
    });
  });

  it("should find all booking info for chosen day", () => {
    let bookings = hotel.getAllBookingInfo(dataset.bookings, '2019/11/21');
    expect(bookings).to.deep.equal([{
      id: 1572293130172,
      userID: 1,
      date: "2019/11/21",
      roomNumber: 1
    }, {
      id: 1572293130173,
      userID: 2,
      date: "2019/11/21",
      roomNumber: 2
    }]);
  });

  it("should find total revenue for chosen day ", () => {
    let total = hotel.findTotalAmountAnyDay(
      dataset.bookings, '2019/11/21',
      dataset.rooms);
    expect(total).to.equal(835.78);
  });
});
