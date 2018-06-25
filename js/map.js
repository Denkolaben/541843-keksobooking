'use strict';

var NOTICE_AMOUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 130;
var MAX_Y = 630;
var CHECKIN_TIME = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MIN_LENGTH_ARRAY = 1;
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 87;
var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 45;
var ESC_KEYCODE = 27;

function getRandomIndex(array) {
  return Math.floor(Math.random() * (array.length - 1));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayLength(array) {
  var randomArrayLength = [];
  var primordialArray = array.slice();
  randomArrayLength.length = getRandomInt(MIN_LENGTH_ARRAY, primordialArray.length);
  for (var i = 0; i < randomArrayLength.length; i++) {
    var randomIndex = getRandomIndex(primordialArray);
    randomArrayLength[i] = primordialArray[randomIndex];
    primordialArray.splice(randomIndex, 1);
  }
  return randomArrayLength;
}

function compareRandom() {
  return Math.random() - 0.5;
}

function translateType(type) {
  var translatedType = '';
  if (type === 'flat') {
    translatedType = 'Квартира';
  } else if (type === 'bungalo') {
    translatedType = 'Бунгало';
  } else if (type === 'house') {
    translatedType = 'Дом';
  } else if (type === 'palace') {
    translatedType = 'Дворец';
  }

  return translatedType;
}

function getRandomNotice(index) {

  var addressLocation = {
    x: getRandomInt(MIN_X, MAX_X),
    y: getRandomInt(MIN_Y, MAX_Y),
  };

  return {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png',
    },

    offer: {
      title: TITLES[getRandomIndex(TITLES)],
      address: addressLocation.x + ', ' + addressLocation.y,
      price: getRandomInt(PRICE_MIN, PRICE_MAX),
      type: translateType(TYPES[getRandomIndex(TYPES)]),
      rooms: getRandomInt(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomInt(MIN_GUESTS, MAX_GUESTS),
      checkin: CHECKIN_TIME[getRandomIndex(CHECKIN_TIME)],
      checkout: CHECKOUT_TIME[getRandomIndex(CHECKOUT_TIME)],
      features: getRandomArrayLength(FEATURES),
      description: '',
      photos: PHOTOS.slice().sort(compareRandom),
    },

    location: addressLocation
  };
}

function deleteElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  return element;
}

function createElement(array, tag, classNameElement, parent, classNameModificator) {
  for (var i = 0; i < array.length; i++) {
    var newElement = document.createElement(tag);
    if (String(classNameModificator).match('popup__feature--')) {
      var classModificator = classNameModificator + array[i];
      newElement.classList.add(classNameElement, classModificator);
    } else {
      newElement.classList.add(classNameElement);
      newElement.src = array[i];
      newElement.setAttribute('width', PHOTO_WIDTH);
      newElement.setAttribute('height', PHOTO_HEIGHT);
    }
    parent.appendChild(newElement);
  }
  return parent;
}

var noticeList = [];
for (var i = 0; i < NOTICE_AMOUNT; i++) {
  noticeList[i] = getRandomNotice(i);
}

var map = document.querySelector('.map');

var mapPinsList = document.querySelector('.map__pins');

var mapPinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__pin');

function setMapPin(index) {
  var mapPinElement = mapPinTemplate.cloneNode(true);

  mapPinElement.style = 'left: ' + (noticeList[index].location.x + PIN_WIDTH / 2) + 'px; top: ' + (noticeList[index].location.y + PIN_HEIGHT) + 'px;';
  mapPinElement.querySelector('img').src = noticeList[index].author.avatar;
  mapPinElement.querySelector('img').alt = noticeList[index].offer.title;

  return mapPinElement;
}

var mapFilters = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('template')
    .content
    .querySelector('.map__card');

function renderCard(index) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = noticeList[index].offer.title;
  cardElement.querySelector('.popup__text--address').textContent = noticeList[index].offer.address;
  cardElement.querySelector('.popup__text--price').textContent = noticeList[index].offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = noticeList[index].offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = noticeList[index].offer.rooms + ' комнаты для ' + noticeList[index].offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + noticeList[index].offer.checkin + ' , выезд до ' + noticeList[index].offer.checkout;

  var featuresList = cardElement.querySelector('.popup__features');
  deleteElement(featuresList);
  var avaliableFeatures = noticeList[index].offer.features;
  createElement(avaliableFeatures, 'li', 'popup__feature', featuresList, 'popup__feature--');

  var photosList = cardElement.querySelector('.popup__photos');
  deleteElement(photosList);
  var avaliablePhotos = noticeList[index].offer.photos;
  createElement(avaliablePhotos, 'img', 'popup__photo', photosList);

  cardElement.querySelector('.popup__description').textContent = noticeList[index].offer.description;
  cardElement.querySelector('.popup__avatar').src = noticeList[index].author.avatar;


  return cardElement;
}

// module4-task1

var mainPin = document.querySelector('.map__pin--main');
var addForm = document.querySelector('.ad-form');
var fieldsets = document.querySelectorAll('fieldset');
var addressInput = document.getElementById('address');

function setActiveState() {
  map.classList.remove('map--faded');
  addForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = false;
  }
  mainPin.removeEventListener('mouseup', onMainPinClick);
}

function onMainPinClick() {
  setActiveState();
}

function setInactiveState() {
  map.classList.add('map--faded');
  addForm.classList.add('ad-form--disabled');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = true;
  }
  mainPin.addEventListener('mouseup', onMainPinClick);
}

function getPinCoordinate(element, width, height) {
  var x = parseInt(element.style.left, 10) + Math.round(width / 2);
  var y = parseInt(element.style.top, 10) + height;
  return x + ', ' + y;
}

function addListener(mapPin) {
  mapPin.addEventListener('click', function () {
    openPopup(mapPin.getAttribute('array-index'));
  });
}

function openPopup(index) {
  var mapCardPopup = map.querySelector('.map__card');
  if (mapCardPopup) {
    map.replaceChild(renderCard(index), mapCardPopup);
  } else {
    map.insertBefore(renderCard(index), mapFilters);
  }
  var cardCloseButton = map.querySelector('.popup__close');
  cardCloseButton.addEventListener('click', closePopup);
  cardCloseButton.addEventListener('keydown', onPopupEscPress);
}

var closePopup = function () {
  var mapCardPopup = map.querySelector('.map__card');
  map.removeChild(mapCardPopup);
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

function renderMapPin() {
  var PinFragment = document.createDocumentFragment();
  for (var i = 0; i < NOTICE_AMOUNT; i++) {
    var mapPin = setMapPin(i);
    mapPin.setAttribute('array-index', i);
    addListener(mapPin);
    PinFragment.appendChild(mapPin);
  }
  mapPinsList.appendChild(PinFragment);
}

mainPin.addEventListener('mouseup', function () {
  addressInput.value = getPinCoordinate(mainPin, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
  renderMapPin();
});

setInactiveState();
