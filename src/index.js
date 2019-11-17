//Packages
import $ from 'jquery';
// Styles files
import './css/base.scss';

// Images
import './images/bg-image.jpg';
import './images/glass.jpg';
import './images/avatar.svg';
import './images/user.svg';
import './images/residential_suite.jpg';
import './images/suite.jpg';
import './images/junior_suite.jpg';
import './images/single_room.jpg';
import './images/delete.svg'

// Classes
import doms from './js/domManipulation';
import Days from './js/Days';
import Hotel from './js/Hotel';
import Room from './js/Room';
import Customer from './js/Customer';
import Manager from './js/Manager';

// START SCRIPTS

// vars
let hotel,
  room,
  customer,
  manager;


$(document).ready(function() {
  (window.location.pathname === '/')
    ? loadEventListenerForLoginPage()
    : loadUtilities();
  if (window.location.pathname === '/manager-deck.html') { loadManagerDeck(); }
  if (window.location.pathname === '/customer-deck.html') { loadUserDeck(); }

  $('.input label').on('click', function() {
    $(this).addClass('clicked');
  });

  $('.input input')
    .on('click focus', function() {
      $(this).siblings().addClass('clicked');
    })
    .on('blur', function() {
      if ($(this).val() === "") { $(this).siblings().removeClass('clicked'); }
    });
});

function loadEventListenerForLoginPage() {
  $('.login-form button').on('click', function() {
    (makeValidation()) ? redirect() : toggleError('.login-form');
  });
}

function makeValidation() {
  const user = $('input[type="radio"]:checked').val();
  const username = $('#username').val();
  const password = $('#password').val();
  if (user === 'manager') {
    return checkManager(username, password);
  }
  if (user === 'customer') {
    return checkCustomer(username, password);
  }
}

function checkManager(username, password) {
  return username === 'manager' && password === 'overlook2019';
}

function checkCustomer(username, password) {
  const checkUserID = !isNaN(username.replace('customer', ''))
  const checkCustomerName = username.startsWith('customer') && checkUserID;
  return checkCustomerName && password === 'overlook2019';
}

function redirect() {
  const user = $('input[type="radio"]:checked').val();
  localStorage.setItem('user', $('#username').val())
  window.location = `./${user}-deck.html`;
}

function loadUtilities() {
  $('button[name="logout"]').on('click', function() {
    localStorage.removeItem('user');
    localStorage.removeItem('managerMode');
    window.location = '/';
  });
  hotel = new Hotel();
  room = new Room();
}

function loadManagerDeck() {
  manager = new Manager('manager');
  Promise.all([
    hotel.getAPIData(
      'https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users',
      'users'),
    room.getRoomsFromAPI(),
    manager.getBookingFromAPI()
  ]).then(() => updateManagerBoard(manager));
  loadEventListenerForManagerDeck();
}

function updateManagerBoard(user) {
  doms.putUserNameToHeader(user);
  updateHeaderDay(manager);
  let occupiedRooms = room.findOccupiedRooms (manager.data, Days.today);
  let availableRooms = room.findAvailableRooms (occupiedRooms);
  updateAvailableRoomBoard(availableRooms);
  updateOccupiedRoomBoard(occupiedRooms);
  updateRevenueBoard();
}

function updateHeaderDay(user) {
  Days.findAllDays(user.data);
  Days.findToday();
  doms.putTodayToHeader(Days.today);
}

function updateAvailableRoomBoard(availableRooms) {
  doms.putNumberAvailableRooms(availableRooms.length);
  fillLineChartAvailableRoomBlock(availableRooms);
}

function fillLineChartAvailableRoomBlock(availableRooms) {
  let roomStatistic = room.getRoomStatistics(availableRooms);
  Object.keys(roomStatistic).forEach(key => {
    let percent = parseInt(roomStatistic[key] / availableRooms.length * 100);
    doms.fillRoomsLineChartLegend(key.split(' ')[0], roomStatistic[key]);
    doms.updateIndicator(key.split(' ')[0], percent);
  });
}

function updateOccupiedRoomBoard(occupiedRooms) {
  fillCircleChartOccupiedRoom(occupiedRooms);
}

