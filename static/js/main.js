import { showAlert } from './alert.js';

let latitude = 0;
let longitude = 0;
let temperature;
let precipitation;
let city;
let waterLevel;
let map;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Step 1: Get user location
        let position = await getUserLocation();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        // Step 2: Initialize the map
        initializeMap(latitude, longitude);

        // Step 3: Check if location has changed
        if (locationHasChanged(latitude, longitude)) {
            // Step 4: Fetch and process weather data
            let weatherData = await weatherApi(latitude, longitude);
            city = weatherData.city;
            temperature = weatherData.temperature;
            precipitation = weatherData.precipitation;

            // Step 5: Fetch estimated water level
            waterLevel = await mlApi(temperature, precipitation);
            saveData(latitude, longitude, city, temperature, precipitation, waterLevel); // Save data to local storage
            updateWaterLevelUI(waterLevel);
            handleWaterLevelResult(waterLevel);

        } else {
            loadStoredData(); // Load stored data if location has not changed
            console.log('Location has not changed. Using stored data.');
            updateWaterLevelUI(waterLevel);
            handleWaterLevelResult(waterLevel);
        }

        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        console.log(`City: ${city}`);
        console.log(`Temperature: ${temperature}°C`);
        console.log(`Precipitation: ${precipitation}`);
        console.log(`Estimated Water Level: ${waterLevel} feet`);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to get user location
async function getUserLocation() {
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    } else {
        throw new Error('Geolocation is not supported by this browser.');
    }
}

// Function to check if the location has changed
function locationHasChanged(latitude, longitude) {
    let storedLatitude = localStorage.getItem('latitude');
    let storedLongitude = localStorage.getItem('longitude');
    return !(storedLatitude === String(latitude) && storedLongitude === String(longitude));
}

// Function to fetch and process weather data
async function weatherApi(latitude, longitude) {
    // Fetch weather data using OpenWeatherMap API
    let apiKey = '3f562d5d8bc260bae53c903ac8242f5e';
    let openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    let weatherResponse = await fetch(openWeatherUrl);
    let weatherData = await weatherResponse.json();

    // Process the weather data
    let temperature = weatherData.main.temp; // Extract temperature
    let precipitation = typeof weatherData.weather[0].description !== 'number' ? 1 : weatherData.weather[0].description;
    let city = weatherData.name;

    return { city, temperature, precipitation };
}

// Function to save weather data to local storage
function saveData(latitude, longitude, city, temperature, precipitation, waterLevel) {
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('city', city);
    localStorage.setItem('temperature', temperature);
    localStorage.setItem('precipitation', precipitation);
    localStorage.setItem('waterLevel', waterLevel ? waterLevel : 'undefined');
}

// Function to load stored data
function loadStoredData() {
    latitude = localStorage.getItem('latitude');
    longitude = localStorage.getItem('longitude');
    city = localStorage.getItem('city');
    temperature = localStorage.getItem('temperature');
    precipitation = localStorage.getItem('precipitation');
    waterLevel = localStorage.getItem('waterLevel');
}

// Function to fetch estimated water level
async function mlApi(temperature, precipitation, month) {
    month = month !== undefined ? month : new Date().getMonth() + 1;
    let mlApiUrl = `https://dpuvicorn-main-app-host-0-0-0-0-port-port.onrender.com/predict/?temperature=${temperature}&precipitation=${precipitation}&month=${month}`;
    let mlResponse = await fetch(mlApiUrl);
    let mlData = await mlResponse.json();
    return mlData && mlData.prediction !== undefined ? parseFloat(mlData.prediction).toFixed(2) : null;
}


