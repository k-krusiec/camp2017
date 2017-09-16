document.addEventListener('DOMContentLoaded', function() {
  var calendarContainer = document.querySelector('.calendar-main'); // znajdź cały kontener (kalendarz + settingsy)
  CalendarModule.init({calendarContainer: calendarContainer}); //przekarz do funckji init w CalendarModule jako parametr _options
});

var CalendarModule = (function () {
  var options = {};

  var generateCalendar = function (cal, firstDay, numOfDays) {
    var firstDay = firstDay - 1; // poniedziałek pierwszym dniem tygodnia
    var numOfWeeks;
    var remainingDays = numOfDays;

    //jeżeli firstDay to niedziela to 7
    if (firstDay < 0) {
      firstDay = 6;
    }

    //ile tygodni?
    if (firstDay === 6) { //jeżeli niedziela
      if (numOfDays === 30 || numOfDays === 31) {
        numOfWeeks = 6;
      }
    } else if (firstDay === 5) { //jeżeli sobota
      if (numOfDays === 31) {
        numOfWeeks = 6;
      }
    } else if (firstDay === 0) { //jeżeli poniedziałek
      if (numOfDays === 28) {
        numOfWeeks = 4;
      }
    } else {
      numOfWeeks = 5;
    }

    console.log(cal.lastElementChild);
    // console.log(firstDay);
    console.log('numOfDays: ', numOfDays);

    for (var i = 0; i < numOfWeeks; i++) {
      var week = document.createElement('div');
      week.className = 'cal-week';
      week.dataset.index = i;
      cal.lastElementChild.insertAdjacentElement('afterend',week);
    }

    for (var i = 0; i < 7; i++) { //pierwszy tydzień
      var otherMonth = document.createElement('div');
      var normalDay = document.createElement('div');
      normalDay.innerText = 'normalDay ' + (i+1);
      normalDay.className = 'cal-day';
      otherMonth.innerText = 'otherMonth ' + (i+1);
      otherMonth.classList.add('cal-day');
      otherMonth.classList.add('last-next-month');
      if (i < firstDay) {
        cal.children[1].insertAdjacentElement('beforeend',otherMonth);
      } else {
        cal.children[1].insertAdjacentElement('beforeend',normalDay);
        remainingDays--;
      }
    }

    for (var i = 1; i < numOfWeeks - 1; i++) {
      for (var j = 0; j < 7; j++) { //od drugiego tygodnia to przedostatniego
        var otherMonth = document.createElement('div');
        var normalDay = document.createElement('div');
        normalDay.innerText = 'normalDay ' + (j+1);
        normalDay.className = 'cal-day';
        otherMonth.innerText = 'otherMonth ' + (j+1);
        otherMonth.classList.add('cal-day');
        otherMonth.classList.add('last-next-month');
        cal.children[i+1].insertAdjacentElement('beforeend',normalDay);
        remainingDays--;
      }
    }

    for (var i = 0; i < 7; i++) { //ostatni tydzień
      var otherMonth = document.createElement('div');
      var normalDay = document.createElement('div');
      normalDay.innerText = 'normalDay ' + (i+1);
      normalDay.className = 'cal-day';
      otherMonth.innerText = 'otherMonth ' + (i+1);
      otherMonth.classList.add('cal-day');
      otherMonth.classList.add('last-next-month');
      if (i < remainingDays) {
        cal.children[numOfWeeks].insertAdjacentElement('beforeend',normalDay);
      } else {
        cal.children[numOfWeeks].insertAdjacentElement('beforeend',otherMonth);
      }
    }
  }

  var firstDayInMonth = function (month, year) {
    return new Date((month + 1) + ' 1, ' + year).getDay();
  }

  var daysInMonth = function (month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  var setDate = function (inputs, date) {
    var monthsNames = ['January', 'February', 'March', 'April',
                        'May', 'June', 'July', 'August', 'September',
                        'October', 'November', 'December'];

    inputs[0].innerText = monthsNames[date.month];
    inputs[1].innerText = date.year;
  }

  var changeDate = function (index, inputs, date) {
    var wasChange = false;

    if (index !== 0) {
      if (date.month < 11) {
        date.month++;
        wasChange = true;
      } else {
        date.month = 0;
        date.year++;
        wasChange = true;
      }
    } else {
      if (date.month > 0) {
        date.month--;
        wasChange = true;
      } else {
        date.month = 11;
        date.year--;
        wasChange = true;
      }
    }

    if (wasChange) {
      setDate(inputs, date);
      return true;
    }
  }

  var dateControllers = function () {
    var controllers = options.calendar.querySelectorAll('.date-controller');
    var inputs = options.calendar.querySelectorAll('.range span');
    var cal = options.calendar.querySelector('.calendar-box');
    var today = new Date();
    var date = {
      day : today.getDay(),
      month : today.getMonth(),
      year : today.getFullYear()
    };
    var firstDay = firstDayInMonth(date.month, date.year);
    var numOfDays = daysInMonth(date.month, date.year);


    var forEach = function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    };

    forEach(controllers, function(index, controller) {
      if (index !== 0) {
        controller.addEventListener('click', function () {
          changeDate(index, inputs, date);
          firstDay = firstDayInMonth(date.month, date.year);
          numOfDays = daysInMonth(date.month, date.year);
          // generateCalendar(cal, firstDay, numOfDays);
        });
      } else {
        controller.addEventListener('click', function () {
          changeDate(index, inputs, date);
          firstDay = firstDayInMonth(date.month, date.year);
          numOfDays = daysInMonth(date.month, date.year);
          // generateCalendar(cal, firstDay, numOfDays);
        });
      }
    });

    //ustaw dzisiejszą datę na wjazd
    setDate(inputs, date);
    generateCalendar(cal, firstDay, numOfDays);
  };

  var init = function (_options) {
    options = {
      /* zapisz obiekt calendarContainer (dokładnie to co złapał var calendarContainer w DOMie)
        w tym obiekcie lub jeżeli go nie ma to zapisz null */
      calendar: _options.calendarContainer || null
    };

    dateControllers();
  };

  return {
    init: init
  };

})();