function fillCircleChartOccupiedRoom(occupiedRooms) {
  let $circle = $('#full-indicator');
  let r = $circle.attr('r');
  let c = Math.PI * (r * 2);
  let percent = room.findOccupiedRoomPercent(occupiedRooms);
  if (percent < 0) { percent = 0;}
  if (percent > 100) { percent = 100;}
  var lenght = ((100 - percent) / 100) * c;
  doms.fillCircleChart(lenght, percent);
}

function updateRevenueBoard() {
  let dates = Days.findTripleDays();
  let stats = dates.map(day => {
    return manager.findTotalAmountAnyDay(manager.data, day, room.data);
  });
  doms.fillRevenueTotalAmount(stats[2]);
  fillLineChartRevenueBlock(dates, stats);
}

function fillLineChartRevenueBlock(date, stats) {
  let max = Math.max(...stats);
  let pct = stats.map(el => (el * 100 / max).toFixed());
  let ids = ['before', 'yesterday', 'today']
  ids.forEach((id, index) => {
    doms.fillRevenueChartLegend(id, date[index], stats[index]);
    doms.updateIndicator(id, pct[index]);
  });
}

function loadEventListenerForManagerDeck() {
  $('button[name="find-user-preview"]').on('click', function() {
    $('.toggle-block').toggle();
  });

  $('button[name="find-user"]').on('click', startUserSearching);
}

function startUserSearching() {
  const name = $('#find-user-name').val().trim();
  const lastName = $('#find-user-lastname').val().trim();
  const chosenUser = hotel.findUser('name', `${name} ${lastName}`);
  if (chosenUser) {
    localStorage.setItem('managerMode', true);
    localStorage.setItem('user', chosenUser.id);
    window.location = "./customer-deck.html";
  } else {
    toggleError('.toggle-block');
  }
}

function loadUserDeck() {
  Promise.all([
    hotel.getAPIData(
      'https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users',
      'users'),
    room.getRoomsFromAPI()
  ]).then(() => createUserBoard());
}

function createUserBoard() {
  createUser();
  customer.getBookingFromAPI().then(() => updateUserBoard());
  loadEventListenerForUserDeck();
}

function createUser() {
  let userId = parseInt(localStorage.getItem('user').replace('customer', ''));
  let currentUser = hotel.findUser('id', userId);
  customer = new Customer('customer', currentUser);
  doms.putUserNameToHeader(customer);
}

function updateUserBoard() {
  checkMode();
  updateHeaderDay(customer);
  addRestrictionToDateInput();
  showBookingsOnBoard();
  showTotalSpent();
  $('button[name="back"]').on('click', function() {
    localStorage.removeItem('user');
    window.location = "./manager-deck.html";
  });
}

function checkMode() {
  const mode = JSON.parse(localStorage.getItem('managerMode'));
  if (mode) {
    manager = new Manager('manager')
    manager.data = customer.data;
    $('.customer-mode').show();
    $('button[name="back"]').show();
  }
}

function addRestrictionToDateInput() {
  let day = Days.today.split('/').join('-');
  $('input[type="date"]').attr('min', day);
}

function showBookingsOnBoard() {
  showTodayBookings();
  showPastBookings();
  showUpcomingBookings();
}

function showTodayBookings() {
  let todayBookings = customer.findUserBookingInfo(Days.today);
  if (todayBookings.length > 0) {
    doms.showUserBookings(room.data, todayBookings, 'today');
  } else {
    $('.today-preview .message').show();
  }
}

function showPastBookings() {
  let pastBookings = customer.findUserBookingInfo(Days.findPastDays());
  if (pastBookings.length > 0) {
    doms.showUserBookings(room.data, pastBookings, 'history');
  } else {
    $('.history-preview .message').show();
  }
}

function showUpcomingBookings() {
  const mode = JSON.parse(localStorage.getItem('managerMode'));
  let futureBookings = customer.findUserBookingInfo(Days.findFutureDays());
  if (futureBookings.length > 0) {
    doms.showUserBookings(room.data, futureBookings, 'upcoming');
    deleteChosenBooking();
  } else {
    $('.upcoming-preview .message').show();
  }
  if (mode) {
    $('.btn-upcoming').show();
  }
}