// Function to initialize the map
function initializeMap(latitude, longitude) {
    map = L.map('map').setView([latitude, longitude], 15); // User's coordinates
    map.zoomControl.setPosition('bottomright');
    console.log(`Map centered at Latitude: ${latitude}, Longitude: ${longitude}`);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '© Bhujal'
    }).addTo(map);

    let borewellIcon1 = L.icon({
        iconUrl: window.STATIC_URLS.iconUrl1,
        shadowUrl: window.STATIC_URLS.shadowUrl1,
        iconSize: [38, 45],
        shadowSize: [65, 45],
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [26, 65],  // the same for the shadow
        popupAnchor: [0, -90] // point from which the popup should open relative to the iconAnchor
    });

    let borewellIcon2 = L.icon({
        iconUrl: window.STATIC_URLS.iconUrl2,
        shadowUrl: window.STATIC_URLS.shadowUrl2,
        iconSize: [38, 45],
        shadowSize: [65, 45],
        iconAnchor: [22, 94],
        shadowAnchor: [26, 65],
        popupAnchor: [0, -90],
    });

    L.control.scale({ position: 'bottomleft' }).addTo(map);
    L.Control.geocoder().addTo(map);

    // Create a feature group for the edit functionality
    var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);

    // Initialize the Leaflet Draw control (but do not add it to the map yet)
    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            polyline: false,
            rectangle: false,
            circle: false,
            marker: {
                icon: borewellIcon2
            }
        },
        edit: {
            featureGroup: editableLayers, // Assign the editable layers
            edit: false,   // Disable the edit toolbar
            remove: false  // Disable the delete toolbar
        }
    });

    // Handling the event when a marker is created
    map.on(L.Draw.Event.CREATED, function (e) {
        var layer = e.layer;

        // Add the drawn layer to the editable feature group
        editableLayers.addLayer(layer);

        // Make the marker draggable
        layer.dragging.enable();


        // Get the initial latitude and longitude of the marker
        var latLng = layer.getLatLng();
        var lat = latLng.lat;
        var lng = latLng.lng;

        // Update the latitude and longitude fields
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;

        // Bind a popup with the coordinates
        layer.bindPopup("<b>Marker at:</b><br>Lat: " + lat + "<br>Lng: " + lng).openPopup();

        // Add an event listener for marker dragging
        layer.on('dragend', function (event) {
            // Get the updated position after dragging
            var updatedLatLng = event.target.getLatLng();
            var updatedLat = updatedLatLng.lat;
            var updatedLng = updatedLatLng.lng;

            // Update the input fields with new coordinates
            document.getElementById('latitude').value = updatedLat;
            document.getElementById('longitude').value = updatedLng;

            // Update the popup with new coordinates
            layer.setPopupContent("<b>Marker at:</b><br>Lat: " + updatedLat + "<br>Lng: " + updatedLng).openPopup();
        });

        map.removeControl(drawControl); // Disable the draw control
    });

    let latLongCounter = 0;
    // Event listener for the edit icon
    document.getElementById('edit-lat-lng').addEventListener('click', function () {
        latLongCounter++;
        if (latLongCounter % 2 != 0) {
            map.addControl(drawControl);  // Enable the draw control
        }
        else {
            map.removeControl(drawControl); // Disable the draw control
            editableLayers.clearLayers(); // Clear any existing layers to allow drawing a new marker
            document.getElementById('latitude').value = "";
            document.getElementById('longitude').value = "";
        }
    });

    // Fetch stored borewell data from the backend
    fetch('/api/get_borewells/')
        .then(response => response.json())
        .then(data => {
            console.log("Borewells data:", data.borewells);


            data.borewells.forEach(borewell => {
                let popupContent = `
                    <strong>Name:</strong> ${borewell.customer_name}<br>
                    <strong>Phone No.:</strong> ${borewell.customer_phone_number}
                `;
                L.marker([borewell.latitude, borewell.longitude], { icon: borewellIcon1 })
                    .addTo(map)
                    .bindPopup(popupContent);
            });
        })
        .catch(error => {
            console.error('Error fetching borewell data:', error);
        });
}

function addBorewellMarker(latitude, longitude, name, phone) {
    let borewellIcon1 = L.icon({
        iconUrl: window.STATIC_URLS.iconUrl1,
        shadowUrl: window.STATIC_URLS.shadowUrl1,
        iconSize: [38, 45],
        shadowSize: [65, 45],
        iconAnchor: [22, 94],
        shadowAnchor: [26, 65],
        popupAnchor: [0, -90]
    });
    let popupContent = `
                    <strong>Name:</strong> ${name}<br>
                    <strong>Phone No.:</strong> ${phone}
                `;
    L.marker([latitude, longitude], { icon: borewellIcon1 }).addTo(map).bindPopup(popupContent);
}