//data
// function myFunction() {
//   var today = new Date();
//   var month = today.getMonth();
//   console.log(daysInMonth(month + 1, today.getFullYear()))
// }
//
// function daysInMonth(month,year) {
//   return new Date(year, month, 0).getDate();
// }
//     myFunction();


// var tempDateFromSite = 'June 1, 1995';
// var tempTodayDateFromSite = 'July 16, 2017';
//
// var getNumOfDaysInMonth = function (month, year) {
//   return new Date(year, month, 0).getDate();
// }
//
// var getDateParams = function (date) {
//   console.log(date);
//   var day = new Date(tempDateFromSite);
//
//
// };
//
// var getDate = function () {
//   // pamiętaj! niedziela to dzień 0, sobota to dzień 6!
//   var date = new Date(tempTodayDateFromSite),
//       dateObject = {
//         day : date.getDay(),
//         month : date.getMonth() + 1,
//         year : date.getFullYear()
//       };
//       console.log(date);
//
//   console.log(getNumOfDaysInMonth(dateObject.month, dateObject.year));
//   getDateParams(dateObject);
// };



//events
// (function () {
//   var calendarBox = document.querySelector('.calendar-box');
//   var days = calendarBox.querySelectorAll('.cal-day');
//
//   var activate = function () {
//     this.classList.add('active');
//   }
//   var deactivate = function () {
//     this.classList.remove('active');
//   }
//   var select = function () {
//     this.classList.add('active');
//     this.removeEventListener('mouseout', activate);
//     this.removeEventListener('mouseout', deactivate);
//   }
//
//   for (var i = 0, l = days.length; i < l; i++) {
//     days[i].addEventListener('mouseover', activate);
//     days[i].addEventListener('mouseout', deactivate);
//     days[i].addEventListener('click', select);
//   }
// })();
