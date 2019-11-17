import chai, {expect} from 'chai';
import spies from 'chai-spies';
chai.use(spies);
import Room from '../src/js/Room';
import dataset from './test-data/mock-data';

let room;

describe("Room", () => {
  beforeEach(() => {
    room = new Room('manager');
    room.data = dataset.rooms;
  });

  it("should be function", () => {
    expect(Room).to.be.a('function');
  });

  it("should be an instance of Room", () => {
    expect(room).to.be.an.instanceof(Room);
  });

  it("should get rooms info from API", () => {
    let parentSpy = chai.spy.on(room, 'getAPIData', () => {
      return new Promise((resolve) => {
        resolve({message: "Data has been fetched"});
      })
    });
    room.getRoomsFromAPI();
    expect(parentSpy).to.have.been.called(1);
  });

  it("should use inherent method getAllBookingInfo", () => {
    let parentSpy = chai.spy.on(room, 'getAllBookingInfo', () => {
      [{roomNumber: 1}, {roomNumber: 2}]
    });
    room.findOccupiedRooms(dataset.bookings, '2019/11/21');
    expect(parentSpy).to.have.been.called(1);
  });

  it("should find occupied rooms for any day", () => {
    let bookings = room.findOccupiedRooms(dataset.bookings, '2019/11/21');
    expect(bookings).to.deep.equal([1, 2]);
  });

  it("should find available rooms for any day", () => {
    let occupiedRooms = room.findOccupiedRooms(dataset.bookings, '2019/11/21');
    let rooms = room.findAvailableRooms(occupiedRooms);
    expect(rooms).to.deep.equal([{
      number: 3,
      roomType: "single room",
      bedSize: "king",
      numBeds: 1,
      costPerNight: 491.14
    }, {
      number: 4,
      roomType: "single room",
      bedSize: "queen",
      numBeds: 1,
      costPerNight: 429.44
    }]);
  });

  it("should find specific available room", () => {
    let occupiedRooms = room.findOccupiedRooms(dataset.bookings, '2019/11/21');
    let availableRooms = room.findAvailableRooms(occupiedRooms);
    let rooms = room.findSpecificRooms(availableRooms, "single room", "king");
    expect(rooms).to.deep.equal([{
      number: 3,
      roomType: "single room",
      bedSize: "king",
      numBeds: 1,
      costPerNight: 491.14
    }]);
  });

  it("should find room by number", () => {
    let roomFound = room.findRoomByNumber(3);
    expect(roomFound).to.deep.equal({
      number: 3,
      roomType: "single room",
      bedSize: "king",
      numBeds: 1,
      costPerNight: 491.14
    });
  });

  it("should show available room statistics", () => {
    let occupiedRooms = room.findOccupiedRooms(dataset.bookings, '2019/11/21');
    let availableRooms = room.findAvailableRooms(occupiedRooms);
    let statistics = room.getRoomStatistics(availableRooms);
    expect(statistics).to.deep.equal({
      "residential suite": 0,
      "suite": 0,
      "junior suite": 0,
      "single room": 2
    });
  });

  it("should show occupied percent", () => {
    let occupiedRooms = room.findOccupiedRooms(dataset.bookings, '2019/11/21');
    let percent = room.findOccupiedRoomPercent(occupiedRooms);
    expect(percent).to.equal(50);
  });
});