// Handle form submission 
document.getElementById('borewellform').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    fetch('/borewellRegister/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Add the new borewell marker to the map immediately
            showAlert('success', 'Changes saved successfully', 'Your borewell is registered');
            addBorewellMarker(data.borewell.latitude, data.borewell.longitude, data.borewell.name, data.borewell.phone_number);

        })
        .catch(error => console.error('Error:', error));
    document.getElementById('borewellform').reset();
});

function updateWaterLevelUI(waterLevel) {
    document.querySelectorAll('.water-level').forEach(element => {
        element.innerText = `${waterLevel} feet`;
    });
}




// Sample JSON data
const data = {
    "division": "Bilaspur",
    // "currentDepth": "75 ft.",
    "zoneType": "GREEN",
    "monthlyMaxDepth": [
        { "month": "JAN", "depth": "53 ft." },
        { "month": "FEB", "depth": "68 ft." },
        { "month": "MAR", "depth": "82 ft." },
        { "month": "APR", "depth": "91 ft." },
        { "month": "MAY", "depth": "82 ft." },
        { "month": "JUN", "depth": "85 ft." },
        { "month": "JUL", "depth": "84 ft." },
        { "month": "AUG", "depth": "65 ft." },
        { "month": "SEP", "depth": "59 ft." },
        { "month": "OCT", "depth": "42 ft." },
        { "month": "NOV", "depth": "39 ft." },
        { "month": "DEC", "depth": "40 ft." }
    ]
};

// Populate the data section
document.getElementById('division-name').textContent = data.division;
// document.getElementById('current-depth').textContent = data.currentDepth;
document.getElementById('zone-type').textContent = data.zoneType;

const monthlyDepthContainer = document.getElementById('monthly-depth-container');
data.monthlyMaxDepth.forEach(item => {
    const depthDiv = document.createElement('div');
    depthDiv.classList.add('flex-none', 'w-32', 'p-4', 'bg-gray-100', 'rounded-lg', 'shadow');
    depthDiv.innerHTML = `
    <p class="text-lg font-semibold">${item.depth}</p>
    <p class="text-sm text-gray-600">${item.month}</p>
    `;
    monthlyDepthContainer.appendChild(depthDiv);
});

