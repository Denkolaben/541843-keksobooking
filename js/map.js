'use strict';

var MAX_AVATARS_NUMBER = 8;
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
var avatarsArray = [];
for (var i = 0; i < MAX_AVATARS_NUMBER; i++) {
  avatarsArray[i] = 'img/avatars/user0' + (i + 1) + '.png';
}

function getRandomUniqueElement(array) {
  var randomIndex = getRandomIndex(array);
  var uniqueElement = array.splice(randomIndex, 1);
  return uniqueElement[0];
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * (array.length - 1));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayLength(array) {
  var randomArrayLength = [];
  var primordialArray = array;
  randomArrayLength.length = getRandomInt(MIN_LENGTH_ARRAY, primordialArray.length);
  for (i = 0; i < randomArrayLength.length; i++) {
    var randomIndex = getRandomIndex(primordialArray);
    randomArrayLength[i] = primordialArray[randomIndex];
    primordialArray.splice(randomIndex, 1);
  }
  return randomArrayLength;
}

function compareRandom() {
  return Math.random() - 0.5;
}

function getAddress() {
  var x = getRandomInt(MIN_X, MAX_X);
  var y = getRandomInt(MIN_Y, MAX_Y);
  return x + ', ' + y;
}

function getRandomNotice() {
  return {
    author: {
      avatar: getRandomUniqueElement(avatarsArray)
    },

    offer: {
      title: TITLES[getRandomIndex(TITLES)],
      address: getAddress(),
      price: getRandomInt(PRICE_MIN, PRICE_MAX),
      type: TYPES[getRandomIndex(TYPES)],
      rooms: getRandomInt(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomInt(MIN_GUESTS, MAX_GUESTS),
      checkin: CHECKIN_TIME[getRandomIndex(CHECKIN_TIME)],
      checkout: CHECKOUT_TIME[getRandomIndex(CHECKOUT_TIME)],
      features: getRandomArrayLength(FEATURES),
      description: '',
      photos: PHOTOS.sort(compareRandom),
    },

    location: {
      x: getRandomInt(MIN_X, MAX_X),
      y: getRandomInt(MIN_Y, MIN_Y),
    }
  };
}

function deleteElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  return element;
}

function createElement(array, tag, classNameModificator, classNameElement, parent) {
  for (i = 0; i < array.length - 1; i++) {
    var newElement = document.createElement(tag);
    var classModificator = classNameModificator + array[i];
    newElement.classList.add(classNameElement, classModificator);
    parent.appendChild(newElement);
  }
  return parent;
}

var noticeList = [];
for (var j = 0; j < NOTICE_AMOUNT; j++) {
  noticeList[j] = getRandomNotice(j);
}

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapPinsList = document.querySelector('.map__pins');

var mapPinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__pin');

function renderMapPin(index) {
  var mapPinElement = mapPinTemplate.cloneNode(true);

  mapPinElement.style = 'left: ' + (noticeList[index].offer.address.slice(0, 3) - PIN_WIDTH / 2) + 'px; top: ' + (noticeList[index].offer.address.slice(5, 8) - PIN_HEIGHT) + 'px;';
  mapPinElement.querySelector('img').src = noticeList[index].author.avatar;
  mapPinElement.querySelector('img').alt = noticeList[index].offer.title;

  return mapPinElement;
}

var PinFragment = document.createDocumentFragment();
for (var k = 0; k < NOTICE_AMOUNT; k++) {
  PinFragment.appendChild(renderMapPin(k));
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
  if (noticeList[index].offer.type === 'flat') {
    cardElement.querySelector('.popup__type').textContent = 'Квартира';
  } else if (noticeList[index].offer.type === 'bungalo') {
    cardElement.querySelector('.popup__type').textContent = 'Бунгало';
  } else if (noticeList[index].offer.type === 'house') {
    cardElement.querySelector('.popup__type').textContent = 'Дом';
  } else if (noticeList[index].offer.type === 'palace') {
    cardElement.querySelector('.popup__type').textContent = 'Дворец';
  }
  cardElement.querySelector('.popup__text--capacity').textContent = noticeList[index].offer.rooms + ' комнаты для ' + noticeList[index].offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + noticeList[index].offer.checkin + ' , выезд до ' + noticeList[index].offer.checkout;

  var featuresList = cardElement.querySelector('.popup__features');
  deleteElement(featuresList);
  var avaliableFeatures = noticeList[index].offer.features;
  createElement(avaliableFeatures, 'li', 'popup__feature--', 'popup__feature', featuresList);

  cardElement.querySelector('.popup__description').textContent = noticeList[index].offer.description;

  var photosList = cardElement.querySelector('.popup__photos');
  var photoTemplate = cardElement.querySelector('.popup__photo');
  photoTemplate.src = noticeList[index].offer.photos[0];
  noticeList[index].offer.photos.splice(0, 1);
  for (var l = 0; l < noticeList[index].offer.photos.length; l++) {
    var photoElement = photoTemplate.cloneNode();
    photosList.querySelector('.popup__photo').src = noticeList[index].offer.photos[l];
    photosList.appendChild(photoElement);
  }

  cardElement.querySelector('.popup__avatar').src = noticeList[index].author.avatar;


  return cardElement;
}

map.insertBefore(renderCard(getRandomInt(0, 7)), mapFilters);
