const dataset = {
  users: [
    {id: 1, name: 'Leatha Ullrich'},
    {id: 2, name: 'Rocio Schuster'}
  ],

  bookings: [{
    id: 1572293130170,
    userID: 1,
    date: "2019/11/20",
    roomNumber: 1
    },{
    id: 1572293130171,
    userID: 2,
    date: "2019/11/20",
    roomNumber: 2
    },{
    id: 1572293130172,
    userID: 1,
    date: "2019/11/21",
    roomNumber: 1
    },{
    id: 1572293130173,
    userID: 2,
    date: "2019/11/21",
    roomNumber: 2
    },{
    id: 1572293130176,
    userID: 1,
    date: "2019/10/23",
    roomNumber: 1
    },{
    id: 1572293130177,
    userID: 2,
    date: "2019/10/23",
    roomNumber: 2
    }
  ],

  rooms: [{
    number: 1,
    roomType: "residential suite",
    bedSize: "queen",
    numBeds: 1,
    costPerNight: 358.4
    },{
    number: 2,
    roomType: "suite",
    bedSize: "full",
    numBeds: 2,
    costPerNight: 477.38
    },
    {
    number: 3,
    roomType: "single room",
    bedSize: "king",
    numBeds: 1,
    costPerNight: 491.14
    },
    {
    number: 4,
    roomType: "single room",
    bedSize: "queen",
    numBeds: 1,
    costPerNight: 429.44
    }
  ]
}

export default dataset;
