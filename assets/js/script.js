const zipCodeEl = document.getElementById('zip-code');
const zoneIdEl = document.getElementById('zone-id');
const cardContainerEl = document.getElementById('card-container');

//TODO: Remove defaults before go-live
var zipCode = '80525';
var zoneId = 5;

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
			// Main 'card' div
			let cardDiv = document.createElement('div');
			cardDiv.className = 'card';
			cardDiv.dataset.Id = data.data[i].id;

			// Plant image div
			let plantImageDiv = document.createElement('div');
			plantImageDiv.className = 'plant-image';

			// Figure element
			let figureEl = document.createElement('figure');
			figureEl.className = 'image is-4by3';

			// Image element
			let plantImage = document.createElement('img');
			if (data.data[i].default_image == null) {
				plantImage.src = '#';
				plantImage.alt = 'No image available';
			} else {
				plantImage.src = data.data[i].default_image.small_url;
				plantImage.alt = 'Image of ' + data.data[i].common_name;
			}

			//Append to 'plant-image' div
			figureEl.appendChild(plantImage);
			plantImageDiv.appendChild(figureEl);

			// 'card content' div
			let cardContentDiv = document.createElement('div');
			cardContentDiv.className = 'card-content';

			// Plant data p's
			let plantCommonName = document.createElement('p');
			plantCommonName.className = 'plantCommonName is-4';
			plantCommonName.textContent = data.data[i].common_name.toUpperCase();

			let plantScientificName = document.createElement('p');
			plantScientificName.className = 'plantScientificName is-6';
			plantScientificName.textContent = '(' + data.data[i].scientific_name + ')';

			let plantCycle = document.createElement('p');
			plantCycle.className = 'plantCycle is-6';
			plantCycle.textContent = 'Cycle: ' + data.data[i].cycle;

			let plantSunlight = document.createElement('p');
			plantSunlight.className = 'plantSunlight is-6';
			plantSunlight.textContent = 'Sunlight: ' + data.data[i].sunlight;

			let plantWatering = document.createElement('p');
			plantWatering.className = 'plantWatering is-6';
			plantWatering.textContent = 'Water: ' + data.data[i].watering;

			// Append p's to card content div
			cardContentDiv.appendChild(plantCommonName);
			cardContentDiv.appendChild(plantScientificName);
			cardContentDiv.appendChild(plantCycle);
			cardContentDiv.appendChild(plantSunlight);
			cardContentDiv.appendChild(plantWatering);

			// Append to main card div
			cardDiv.appendChild(plantImageDiv);
			cardDiv.appendChild(cardContentDiv);

			// Append main card div to card-container
			cardContainerEl.appendChild(cardDiv);
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