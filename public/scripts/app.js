/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

const weatherApp = {
  selectedLocations: {},
  // addDialogContainer: document.getElementById('addDialogContainer'),
};

/**
 * Toggles the visibility of the add location dialog box.
 */
function toggleAddDialog() {
  weatherApp.addDialogContainer.classList.toggle('visible');
}

/**
 * Event handler for butDialogAdd, adds the selected location to the list.
 */
function addLocation() {
  // Hide the dialog
  toggleAddDialog();
  // Get the selected city
  const select = document.getElementById('selectCityToAdd');
  const selected = select.options[select.selectedIndex];
  const geo = selected.value;
  const label = selected.textContent;
  const location = {label: label, geo: geo};
  // Create a new card & get the weather data from the server
  // const card = getForecastCard(location);
  // getForecastFromNetwork(geo).then((forecast) => {
  //   renderForecast(card, forecast);
  // });
  // Save the updated list of selected cities.
  weatherApp.selectedLocations[geo] = location;
  saveLocationList(weatherApp.selectedLocations);
}

/**
 * Event handler for .remove-city, removes a location from the list.
 *
 * @param {Event} evt
 */
function removeLocation(evt) {
  const parent = evt.srcElement.parentElement;
  parent.setAttribute('hidden', true);
  if (weatherApp.selectedLocations[parent.id]) {
    delete weatherApp.selectedLocations[parent.id];
    saveLocationList(weatherApp.selectedLocations);
  }
}

/**
 * Get's the latest forecast data from the network.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromNetwork(coords) {
  return fetch(`/forecast/${coords}`)
      .then((response) => {
        return response.json();
      })
      .catch(() => {
        return null;
      });
}

/**
 * Get's the cached forecast data from the caches object.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromCache(coords) {
  // CODELAB: Add code to get weather forecast from the caches object.
  if (!('caches' in window)) {
  return null;
}
const url = `${window.location.origin}/forecast/${coords}`;
return caches.match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch((err) => {
      console.error('Error getting data from cache', err);
      return null;
    });

}

/**
 * Get's the HTML element for the weather forecast, or clones the template
 * and adds it to the DOM if we're adding a new item.
 *
 * @param {Object} location Location object
 * @return {Element} The element for the weather forecast.
 */
function getForecastCard(location) {
  const id = location.geo;
  const card = document.getElementById(id);
  if (card) {
    return card;
  }
  const newCard = document.getElementById('weather-template').cloneNode(true);
  newCard.querySelector('.location').textContent = location.label;
  newCard.setAttribute('id', id);
  newCard.querySelector('.remove-city')
      .addEventListener('click', removeLocation);
  document.querySelector('main').appendChild(newCard);
  newCard.removeAttribute('hidden');
  return newCard;
}

/**
 * Saves the list of locations.
 *
 * @param {Object} locations The list of locations to save.
 */
function saveLocationList(locations) {
  const data = JSON.stringify(locations);
  localStorage.setItem('locationList', data);
}

/**
 * Loads the list of saved location.
 *
 * @return {Array}
 */
function loadLocationList() {
  let locations = localStorage.getItem('locationList');
  if (locations) {
    try {
      locations = JSON.parse(locations);
    } catch (ex) {
      locations = {};
    }
  }
  if (!locations || Object.keys(locations).length === 0) {
    const key = '40.7720232,-73.9732319';
    locations = {};
    locations[key] = {label: 'New York City', geo: '40.7720232,-73.9732319'};
  }
  return locations;
}

/**
 * Initialize the app, gets the list of locations from local storage, then
 * renders the initial data.
 */
function init() {
  // Get the location list, and update the UI.
  weatherApp.selectedLocations = loadLocationList();
  // updateData();

  // Set up the event handlers for all of the buttons.
  // document.getElementById('butRefresh').addEventListener('click', updateData);
  // document.getElementById('butAdd').addEventListener('click', toggleAddDialog);
  // document.getElementById('butDialogCancel')
      // .addEventListener('click', toggleAddDialog);
  // document.getElementById('butDialogAdd')
      // .addEventListener('click', addLocation);
}

init();


//Starting the waterbodies

function showInfo(event){
  let feature = event.feature
  let name = feature.getProperty('Name')
  let zone = feature.getProperty('Zone')
  let ward = feature.getProperty('Ward')
  let owned_by = feature.getProperty('Owned_By')
  let adopted_by = feature.getProperty('Adopted_Being_Restored_by')
  let area = feature.getProperty('Area__in_acres_')
  let cost = 'To be esitmated'
  let status = adopted_by=="-" ? 'Yet to be adopted' : 'Adopted'
  let is_adopted = adopted_by=="-" ? false : true
  
  if (is_adopted==true){$('#adopt_button').hide()}else{$('#adopt_button').show()}
  $('#zone').text(zone)
  $('#name').text(name)
  $('#ward').text(ward)
  $('#owned_by').text(owned_by)
  $('#area').text(area)
  $('#cost').text(cost)
  $('#status').text(status)
  
  $('.zone').val(zone)
  $('.name').val(name)
  $('.ward').val(ward)
  
  $('#info_dailog').modal('show');
  $('#info').show();
  $('#form').hide();
  $('#otp_form').hide();
  $('#submit_button').hide();
  $("#submit_button").prop('disabled', false);
  $("#submit_button").html('Submit');
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function send_otp(event) {
  event.preventDefault(); //prevent default action
  var post_url = 'https://f9tgzl0do5.execute-api.us-east-1.amazonaws.com/dev/api/sendOtp' //get form action url
  var request_method = 'POST'; //get form GET/POST method
  var form_data = getFormData($(this)); //Encode form elements for submission
  $("#submit_button").prop('disabled', true);
  $.ajax({
    url: post_url,
    type: request_method,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(form_data)
  }).done(function (response) {
    // $('#info_dailog').modal('hide');
    $("#submit_button").prop('disabled', false);
    $('#otp_form').show();
    $("#submit_button").html('Verify OTP');
  });
}


function send_mail(event) {
  event.preventDefault(); //prevent default action
  var post_url = 'https://f9tgzl0do5.execute-api.us-east-1.amazonaws.com/dev/api/sendMail' //get form action url
  var request_method = 'POST'; //get form GET/POST method
  var form_data = getFormData($(this)); //Encode form elements for submission
  $("#submit_button").prop('disabled', true);
  $.ajax({
    url: post_url,
    type: request_method,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(form_data)
  }).done(function (response) {
    if(response.statusCode==400 || response.statusCode=="400"){
      alert("Invalid OTP");
      $("#submit_button").prop('disabled', false);
      $('#otp').val("")
      return
    }
    $('#info_dailog').modal('hide');
    $("#submit_button").prop('disabled', false);
    $('#otp').val("")
    $('#otp_form').modal('hide');
    $("#submit_button").html('Submit');
  });
}

$("#adopt_form").submit(function(event){
  let phone = $('#personal_number').val();
  phone = phone.replace(/[^0-9]/g,'');
        if (phone.length != 10)
        {
            alert('Invalid Number !! Phone number must be 10 digits.');
            return false;
        }
  
  if($('#otp').val()=="") {
    send_otp.call(this, event);
  }else
  {
    send_mail.call(this, event);
  }

});

let user = JSON.parse(localStorage.getItem("user"))
$('#personal_email').val(user.user_email)
$('#personal_name').val(user.user_name)
$('#personal_number').val(user.user_phone_number)
