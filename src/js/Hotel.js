class Hotel {
  constructor() {
    this.data = null;
  }

  getAPIData(url, type) {
    return fetch(url)
    .then(response => response.json())
    .then(data => {
      this.data = data[type];
    })
    .catch(error => console.log(error));
  }

  findUser(type, value) {
    return this.data.find(user => user[type] === value);
  }

  getAllBookingInfo(dataset, date) {
    return dataset.filter(data => date.includes(data.date));
  }

  findTotalAmountAnyDay(dataset, date, rooms) {
    return dataset
      .filter(data => date.includes(data.date))
      .map(data => rooms.find(room => room.number === data.roomNumber).costPerNight)
      .reduce((sum, num) => parseFloat((sum+num).toFixed(2)), 0);
  }
}

export default Hotel;
