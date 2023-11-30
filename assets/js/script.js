const zipCodeEl = document.getElementById('zip-code');
const zoneIdEl = document.getElementById('zone-id');
const cardsContainerEl = document.querySelector('#cardsSection .columns');

var zipCode;
var zoneId;
var bypassAPIMode = true; //Bypasses Hardiness Zone API call

// *****Bulma*****
//Modal for Zone Map in Navbar
document.addEventListener('DOMContentLoaded', () => {
	// Get the modal and the button that opens the modal
	const modal = document.getElementById('modal-hardiness-zone');
	const btnOpenModal = document.getElementById('open-modal-hardiness-zone');
	// Open the modal when the button is clicked
	btnOpenModal.addEventListener('click', function() {
			modal.classList.add('is-active');
	});
	// Close the modal when the close button is clicked or when the background is clicked
	modal.querySelector('.modal-close').addEventListener('click', function() {
			modal.classList.remove('is-active');
	});
	modal.querySelector('.modal-background').addEventListener('click', function() {
			modal.classList.remove('is-active');
	});


// Modal for Zones Info
const modalWhyZonesMatter = document.getElementById('modal-why-zones-matter');
const btnOpenModalWhyZonesMatter = document.getElementById('open-modal-why-zones-matter');

btnOpenModalWhyZonesMatter.addEventListener('click', function() {
modalWhyZonesMatter.classList.add('is-active');
});

modalWhyZonesMatter.querySelector('.modal-close').addEventListener('click', function() {
modalWhyZonesMatter.classList.remove('is-active');
});
});
// *****End Bulma*****

function initializePage() {
	getLocalStorageLocation();
	setPageLocation();
};

// TODO: This was used for prototyping.  Delete once Aloys wires-up new button!
function oldButton() {
	zipCode = prompt('Enter Zip Code', 80525);
	getPlants();
};

function getPlants() {
	if (!zipCode) return;
	if (bypassAPIMode) {
			zoneId = '5';
			setLocalStorageLocation();
			setPageLocation();
			console.log("Calling Plant API");
			apiGetPlants();
	} else {
			console.log("Calling Hardiness Zone API");
			apiGetZoneId();
	}
};

async function apiGetZoneId() {
	await fetch('https://plant-hardiness-zone.p.rapidapi.com/zipcodes/' + zipCode, {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '54396a694cmshf03550fa50210dbp190d85jsn85ec9ece51f3',
			'X-RapidAPI-Host': 'plant-hardiness-zone.p.rapidapi.com'
		}
	})
	.then(function (response) {
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return response.json();
	})
	.then(function (data) {
		zoneId = data.hardiness_zone;
		setLocalStorageLocation();
		setPageLocation();
		apiGetPlants();
	})
	.catch(function (error) {
		console.error('Hardiness Zone API request error:', error);
		alert('An unexpected error was encountered trying to process your zone ID request.  Please try again.');
	});
}

function apiGetPlants() {
	fetch('https://perenual.com/api/species-list?key=sk-2rfU6564bcc049f6a3151&edible=1&edible=1&hardiness=' + zoneId)
	.then(function (response) {
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return response.json();
	})
	.then(function (data) {
		cardsContainerEl.innerHTML='';
		for (let i = 0; i < data.data.length; i++) {
			//Creating columns so the cards dont stack
			let columnDiv = document.createElement('div');
			columnDiv.className = 'column is-one-fifth';

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

			//Put cards in columns instead of stacking
			columnDiv.appendChild(cardDiv);

			// Append main card div to card-container
			cardsContainerEl.appendChild(columnDiv);
		}
})
	.catch(function (error) {
		console.error('Plant API request error:', error);
		alert('An unexpected error was encountered trying to process your plant listing.  Please try again.');
		return 0;
	});
}

function getLocalStorageLocation() {
	zipCode = localStorage.getItem("zipCode");
	if (!zipCode) {zipCode = 0}
	zoneId = localStorage.getItem("zoneId");
	if (!zoneId) {zoneId = 0}
}

function setPageLocation() {
	zipCodeEl.textContent = zipCode;
	zoneIdEl.textContent = zoneId;
}

function setLocalStorageLocation() {
	localStorage.setItem("zipCode", zipCode);
	if (typeof zoneId === 'string') {
		zoneId = removeLetters(zoneId);
	}
	localStorage.setItem("zoneId", zoneId);
}

// The Zone Id returned from the Plant Hardiness Zone API can include a letter.  The Perenual API only accepts an integer.
// This function removes letters from the string.
function removeLetters(zone) {
	return zone.replace(/[a-zA-Z]/g, '');
}

initializePage();
	
