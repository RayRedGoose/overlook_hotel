import Hotel from './Hotel';

class User extends Hotel {
  constructor(status) {
    super();
    this.status = status;
  }

  getBookingFromAPI() {
    return this.getAPIData('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', 'bookings');
  }

  findBookingInfo(date, user) {
    let dataset = this.getAllBookingInfo(this.data, date);
    return dataset.filter(data => data.userID === user.id);
  }

  addBookingToAPI(userID, date, roomNumber) {
    return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: parseInt(userID),
        date: date,
        roomNumber: parseInt(roomNumber)
      })
    });
  }
}

export default User;
