'use strict';

(function () {
  var URL = 'https://1510.dump.academy/keksobooking';
  var StatusCode = {
    OK: 200,
    REQUEST_ERR: 400,
    NOT_FOUND: 404,
    SERVER_ERR: 500
  };

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.OK:
          onLoad(xhr.response);
          break;
        case StatusCode.REQUEST_ERR:
          onError('Неверный запрос');
          break;
        case StatusCode.NOT_FOUND:
          onError('Не найдено на сервере');
          break;
        case StatusCode.SERVER_ERR:
          onError('Внутренняя ошибка сервера');
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
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    }
  };
})();
