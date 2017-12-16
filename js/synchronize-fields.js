'use strict';

(function () {
  window.synchronizeFields = function (element1, element2, sync) {
    element1.addEventListener('change', function (event) {
      var index = event.target.selectedIndex;
      sync(element2, index);
    });
  };
})();
