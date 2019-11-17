import Hotel from './Hotel';

class Room extends Hotel {
  constructor() {
    super();
  }

  getRoomsFromAPI() {
    return this.getAPIData('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms', 'rooms');
  }

  findOccupiedRooms(dataset, date) {
    return this.getAllBookingInfo(dataset, date).map(booking => booking.roomNumber);
  }

  findAvailableRooms (occupiedRooms) {
    return this.data.filter(room => !occupiedRooms.includes(room.number));
  }

  findSpecificRooms(availableRooms, type, bed) {
    return availableRooms.filter(room => room.roomType === type && room.bedSize === bed);
  }

  findRoomByNumber(number) {
    return this.data.find(room => room.number === number);
  }

  getRoomStatistics(availableRooms) {
    return availableRooms.reduce((list, room) => {
      list[room.roomType] ++;
      return list;
    }, {"residential suite": 0, "suite": 0, "junior suite": 0, "single room": 0});
  }

  findOccupiedRoomPercent(rooms) {
    return parseInt(rooms.length / this.data.length * 100);
  }
}

export default Room;
