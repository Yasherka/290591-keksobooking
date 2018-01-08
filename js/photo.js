'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var IMAGE_WIDTH = 140;
  var IMAGE_HEIGHT = 70;

  var avatarChooser = document.querySelector('.notice__photo input[type=file]');
  var avatarPreview = document.querySelector('.notice__preview img');
  var photoChooser = document.querySelector('.form__photo-container input[type=file]');
  window.photoPreview = document.querySelector('.form__photo-container');

  var renderPhoto = function (file, preview, id) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (id === 'avatar') {
          preview.src = reader.result;
        } else {
          var image = document.createElement('img');
          image.whidth = IMAGE_WIDTH;
          image.height = IMAGE_HEIGHT;
          image.src = reader.result;
          preview.appendChild(image);
        }
      });

      reader.readAsDataURL(file);
    }
  };

  avatarChooser.addEventListener('change', function (evt) {
    var id = evt.target.id;
    var avatar = avatarChooser.files[0];
    renderPhoto(avatar, avatarPreview, id);
  });

  photoChooser.addEventListener('change', function (evt) {
    var id = evt.target.id;
    var photo = photoChooser.files[0];
    renderPhoto(photo, window.photoPreview, id);
  });
})();