// Setup the chart
var ctx = document.getElementById('myLineChart').getContext('2d');
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.monthlyMaxDepth.map(item => item.month),
        datasets: [{
            label: 'Ground Water Graph',
            data: data.monthlyMaxDepth.map(item => parseFloat(item.depth)),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.5
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


let mainWrapper = document.getElementById('main-wrapper');
let btnNewBorewell = document.getElementById('btn-new-borewell');
let btnBorewell = document.getElementById('btn-borewell');
let btnCollaborate = document.getElementById('btn-collaborate');

let borewellScreen = document.getElementById('step-3-borewell');
let newBorewellScreen = document.getElementById('step-3-new-borewell');
let collaborateScreen = document.getElementById('step-3-collaborate');

function showScreen(screenToShow) {
    let screens = [borewellScreen, newBorewellScreen, collaborateScreen];
    screens.forEach(screen => {
        if (screen === screenToShow) {
            screen.classList.remove('hidden');
        } else {
            screen.classList.add('hidden');
        }
        setTimeout(() => {
            mainWrapper.scrollBy({
                left: mainWrapper.offsetWidth,
                behavior: 'smooth'
            });
        }, 10);
    });
}

// btnNewBorewell.addEventListener('click', showScreen.bind(null, newBorewellScreen));
// btnBorewell.addEventListener('click', showScreen.bind(null, borewellScreen));
// btnCollaborate.addEventListener('click', showScreen.bind(null, collaborateScreen));

btnNewBorewell.addEventListener('click', function () {
    showScreen(newBorewellScreen);
});

btnBorewell.addEventListener('click', function () {
    showScreen(borewellScreen);
});

btnCollaborate.addEventListener('click', function () {
    const userLocation = [latitude, longitude]; // Assume these are defined globally or pass them accordingly

    fetch('/api/get_borewell_owners/')
        .then(response => response.json())
        .then(data => {
            console.log("Borewell owners data:", data);

            // Filter borewell owners within 300m
            const filteredOwners = data.filter(owner => {
                const ownerLocation = [owner.latitude, owner.longitude];
                const distance = L.latLng(userLocation).distanceTo(L.latLng(ownerLocation));
                console.log("Owner name: " + owner.name + " Distance: " + distance)
                return distance <= 300; // 300 meters
            });
            console.log(filteredOwners)
            const createOwnerHTML = ({ name, address, phone, email, distance }) => `
                <div class="flex flex-row items-start justify-center gap-5 border rounded-lg w-full mb-2 p-2 py-4 bg-white shadow cursor-pointer">
                    <div>
                        <p class="font-display mb-1 text-md font-semibold text-black">${name}</p>
                        <p class="mb-2 text-sm text-gray-400">${address}</p>
                        <div class="flex gap-2">
                            <a href="#" target="_blank" rel="noopener noreferrer">📞 ${phone}</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">📧 ${email}</a>
                        </div>
                    </div>
                    <div>
                        <p class="font-display mb-1 text-sm font-medium text-gray-400">${distance}</p>
                    </div>
                </div>
            `;

            const containers = document.querySelectorAll('.borewell-owners-container');
            containers.forEach(container => {
                container.innerHTML = filteredOwners.map(owner => {
                    // Calculate distance to display in HTML
                    const ownerLocation = [owner.latitude, owner.longitude];
                    const distance = L.latLng(userLocation).distanceTo(L.latLng(ownerLocation));
                    return createOwnerHTML({ ...owner, distance: `${Math.round(distance)}m` });
                }).join('');
            });

            showScreen(collaborateScreen);
        })
        .catch(error => {
            console.error('Error fetching borewell owners data:', error);
        });
});


document.querySelectorAll('.btn-back').forEach(button => {
    button.addEventListener('click', () => {
        mainWrapper.scrollBy({
            left: -mainWrapper.offsetWidth,
            behavior: 'smooth'
        });
    });
});


document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
        let accordionItem = button.parentElement;
        let content = accordionItem.querySelector('.accordion-content');

        // Close all open accordions
        document.querySelectorAll('.accordion-content.show').forEach(openContent => {
            if (openContent !== content) {
                openContent.classList.remove('show');
            }
        });

        // Toggle the clicked accordion
        content.classList.toggle('show');
    });
});

document.querySelectorAll('.advanced-button').forEach(button => {
    button.addEventListener('click', () => {
        button.nextElementSibling.classList.toggle('show');
    });
});

// Toggle location popup visibility
document.querySelector('.location-button').addEventListener('click', function () {
    document.querySelector('.location-popup').classList.remove('hidden');
});

document.querySelectorAll('.close-popup').forEach((element) => {
    element.addEventListener('click', function () {
        document.querySelector('.location-popup').classList.add('hidden');
    });
});

// State and district data (example data)
const districtData = {
    'KA': ['Bangalore', 'Mysore', 'Mangalore'],
    'MH': ['Mumbai', 'Pune', 'Nagpur'],
    'TN': ['Chennai', 'Coimbatore', 'Madurai']
};

// Populate district dropdown based on selected state
document.querySelector('.state-dropdown').addEventListener('change', function () {
    const state = this.value;
    const districtDropdown = document.querySelector('.district-dropdown');
    districtDropdown.innerHTML = '<option value="">Select District</option>';
    if (state && districtData[state]) {
        districtData[state].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtDropdown.appendChild(option);
        });
    }
});

// Initialize map
const map2 = L.map('map2').setView([20.5937, 78.9629], 6); // Centered on India

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; Bhujal'
}).addTo(map2);

