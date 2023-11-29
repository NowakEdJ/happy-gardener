const zipCodeEl = document.getElementById('zip-code');
const zoneIdEl = document.getElementById('zone-id');
const plantContainerEl = document.getElementById('plant-container');

var zipCode;
var zoneId;

// Bulma code below...
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        closeAllModals();
      }
    });
  });

	//*********Non-Bulma code below...

	function initializePage() {
		getLocalStorageLocation();
		setPageLocation();
	}

	// TODO: For testing only!  Get rid of this once wired-up to Bulma
	function bulmaFake() {
		//TODO: Add zip code validation
		zipCode = prompt('Enter Zip Code', 80525);
		zoneId = 5;

		/*
		TODO: KEEP THIS!  Uncomment before go-live!
		apiGetZoneId();
		*/

		//TODO: Delete 2 lines below before go-live!
		setLocalStorageLocation();
		setPageLocation();
	}

	function apiGetZoneId() {
		// TODO: Add error handling
		fetch('https://plant-hardiness-zone.p.rapidapi.com/zipcodes/' + zipCode, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '54396a694cmshf03550fa50210dbp190d85jsn85ec9ece51f3',
				'X-RapidAPI-Host': 'plant-hardiness-zone.p.rapidapi.com'
			}
		})
  	.then(function (response) {
    	return response.json();
  	})
  	.then(function (data) {
			zoneId = data.hardiness_zone;
			setLocalStorageLocation();
			setPageLocation();
  });
	}

	function apiGetPlants() {
		// TODO: Add error handling
		fetch('https://perenual.com/api/species-list?key=sk-2rfU6564bcc049f6a3151&edible=1&edible=1&hardiness=' + zoneId)
  	.then(function (response) {
    	return response.json();
  	})
  	.then(function (data) {
			for (let i = 0; i < data.data.length; i++) {
				let plantId = document.createElement('p');
      	let plantCommonName = document.createElement('h2');
        let plantScientificName = document.createElement('p');
				let plantCycle = document.createElement('p');
				let plantSunlight = document.createElement('p');
				let plantWatering = document.createElement('p');
				let plantImage = document.createElement('img');

				plantId.textContent = data.data[i].id;
				plantCommonName.textContent = data.data[i].common_name;
        plantScientificName.textContent = data.data[i].scientific_name;
        plantCycle.textContent = data.data[i].cycle;
				plantSunlight.textContent = data.data[i].sunlight;
				plantWatering.textContent = data.data[i].watering;
				if (data.data[i].default_image == null) {
					plantImage.src = '#';
				} else {
					plantImage.src = data.data[i].default_image.small_url;
				}
			
				plantContainerEl.append(plantId);
				plantContainerEl.append(plantCommonName);
				plantContainerEl.append(plantScientificName);
				plantContainerEl.append(plantCycle);
				plantContainerEl.append(plantSunlight);
				plantContainerEl.append(plantWatering);
				plantContainerEl.append(plantImage);
      }
  });
	}

	function setLocalStorageLocation() {
		localStorage.setItem("zipCode", zipCode);
		zoneId = removeLetters(zoneId);
		localStorage.setItem("zoneId", zoneId);
	}

	function getLocalStorageLocation() {
		zipCode = localStorage.getItem("zipCode");
		zoneId = localStorage.getItem("zoneId");
	}

	function setPageLocation() {
		zipCodeEl.textContent = zipCode;
		zoneIdEl.textContent = zoneId;
	}

	// The Zone Id returned from the Plant Hardiness Zone API can include a letter.  The Perenual API only accepts an integer.
	// This function removes letters from the string.
	function removeLetters(zone) {
		return zone.replace(/[a-zA-Z]/g, '');
	}

	initializePage();