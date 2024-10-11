let latitude = 0;
let longitude = 0;
let temperature;
let precipitation;
let city;
let waterLevel;

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
        } else {
            loadStoredData(); // Load stored data if location has not changed
            console.log('Location has not changed. Using stored data.');
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
async function mlApi(temperature, precipitation) {
    let month = new Date().getMonth() + 1; // Get the current month (0-based index, so add 1)
    let mlApiUrl = `https://dpuvicorn-main-app-host-0-0-0-0-port-port.onrender.com/predict/?temperature=${temperature}&precipitation=${precipitation}&month=${month}`;
    let mlResponse = await fetch(mlApiUrl);
    let mlData = await mlResponse.json();
    return mlData && mlData.prediction !== undefined ? parseFloat(mlData.prediction).toFixed(2) : null;
}

// Function to initialize the map
function initializeMap(latitude, longitude) {
    let map = L.map('map').setView([latitude, longitude], 15); // User's coordinates
    console.log(`Map centered at Latitude: ${latitude}, Longitude: ${longitude}`);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '© Bhujal'
    }).addTo(map);
}



let step1 = document.getElementById('step-1');

document.querySelector('#login-text').addEventListener('click', function () {
    step1.scrollBy({
        top: -step1.offsetHeight,
        behavior: 'smooth'
    });
});

document.querySelector('#sign-up-text').addEventListener('click', function () {
    step1.scrollBy({
        top: step1.offsetHeight,
        behavior: 'smooth'
    });
});

console.log("bINGO", waterLevel);

function showAlert(type, title, message) {
    console.log(`Showing ${type} alert: ${title} - ${message}`);
    // Reset classes
    alert.className = 'rounded-b shadow-md w-11/12 absolute top-0 left-1/2 -translate-x-1/2 z-10 transform -translate-y-full transition-all duration-500';
    progressBar.className = 'h-2 w-0 transition-all duration-[5000ms]';
    closeButton.className = 'text-2xl font-bold cursor-pointer';

    // Set content and styles based on the alert type
    switch (type) {
        case 'success':
            console.log("Success checkpoint");
            alert.classList.add('bg-teal-100', 'text-teal-900');
            progressBar.classList.add('bg-teal-500');
            alertIcon.className = 'stroke-2 stroke-current text-teal-500 h-8 w-8 mr-4 flex-shrink-0';
            alertIcon.innerHTML = '<circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" />';
            closeButton.classList.add('text-teal-500');
            break;
        case 'error':
            alert.classList.add('bg-red-100', 'text-red-900');
            progressBar.classList.add('bg-red-500');
            alertIcon.className = 'stroke-current text-red-500 h-8 w-8 mr-4 flex-shrink-0';
            alertIcon.innerHTML = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.83 0-1.5-.67-1.5-1.5S11.17 14 12 14s1.5.67 1.5 1.5S12.83 17 12 17zm1-4h-2V7h2v6z" />';
            closeButton.classList.add('text-red-500');
            break;
        case 'info':
            alert.classList.add('bg-blue-100', 'text-blue-900');
            progressBar.classList.add('bg-blue-500');
            alertIcon.className = 'fill-current h-8 w-8 text-blue-500 mr-4';
            alertIcon.innerHTML = '<path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />';
            closeButton.classList.add('text-blue-500');
            break;
        default:
            return; // Do nothing if type is not recognized
    }

    // Set title and message
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    // Slide down the alert
    setTimeout(() => {
        alert.classList.remove('-translate-y-full');
        alert.classList.add('translate-y-0');

        setTimeout(() => {
            progressBar.classList.remove('w-0');
            progressBar.classList.add('w-full');
        }, 100); // Small delay for smooth start

        // Slide back the alert after 5 seconds
        setTimeout(() => {
            alert.classList.remove('translate-y-0');
            alert.classList.add('-translate-y-full');
        }, 5000);
    }, 100);

    // Close button functionality
    closeButton.addEventListener('click', () => {
        alert.classList.remove('translate-y-0');
        alert.classList.add('-translate-y-full');
    });
}

showAlert('success', 'Changes saved successfully', 'Your recent changes have been saved.');