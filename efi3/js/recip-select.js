(function() {

  var showRecipientsList = function(list) {
    list.classList.remove('hidden');
  };

  var hideRecipientsList = function(list) {
    list.classList.add('hidden');
  };

  var selectItem = function() {
    var selectContainer = document.querySelector('.search-box');
    var recipientsList = document.querySelector('.recipients-list');
    var accNumInput = document.querySelector('.account-number-input');
    var listItems = recipientsList.children;

    for (var i = 0, l = listItems.length; i < l; i++) {
      listItems[i].addEventListener('click', function() {
        var name = this.innerText;
        var accNum = this.dataset.account;
        selectContainer.firstElementChild.value = name;
        accNumInput.value = accNum;
      })
    }
  };

  var recipientsSelect = function() {
    var body = document.querySelector('body');
    var selectContainer = body.querySelector('.search-box');
    var recipientsList = body.querySelector('.recipients-list');
    var trigger = selectContainer.lastElementChild;



    selectContainer.lastElementChild.addEventListener('click', function(e) {
      var target = e.target;

      if (target !== trigger.parentNode) {
        if (recipientsList.classList.contains('hidden')) {
          showRecipientsList(recipientsList);
          selectItem();
        } else {
          hideRecipientsList(recipientsList);
        }
      }

      body.addEventListener('click', function(ev) {
        if (ev.target !== recipientsList &&
          ev.target !== selectContainer.children[1] &&
          ev.target !== selectContainer.children[1].children[0]) {
          hideRecipientsList(recipientsList);
        }
      });
    })
  }

  recipientsSelect();

})();