// Update map and location button based on selected district
document.querySelector('.district-dropdown').addEventListener('change', function () {
    const district = this.value;
    const state = document.querySelector('.state-dropdown').selectedOptions[0].textContent;

    if (district) {
        // Placeholder coordinates for districts (you need actual coordinates)
        const districtCoordinates = {
            'Bangalore': [12.9716, 77.5946],
            'Mysore': [12.2958, 76.6394],
            'Mangalore': [12.9141, 74.8560],
            'Mumbai': [19.0760, 72.8777],
            'Pune': [18.5204, 73.8567],
            'Nagpur': [21.1458, 79.0882],
            'Chennai': [13.0827, 80.2707],
            'Coimbatore': [11.0168, 76.9558],
            'Madurai': [9.9252, 78.1198]
        };

        const coordinates = districtCoordinates[district];
        if (coordinates) {
            map2.setView(coordinates, 10); // Zoom to the district
        }

        // Update the location button content
        const locationButton = document.querySelector('.location-button p:first-child');
        locationButton.textContent = `${district}, ${state}`;
    }
});





document.querySelectorAll('.estimate-button').forEach(button => {
    button.addEventListener('click', () => {
        let estimateDisplay = button.parentElement.nextElementSibling;
        estimateDisplay.classList.remove('hidden');
        let temperatureInput = document.querySelector(".temperature-input").value;
        let precipitationInput = document.querySelector(".precipitation-input").value;
        let monthInput = document.querySelector(".month-dropdown").value;

        mlApi(temperatureInput, precipitationInput, monthInput).then(waterLevel => {
            estimateDisplay.querySelector('span').innerText = `${waterLevel} feet`;
            handleWaterLevelResult(waterLevel);
        });
    });
});

// Default water level logic
let optimalRange = document.getElementById('optimal-range');
let nonOptimalRange = document.getElementById('non-optimal-range');

let proceedResistivity = document.querySelector('.proceed-resistivity');
let resistivityForm = document.querySelector('.resistivity-form');

let collaborate = document.querySelector('.collaborate');
let collaborateForm = document.querySelector('.collaborate-form');
let continueAnyway = document.querySelector('.continue-anyway');
let resistivityForm2 = document.querySelector('.resistivity-form2');


function handleWaterLevelResult(waterLevel) {
    if (!optimalRange.classList.contains('hidden')) optimalRange.classList.add('hidden');
    if (!nonOptimalRange.classList.contains('hidden')) nonOptimalRange.classList.add('hidden');

    if (waterLevel <= 10) { // Optimal Range Condition
        optimalRange.classList.remove('hidden');

        proceedResistivity.addEventListener('click', () => {
            resistivityForm.classList.toggle('show');
        });
    } else { // Non-Optimal Range Condition
        nonOptimalRange.classList.remove('hidden');

        collaborate.addEventListener('click', () => {
            collaborateForm.classList.toggle('show');
            resistivityForm2.classList.remove('show');
        });

        continueAnyway.addEventListener('click', () => {
            resistivityForm2.classList.toggle('show');
            collaborateForm.classList.remove('show');
        });

    }
}


document.getElementById('well-type').addEventListener('change', function () {
    var dugWellOptions = document.getElementById('dug-well-options');
    var drilledWellOptions = document.getElementById('drilled-well-options');
    if (this.value === 'dug-well') {
        dugWellOptions.classList.remove('hidden');
        drilledWellOptions.classList.add('hidden');
    } else if (this.value === 'drilled-well') {
        drilledWellOptions.classList.remove('hidden');
        dugWellOptions.classList.add('hidden');
    } else {
        dugWellOptions.classList.add('hidden');
        drilledWellOptions.classList.add('hidden');
    }
});




document.getElementById('share-borewell-to-earn').addEventListener('click', function (e) {
    e.preventDefault();
    showAlert('success', 'Changes saved successfully', 'Your recent changes have been saved.');
});

document.getElementById('set-critical-level-alert').addEventListener('click', function (e) {
    e.preventDefault();
    showAlert('success', 'Changes saved successfully', 'Your recent changes have been saved.');
});



document.getElementById('btn-refresh').addEventListener('click', function () {
    let button = this;

    button.classList.add('animate-spin', 'bg-opacity-70', 'pointer-events-none');

    setTimeout(function () {
        button.classList.remove('animate-spin', 'bg-opacity-70', 'pointer-events-none');
    }, 3000);
});
