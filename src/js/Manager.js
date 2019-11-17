import User from './User';

class Manager extends User {
  constructor(status) {
    super(status);
    this.name = 'Anna Smith';
  }

  deleteBooking(id, room) {
    return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: parseInt(id), roomNumber: parseInt(room)})
    });
  }
}

export default Manager;
