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
      photos: PHOTOS.sort(compareRandom),
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

function createElement(array, tag, classNameModificator, classNameElement, parent) {
  for (var i = 0; i < array.length; i++) {
    var newElement = document.createElement(tag);
    var classModificator = classNameModificator + array[i];
    newElement.classList.add(classNameElement, classModificator);
    parent.appendChild(newElement);
  }
  return parent;
}

function addPhotos(cardElement, index) {
  var photosList = cardElement.querySelector('.popup__photos');
  var photoTemplate = cardElement.querySelector('.popup__photo');
  photoTemplate.src = noticeList[index].offer.photos[0];
  noticeList[index].offer.photos.splice(0, 1);
  for (var i = 0; i < noticeList[index].offer.photos.length; i++) {
    var photoElement = photoTemplate.cloneNode();
    photosList.querySelector('.popup__photo').src = noticeList[index].offer.photos[i];
    photosList.appendChild(photoElement);
  }
}

var noticeList = [];
for (var i = 0; i < NOTICE_AMOUNT; i++) {
  noticeList[i] = getRandomNotice(i);
}

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapPinsList = document.querySelector('.map__pins');

var mapPinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__pin');

function renderMapPin(index) {
  var mapPinElement = mapPinTemplate.cloneNode(true);

  mapPinElement.style = 'left: ' + (noticeList[index].location.x - PIN_WIDTH / 2) + 'px; top: ' + (noticeList[index].location.y - PIN_HEIGHT) + 'px;';
  mapPinElement.querySelector('img').src = noticeList[index].author.avatar;
  mapPinElement.querySelector('img').alt = noticeList[index].offer.title;

  return mapPinElement;
}

var PinFragment = document.createDocumentFragment();
for (var j = 0; j < NOTICE_AMOUNT; j++) {
  PinFragment.appendChild(renderMapPin(j));
}

mapPinsList.appendChild(PinFragment);

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
  createElement(avaliableFeatures, 'li', 'popup__feature--', 'popup__feature', featuresList);

  cardElement.querySelector('.popup__description').textContent = noticeList[index].offer.description;
  addPhotos(cardElement, index);
  cardElement.querySelector('.popup__avatar').src = noticeList[index].author.avatar;


  return cardElement;
}

map.insertBefore(renderCard(getRandomInt(0, 7)), mapFilters);
