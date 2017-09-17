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

  var dayPattern = function (num, type) {
    var dayDraft = document.createElement('div');
    var dayNumber = document.createElement('p');

    dayNumber.innerText = num;
    dayNumber.className = 'day-number'

    dayDraft.classList.add('cal-day');
    dayDraft.insertAdjacentElement('afterbegin', dayNumber);

    if (type.toUpperCase() === 'REGULAR') {
      dayDraft.classList.add('regular');
    }
    if (type.toUpperCase() === 'LAST') {
      dayDraft.classList.add('different-month');
    }
    if (type.toUpperCase() === 'NEXT') {
      dayDraft.classList.add('different-month');
    }

    return {dayDraft};
  }

  var prepareCalGrid = function (cal, date, wasChange) {
    var container = cal.children[1];
    var gridBox = document.createElement('div');
    gridBox.className = 'calendar-grid';

    //jeżeli ma być kalendarz to wywal domyślny tekst
    if (date.firstDay >= 0 && date.firstDay <= 6 && date.numOfDays !== 0) {
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

  var prepareCalData = function (date) {
    var numOfWeeks = 0;

    if (date.firstDay < 0) {date.firstDay = 6;} //jeżeli firstDay to niedziela to 6

    //ile tygodni?
    if (date.firstDay === 6 && (date.numOfDays === 30 || date.numOfDays === 31)) {date.numOfWeeks = 6;} //jeżeli niedziela
    else if (date.firstDay === 5 && date.numOfDays === 31) {date.numOfWeeks = 6;} //jeżeli sobota
    else if (date.firstDay === 0 && date.numOfDays === 28) {date.numOfWeeks = 4;} //jeżeli poniedziałek
    else {date.numOfWeeks = 5;}
  }

  var addWeeks = function (date, newContainer) {
    //dodaj tygodnie
    for (var i = 0, l = date.numOfWeeks; i < l; i++) {
      var week = document.createElement('div');
      week.className = 'cal-week';
      week.dataset.index = i;
      newContainer.insertAdjacentElement('beforeend',week);
    }
  }

  var fillFirstWeek = function (date, remainingDays, newContainer) {
    for (var i = 0; i < 7; i++) { //pierwszy tydzień
      var dayNumber = date.numOfDays - remainingDays + 1;
      var day = dayPattern(dayNumber, 'regular').dayDraft;
      var lastMonthDay = dayPattern('poprzedni' + (i+1), 'last').dayDraft;

      if (date.firstDay !== 0) {
        if (i < date.firstDay) {
          newContainer.children[0].insertAdjacentElement('beforeend', lastMonthDay);
        } else {
          newContainer.children[0].insertAdjacentElement('beforeend', day);
          remainingDays--;
        }
      } else {
        newContainer.children[0].insertAdjacentElement('beforeend', day);
        remainingDays--;
      }

      if (i === 6) {day.classList.add('sunday');} //dodaj klasę sunday do niedzieli

      if (dayNumber === date.activeDay) {day.classList.add('active');}
    }

    return {remainingDays};
  }

  var fillMiddleWeeks = function (date, remainingDays, newContainer) {
    for (var i = 1; i < date.numOfWeeks - 1; i++) {
      for (var j = 0; j < 7; j++) { //od drugiego tygodnia to przedostatniego
        var dayNumber = date.numOfDays - remainingDays + 1;
        var day = dayPattern(dayNumber, 'regular').dayDraft;

        newContainer.children[i].insertAdjacentElement('beforeend', day);

        if (j === 6) {day.classList.add('sunday');} //dodaj klasę sunday do niedzieli

        if (dayNumber === date.activeDay) {day.classList.add('active');}

        remainingDays--;
      }
    }

    return {remainingDays};
  }

  var fillLastWeek = function (date, remainingDays, newContainer) {
    for (var i = 0; i < 7; i++) { //ostatni tydzień
      var dayNumber = date.numOfDays - remainingDays + 1;
      var day = dayPattern(dayNumber, 'regular').dayDraft;
      var lastMonthDay = dayPattern('następny' + (i+1), 'last').dayDraft;
      if (i < dayNumber && dayNumber !== date.numOfDays + 1) {
        newContainer.children[date.numOfWeeks-1].insertAdjacentElement('beforeend', day);
        remainingDays--;
      } else {
        newContainer.children[date.numOfWeeks-1].insertAdjacentElement('beforeend', lastMonthDay);
      }

      if (i === 6) {day.classList.add('sunday');} //dodaj klasę sunday do niedzieli

      if (dayNumber === date.activeDay) {day.classList.add('active');}
    }

    return {remainingDays};
  }

  var setActiveDay = function (date) {
    var todayDay = date.today.getDate();
    var todayMonth = date.today.getMonth();
    var todayYear = date.today.getFullYear();

    if (todayMonth !== date.month.number || todayYear !== date.year) {
      date.activeDay = null;
    } else {
      date.activeDay = todayDay;
    }
  }

  var generateCalendar = function (cal, date, wasChange) {
    var remainingDays = date.numOfDays;
    var newContainer;
    var newFirstDay;
    var numOfWeeks;


    //wywalam default kontener lub stary kontener, dodaję nowy kontener
    newContainer = prepareCalGrid(cal, date, wasChange).container;

    //ustalam nowy pierwszy dzień (poniedziałek) i liczbę tygodni
    prepareCalData(date);
    setActiveDay(date);

    //dodaję tygodnie do kontenera
    addWeeks(date, newContainer);

    //dodaj dni do pierwszego tygodnia
    remainingDays = fillFirstWeek(date, remainingDays, newContainer).remainingDays;

    //dodaj dni do środkowych tygodni
    remainingDays = fillMiddleWeeks(date, remainingDays, newContainer).remainingDays;

    //dodaj dni do ostatniego tygodnia
    remainingDays = fillLastWeek(date, remainingDays, newContainer).remainingDays;



    if (remainingDays !== 0) {
      console.warn('Wystąpił błąd przy generowaniu kalendarza!');
      return false;
    } else {
      console.info('%c Kalendarz został wygenerowany poprawnie.', success);
      return true;
    }
  }

  var firstDayInMonth = function (month, year) {
    return new Date((month + 1) + ' 1, ' + year).getDay() - 1;
  }

  var daysInMonth = function (month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  var setDate = function (inputs, date) {
    var monthsNames = ['January', 'February', 'March', 'April',
                        'May', 'June', 'July', 'August', 'September',
                        'October', 'November', 'December'];

    date.month.name = monthsNames[date.month.number];
    inputs[0].innerText = date.month.name;
    inputs[1].innerText = date.year;
  }

  var changeDate = function (index, inputs, date) {
    var wasChange = false;

    if (index !== 0) {
      if (date.month.number < 11) {
        date.month.number++;
        wasChange = true;
      } else {
        date.month.number = 0;
        date.year++;
        wasChange = true;
      }
    } else {
      if (date.month.number > 0) {
        date.month.number--;
        wasChange = true;
      } else {
        date.month.number = 11;
        date.year--;
        wasChange = true;
      }
    }

    if (wasChange) {
      setDate(inputs, date);
      return true;
    }
  }

  var getTodaysDate = function () {
    var newDate = new Date();
    var date = {
      today: newDate,
      day: newDate.getDate(),
      month: {
        number: newDate.getMonth(),
      },
      year: newDate.getFullYear(),
    };

    date.firstDay = firstDayInMonth(date.month.number, date.year);
    date.numOfDays = daysInMonth(date.month.number, date.year);

    return date;
  }

  var dateControllers = function () {
    var controllers = options.calendar.querySelectorAll('.date-controller');
    var inputs = options.calendar.querySelectorAll('.range span');
    var cal = options.calendar.querySelector('.calendar-box');
    var date = getTodaysDate();

    var forEach = function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    };

    forEach(controllers, function(index, controller) {
      if (index !== 0) {
        controller.addEventListener('click', function () {
          changeDate(index, inputs, date);
          date.firstDay = firstDayInMonth(date.month.number, date.year);
          date.numOfDays = daysInMonth(date.month.number, date.year);
          //true - bo była zmiana miesiąca
          generateCalendar(cal, date, true);
        });
      } else {
        controller.addEventListener('click', function () {
          changeDate(index, inputs, date);
          date.firstDay = firstDayInMonth(date.month.number, date.year);
          date.numOfDays = daysInMonth(date.month.number, date.year);
          //true - bo była zmiana miesiąca
          generateCalendar(cal, date, true);
        });
      }
    });

    //ustaw dzisiejszą datę na wjazd
    setDate(inputs, date);
    generateCalendar(cal, date, false); // false na wjazd (nie było zmiany miesiąca)
  };

  var init = function (_options) {
    options = {
      /* zapisz obiekt calendarContainer (dokładnie to co złapał var calendarContainer w DOMie)
        w tym obiekcie lub jeżeli go nie ma to zapisz null */
      calendar: _options.calendarContainer || null
    };

    if ( _options.calendarContainer === null || _options.calendarContainer === undefined || _options.calendarContainer === 0 ) {
      console.warn('CalendarModule: Źle przekazany kalendarz');
      return false;
    }

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
