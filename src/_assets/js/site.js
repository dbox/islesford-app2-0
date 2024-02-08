
// site.js

import { initializeDropdowns, populateSeasons, displayDepartures, showNextDeparture } from './boats.js';

// Attach event listeners and initialize dropdowns after functions are defined
document.addEventListener("DOMContentLoaded", function () {
    initializeDropdowns();

    var carrierSelect = document.getElementById("carrierSelect");
    var seasonSelect = document.getElementById("seasonSelect");

    carrierSelect.addEventListener("change", function () {
        populateSeasons(carrierSelect.value);
    });

    seasonSelect.addEventListener("change", function () {
        displayDepartures();
    });
});