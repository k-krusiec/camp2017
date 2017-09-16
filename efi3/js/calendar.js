document.addEventListener('DOMContentLoaded', function() {
  var calendarContainer = document.querySelector('.calendar-main'); // znajdź cały kontener (kalendarz + settingsy)
  CalendarModule.init({calendarContainer: calendarContainer}); //przekarz do funckji init w CalendarModule jako parametr _options
});

var CalendarModule = (function () {
  var options = {};

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
        unchanged = true;
      } else {
        date.month = 0;
        date.year++;
        unchanged = true;
      }
    } else {
      if (date.month > 0) {
        date.month--;
        unchanged = true;
      } else {
        date.month = 11;
        date.year--;
        unchanged = true;
      }
    }

    if (unchanged) {
      setDate(inputs, date);
      return true;
    }
  }

  var dateControlers = function () {
    var buttons = options.calendar.querySelectorAll('.range a');
    var inputs = options.calendar.querySelectorAll('.range span');
    var today = new Date();
    var date = {
      day : today.getDay(),
      month : today.getMonth(),
      year : today.getFullYear()
    };

    var forEach = function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    };

    forEach(buttons, function(index, button) {
      if (button.className === 'prev-btn') {
        button.addEventListener('click', function () {changeDate(index, inputs, date)})
      } else {
        button.addEventListener('click', function () {changeDate(index, inputs, date)})
      }
    });

    //ustaw dzisiejszą datę na wjazd
    setDate(inputs, date);
  };

  var init = function (_options) {
    options = {
      /* zapisz obiekt calendarContainer (dokładnie to co złapał var calendarContainer w DOMie)
        w tym obiekcie lub jeżeli go nie ma to zapisz null */
      calendar: _options.calendarContainer || null
    };

    dateControlers();
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