function deleteChosenBooking() {
  $('button[name="delete-room"].btn-upcoming').on('click', function(event) {
    event.preventDefault();
    const bookingID = $(this).data('info');
    const roomNumber = $(this).data('roomNum');
    manager.deleteBooking(bookingID, roomNumber);
    $(this).parents('.room-preview').remove();
  });
}

function showTotalSpent() {
  let spentAmount = customer.findSpentTotal(Days.allDays, room.data);
  doms.fillTotalSpentAmount(spentAmount);
}

function loadEventListenerForUserDeck() {
  $('.first-click button').on('click', startSecondStepOfChoosingRoom);
  $('.second-click button').on('click', showSearchingResults);
  $('#clear-labels').on('click', clearSearchParameterLabels);
  $('.preview-tab').on('click', toggleActiveTab);
}

function startSecondStepOfChoosingRoom() {
  let $type = $(this).text();
  $('.labels').prepend(`<p class="room-type label">${$type}</p>`);
  $('#clear-labels').show();
  $(this).parent().hide();
  $('.second-click').show();
  customer.booking.roomType = $type;
}

function showSearchingResults() {
  let bed = $(this).text();
  $('.labels').prepend(`<p class="bed-size label">${bed}</p>`);
  $(this).parent().hide();
  let day = $('.user-board input[type="date"]').val().split('-').join('/');
  customer.booking.bedSize = bed;
  (day !== '')
    ? findAvailableRoomForBooking(day)
    : toggleError('.book-preview');
}

function findAvailableRoomForBooking(day) {
  showAvailableRooms(day);
  $('button[name="book-room"]').on('click', function(event) {
    reserveChosenRoom(this, day);
  });
}

function showAvailableRooms(day) {
  let occupiedRooms = room.findOccupiedRooms(customer.data, day);
  let rooms = room.findAvailableRooms (occupiedRooms);
  let specificRooms = room.findSpecificRooms(
    rooms,
    customer.booking.roomType,
    customer.booking.bedSize);
  doms.showAvailableBookings(specificRooms);
  if (specificRooms.length === 0) { toggleMessage(); }
}

function reserveChosenRoom(target, day) {
  $('.book-preview').children('div').remove();
  $('.labels').children('.label').remove();
  $('#clear-labels').hide();
  $('.first-click').show();
  $('.second-click').hide();
  let roomNumber = $(target).data('info');
  customer.reserveRoom(day, roomNumber);
  $('input[type="date"]').val('');
}

function clearSearchParameterLabels() {
  $('.bed-size, .room-type').remove();
  $('.book-preview').children('div').remove();
  $(this).hide();
  $('.first-click').show();
  $('.second-click').hide();
  $('input[type="date"]').val('');
}

function toggleActiveTab() {
  let $type = $(this).data('type');
  $(`.${$type}-preview`)
    .css('display', 'grid')
    .siblings('main').hide();
  $(this)
    .removeClass('unactive')
    .siblings().addClass('unactive');
}

function toggleError(parent) {
  $(`${parent} .error-message`).fadeIn(300);
  setTimeout(function() {
    $(`${parent} .error-message`).fadeOut(300);
  }, 2000);
}

function toggleMessage() {
  $('.book-preview .message').fadeIn(300);
  setTimeout(function() {
    $('.book-preview .message').fadeOut(300);
  }, 3000);
}

function setTime() {
  let currentTime = new Date(),
    hour = currentTime.getHours(),
    minute = currentTime.getMinutes(),
    second = currentTime.getSeconds(),
    hourDeg = (360 / 12) * hour,
    minuteDeg = (360 / 60) * minute,
    secondDeg = (360 / 60) * second;

  $('#hour').css('transform', `rotate(${hourDeg}deg)`);
  $('#minute').css('transform', `rotate(${minuteDeg}deg)`);
  $('#second').css('transform', `rotate(${secondDeg}deg)`);
}

setInterval(function() {
  setTime();
}, 1000);

$('body').on('keydown', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $(event.target).click();
  }
});
