import User from './User';

class Customer extends User {
  constructor(status, person) {
    super(status);
    Object.assign(this, person);
    this.booking = {};
  }

  findUserBookingInfo(date) {
    return this.findBookingInfo(date, this);
  }

  findSpentTotal(days, rooms) {
    let dataset = this.findUserBookingInfo(days);
    return this.findTotalAmountAnyDay(dataset, days, rooms);
  }

  reserveRoom(date, roomNumber) {
    return this.addBookingToAPI(this.id, date, roomNumber);
  }
}

export default Customer;
