let zipCode = '';
let zoneId = '';
let favorite1 = '';
let favorite2 = '';
let favorite3 = '';
let favorite4 = '';
let favorite5 = '';

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

	function getZoneId() {
		const url = 'https://plant-hardiness-zone.p.rapidapi.com/zipcodes/' + zipCode;
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '54396a694cmshf03550fa50210dbp190d85jsn85ec9ece51f3',
				'X-RapidAPI-Host': 'plant-hardiness-zone.p.rapidapi.com'
			}
		};
	
		try {
			const response = await fetch(url, options);
			const result = await response.text();
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	}

	function setLocalStorageLocation(zipCode, zoneId) {
		localStorage.setItem("zipCode", zipCode);
		localStorage.setItem("zoneId", zoneId);
	}

	function getLocalStorageLocation() {
		zipCode = localStorage.getItem("zipCode");
		zoneId = localStorage.getItem("zoneId");
	}

	function setLocalStorageFavorites() {
		localStorage.setItem("favorite1", []);
	}

	function getLocalStorageFavorites() {
		favorite1 = localStorage.getItem("favorite1");
		favorite2 = localStorage.getItem("favorite2");
		favorite3 = localStorage.getItem("favorite3");
		favorite4 = localStorage.getItem("favorite4");
		favorite5 = localStorage.getItem("favorite5");
	}

	function getPlants() {
		fetch('https://perenual.com/api/species-list?key=sk-2rfU6564bcc049f6a3151&edible=1&hardiness=' + zoneId)
			.then(function(response) {
				return response.json()
			})
			.then(function(data) {
				for (let i = 0; i < 10; i++) {
					console.log(data[i]);
				}
			})

		

	}