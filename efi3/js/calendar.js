document.addEventListener('DOMContentLoaded', function() {
  var calendarContainer = document.querySelector('.calendar-main'); // znajdź cały kontener (kalendarz + settingsy)
  CalendarModule.init({calendarContainer: calendarContainer}); //przekarz do funckji init w CalendarModule jako parametr _options
});

var CalendarModule = (function () {
  var options = {};

  //Bez jaj! Kolorowanie logów :)
  //https://medium.freecodecamp.org/how-to-get-the-most-out-of-the-javascript-console-b57ca9db3e6d
  const success = [
    'display: block',
    'padding: 2px 10px',
    'border-radius: 5px',
    'background: #dcedc8',
    'color: black'
  ].join(';');

  var prepareCalGrid = function (cal, firstDay, numOfDays, wasChange) {
    var container = cal.children[1];
    var gridBox = document.createElement('div');
    gridBox.className = 'calendar-grid';

    //jeżeli ma być kalendarz to wywal domyślny tekst
    if (firstDay >= 0 && firstDay <= 6 && numOfDays !== 0) {
      if (container.className === 'cal-not-availible') {
        cal.removeChild(container);
        cal.insertAdjacentElement('beforeend', gridBox);
        container = cal.children[1];
      }
    }

    if (wasChange) {
      cal.removeChild(container);
      cal.insertAdjacentElement('beforeend', gridBox);
      container = cal.children[1];
    }

    return {container : container};
  }

  var prepareCalData = function (firstDay, numOfDays) {
    var numOfWeeks = 0;

    if (firstDay < 0) {firstDay = 6;} //jeżeli firstDay to niedziela to 6

    //ile tygodni?
    if (firstDay === 6 && (numOfDays === 30 || numOfDays === 31)) {numOfWeeks = 6;} //jeżeli niedziela
    else if (firstDay === 5 && numOfDays === 31) {numOfWeeks = 6;} //jeżeli sobota
    else if (firstDay === 0 && numOfDays === 28) {numOfWeeks = 4;} //jeżeli poniedziałek
    else {numOfWeeks = 5;}

    return {firstDay, numOfWeeks};
  }

  var addWeeks = function (numOfWeeks, newContainer) {
    //dodaj tygodnie
    for (var i = 0; i < numOfWeeks; i++) {
      var week = document.createElement('div');
      week.className = 'cal-week';
      week.dataset.index = i;
      newContainer.insertAdjacentElement('beforeend',week);
    }
  }

  var fillFirstWeek = function (newFirstDay, newContainer, numOfDays, remainingDays) {
    for (var i = 0; i < 7; i++) { //pierwszy tydzień
      var day = numOfDays - remainingDays + 1;
      var otherMonth = document.createElement('div');
      var normalDay = document.createElement('div');

      normalDay.innerText = day;
      normalDay.classList.add('cal-day');
      otherMonth.innerText = 'otherMonth ' + (i+1);
      otherMonth.classList.add('cal-day');
      otherMonth.classList.add('last-next-month');

      if (newFirstDay !== 0) {
        if (i < newFirstDay) {
          newContainer.children[0].insertAdjacentElement('beforeend',otherMonth);
        } else {
          newContainer.children[0].insertAdjacentElement('beforeend',normalDay);
          remainingDays--;
        }
      } else {
        newContainer.children[0].insertAdjacentElement('beforeend',normalDay);
        remainingDays--;
      }

      if (i === 6) {normalDay.classList.add('sunday');} //dodaj klasę sunday do niedzieli
    }

    return {remainingDays};
  }

  var fillMiddleWeeks = function (numOfWeeks, newContainer, numOfDays, remainingDays) {
    for (var i = 1; i < numOfWeeks - 1; i++) {
      for (var j = 0; j < 7; j++) { //od drugiego tygodnia to przedostatniego
        var day = numOfDays - remainingDays + 1;
        var otherMonth = document.createElement('div');
        var normalDay = document.createElement('div');

        normalDay.innerText = day;
        normalDay.className = 'cal-day';
        otherMonth.innerText = 'otherMonth ' + (j+1);
        otherMonth.classList.add('cal-day');
        otherMonth.classList.add('last-next-month');
        newContainer.children[i].insertAdjacentElement('beforeend',normalDay);

        if (j === 6) {normalDay.classList.add('sunday');} //dodaj klasę sunday do niedzieli

        remainingDays--;
      }
    }

    return {remainingDays};
  }

  var fillLastWeek = function (numOfWeeks, newContainer, numOfDays, remainingDays) {
    for (var i = 0; i < 7; i++) { //ostatni tydzień
      var day = numOfDays - remainingDays + 1;
      var otherMonth = document.createElement('div');
      var normalDay = document.createElement('div');

      normalDay.innerText = day;
      normalDay.className = 'cal-day';
      otherMonth.innerText = 'otherMonth ' + (i+1);
      otherMonth.classList.add('cal-day');
      otherMonth.classList.add('last-next-month');

      if (i < day && day !== numOfDays + 1) {
        newContainer.children[numOfWeeks-1].insertAdjacentElement('beforeend',normalDay);
        remainingDays--;
      } else {
        newContainer.children[numOfWeeks-1].insertAdjacentElement('beforeend',otherMonth);
      }

      if (i === 6) {normalDay.classList.add('sunday');} //dodaj klasę sunday do niedzieli
    }

    return {remainingDays};
  }

  var generateCalendar = function (cal, firstDay, numOfDays, wasChange) {
    var remainingDays = numOfDays;
    var newContainer;
    var newFirstDay;
    var numOfWeeks;

    // przesuwam początek tygodnia z niedzieli na poniedziałek
    firstDay = (firstDay - 1);

    //wywalam default i stary kontener, dodaję nowy kontener
    newContainer = prepareCalGrid(cal, firstDay, numOfDays, wasChange).container;

    //ustalam nowy pierwszy dzień (poniedziałek) i liczbę tygodni
    newFirstDay = prepareCalData(firstDay, numOfDays).firstDay;
    numOfWeeks = prepareCalData(firstDay, numOfDays).numOfWeeks;

    //dodaję tygodnie do kontenera
    addWeeks(numOfWeeks, newContainer);

    //dodaj dni do pierwszego tygodnia
    remainingDays = fillFirstWeek(newFirstDay, newContainer, numOfDays, remainingDays).remainingDays;

    //dodaj dni do środkowych tygodni
    remainingDays = fillMiddleWeeks(numOfWeeks, newContainer, numOfDays, remainingDays).remainingDays;

    remainingDays = fillLastWeek(numOfWeeks, newContainer, numOfDays, remainingDays).remainingDays;

    // remainingDays++
    if (remainingDays !== 0) {
      console.warn('Wystąpił błąd przy generowaniu kalendarza!');
      return false;
    } else {
      console.info('%c Kalendarz został wygenerowany poprawnie.', success);
      return true;
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
          //true - bo była zmiana miesiąca
          generateCalendar(cal, firstDay, numOfDays, true);
        });
      } else {
        controller.addEventListener('click', function () {
          changeDate(index, inputs, date);
          firstDay = firstDayInMonth(date.month, date.year);
          numOfDays = daysInMonth(date.month, date.year);
          //true - bo była zmiana miesiąca
          generateCalendar(cal, firstDay, numOfDays, true);
        });
      }
    });

    //ustaw dzisiejszą datę na wjazd
    setDate(inputs, date);
    generateCalendar(cal, firstDay, numOfDays, false); // false na wjazd (nie było zmiany miesiąca)
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
