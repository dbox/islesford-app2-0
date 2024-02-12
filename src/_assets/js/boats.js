// boats.js

import myBoatData from '../../_data/boatData.yaml';

console.log(myBoatData);
function getCurrentSeason() {
    var currentDate = new Date();
    var currentMonthDay = formatDate(currentDate.getMonth() + 1, currentDate.getDate());
  
    for (const carrier of myBoatData) {
      for (const season of carrier.seasons) {
        const startMonthDay1 = season.startDate ? formatDate(season.startDate) : null;
        const endMonthDay1 = season.endDate ? formatDate(season.endDate) : null;
  
        const startMonthDay2 = season.startDate2 ? formatDate(season.startDate2) : null;
        const endMonthDay2 = season.endDate2 ? formatDate(season.endDate2) : null;
  
        if (
          (startMonthDay1 && endMonthDay1 && currentMonthDay >= startMonthDay1 && currentMonthDay <= endMonthDay1) ||
          (startMonthDay2 && endMonthDay2 && currentMonthDay >= startMonthDay2 && currentMonthDay <= endMonthDay2)
        ) {
          return season.season;
        }
      }
    }
  
    return "Unknown";
  }
  
  function formatDate(month, day) {
    const formattedMonth = month ? month.toString().padStart(2, '0') : '';
    const formattedDay = day ? day.toString().padStart(2, '0') : '';
    return formattedMonth + (formattedMonth && formattedDay ? '-' : '') + formattedDay;
  }

function initializeDropdowns() {
  var carrierSelect = document.getElementById("carrierSelect");
  var seasonSelect = document.getElementById("seasonSelect");

  // Clear previous options
  carrierSelect.innerHTML = '';
  seasonSelect.innerHTML = '';

  // Populate carrier options
  myBoatData.forEach(carrier => {
      var option = document.createElement("option");
      option.value = carrier.carrier;
      option.text = carrier.carrier;
      carrierSelect.add(option);
  });

  // Default to the first carrier
  var firstCarrier = myBoatData[0];
  if (firstCarrier) {
      populateSeasons(firstCarrier.carrier);  // Pass the carrier name to populateSeasons
      displayDepartures();  // Display departures for the default carrier and season
  }
}

function populateSeasons() {
  var carrierSelect = document.getElementById("carrierSelect");
  var seasonSelect = document.getElementById("seasonSelect");

  // Clear previous options
  seasonSelect.innerHTML = '';

  var selectedCarrier = carrierSelect.value;
  var selectedCarrierData = myBoatData.find(carrier => carrier.carrier === selectedCarrier);

  if (selectedCarrierData) {
      // Populate the seasons for the selected carrier
      selectedCarrierData.seasons.forEach(seasonData => {
          var option = document.createElement("option");
          option.value = seasonData.season;
          option.text = seasonData.season;
          seasonSelect.add(option);
      });

      // Default to the first season for the selected carrier
      var firstSeason = selectedCarrierData.seasons[0];
      if (firstSeason) {
          seasonSelect.value = firstSeason.season;
      }
  }

  // Update departures when changing carrier
  displayDepartures();
}

function displayDepartures() {
  var carrierSelect = document.getElementById("carrierSelect");
  var seasonSelect = document.getElementById("seasonSelect");
  var departuresContainer = document.getElementById("departuresContainer");
  var notesContainer = document.getElementById("notesContainer");
  var nextDepartureContainer = document.getElementById("nextDepartureContainer");  // New container for next departure

  departuresContainer.innerHTML = '';
  notesContainer.innerHTML = '';
  nextDepartureContainer.innerHTML = '';  // Clear previous next departure

  var selectedCarrier = carrierSelect.value;
  var selectedSeason = seasonSelect.value;

  var selectedCarrierData = myBoatData.find(carrier => carrier.carrier === selectedCarrier);

  if (selectedCarrierData) {
      var selectedSeasonData = selectedCarrierData.seasons.find(season => season.season === selectedSeason);

      if (selectedSeasonData) {
          // Display notes above departures
          if (selectedSeasonData.notes) {
              notesContainer.innerHTML = `<p><strong>Notes:</strong> ${selectedSeasonData.notes}</p>`;
          }

          // Display departures
          selectedSeasonData.departures.forEach(departure => {
              // Format times using native JavaScript Date
              var formattedTimes = departure.times.map(time => {
                  var [hours, minutes] = time.split(':');
                  var formattedHours = (hours % 12 || 12).toString(); // Convert to 12-hour format
                  var period = hours < 12 ? 'AM' : 'PM';
                  return `${formattedHours}:${minutes} ${period}`;
              });

              departuresContainer.innerHTML += `<p><strong>${departure.location}</strong>: ${formattedTimes.join(', ')}</p>`;
          });

          // Display next departure
          showNextDeparture(selectedSeasonData.departures);
      }
  }
}

function showNextDeparture(departures) {
  var currentTime = new Date();
  var nextDepartureTime = null;
  var nextDepartureLocation = null;  // New variable to store the location of the next departure

  // Find the next departure time and location
  departures.forEach(departure => {
      departure.times.forEach(time => {
          var [hours, minutes] = time.split(':');
          var departureTime = new Date();
          departureTime.setHours(parseInt(hours), parseInt(minutes), 0);

          if (departureTime > currentTime && (nextDepartureTime === null || departureTime < nextDepartureTime)) {
              nextDepartureTime = departureTime;
              nextDepartureLocation = departure.location;  // Store the location
          }
      });
  });

  // Display the time until the next departure and its location
  if (nextDepartureTime !== null) {
      var timeUntilDeparture = nextDepartureTime - currentTime;
      var minutesUntilDeparture = Math.floor(timeUntilDeparture / (1000 * 60));

      var timeUntilDepartureText = minutesUntilDeparture < 60
          ? `${nextDepartureLocation} leaves in ${minutesUntilDeparture} minutes`
          : `${nextDepartureLocation} leaves in ${Math.floor(minutesUntilDeparture / 60)} hours and ${minutesUntilDeparture % 60} minutes`;

      // Include the location in the display
      document.getElementById("nextDepartureContainer").innerHTML = `<p><strong>Next Departure:</strong> ${timeUntilDepartureText}</p>`;
  } else {
      // If no more departures for the day
      document.getElementById("nextDepartureContainer").innerHTML = `<p>No more departures for the day</p>`;
  }
}

export { initializeDropdowns, populateSeasons, displayDepartures, showNextDeparture, getCurrentSeason };