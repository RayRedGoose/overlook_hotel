import $ from 'jquery';

const doms = {
  putUserNameToHeader: function(user) {
    $('.user h2').text(`${user.name}`);
  },

  putTodayToHeader: function(today) {
    $('.date h2').text(today);
  },

  putNumberAvailableRooms: function(num) {
    $('.available-room-block p.number').text(`${num} rooms`);
  },

  fillRoomsLineChartLegend: function(elementType, num) {
    $(`#${elementType}`).attr('data-info', elementType);
    $(`#${elementType}`).attr('data-num', num);
  },

  updateIndicator: function(elementType, percent) {
    $(`#${elementType} .line-indicator`).css('width', `${percent}%`);
  },

  fillCircleChart: function(pct, num) {
    $('#full-indicator').css({ strokeDashoffset: pct});
    $('#full').attr('data-pct', num);
  },

  fillRevenueTotalAmount: function(amount) {
    $(`.total-revenue-block .number`).text(`$${amount}`);
  },

  fillRevenueChartLegend: function(elementType, day, amount) {
    $(`#${elementType}`).attr('data-info', day);
    $(`#${elementType}`).attr('data-num', amount);
  },

  showUserBookings: function(dataset, bookings, time) {
    bookings.forEach(booking => {
      let room = dataset.find(room => room.number === booking.roomNumber);
      let type = room.roomType.replace(' ', '_');
      $(`.${time}-preview`).append(`
        <div tabindex="0" class="room-preview">
          <p class="booking-day time-${time}">${booking.date}</p>
          <img src="./images/${type}.jpg" alt="${room.roomType} photo">
          <h4>${room.roomType}</h4>
          <p>${room.numBeds} "${room.bedSize}"</p>
          <p>$${room.costPerNight}</p>
          <button class="btn-${time}" type="button" name="delete-room" data-info="${booking.id}" data-roomNum="${booking.roomNumber}"></button>
        </div>`);
    });
  },

  fillTotalSpentAmount: function(amount) {
    $('.today-preview .number').text(`$${amount}`);
  },

  showAvailableBookings: function(rooms) {
    rooms.forEach(room => {
      let type = room.roomType.replace(' ', '_');
      $(`.book-preview`).append(`
        <div tabindex="0" class="room-preview room-for-choose">
          <img src="./images/${type}.jpg" alt="${room.roomType} photo">
          <h4>${room.roomType}</h4>
          <p>${room.numBeds} "${room.bedSize}"</p>
          <p>$${room.costPerNight}</p>
          <button type="button" name="book-room" data-info="${room.number}">book it</button>
        </div>`);
    });
  },
}

export default doms;
