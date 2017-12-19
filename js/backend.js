'use strict';

(function () {
  var URL = 'https://1510.dump.academy/keksobooking';

  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        case 400:
          onError('Неверный запрос');
          break;
        case 404:
          onError('Не найдено на сервере');
          break;

        default:
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + ' сек.');
    });

    xhr.timeout = 7000;

    return xhr;
  };

  window.backend = {
    save: function (data, onSuccess, onError) {
      var xhr = setup(onSuccess, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    },
    load: function (onSuccess, onError) {
      var xhr = setup(onSuccess, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    }
  };
})();
