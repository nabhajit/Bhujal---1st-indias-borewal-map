//Translate functionality
// function googleTranslateElementInit() {
//     new google.translate.TranslateElement({
//         pageLanguage: 'de', includedLanguages: 'en,it,fr,ru,tr', autoDisplay: false,
//         layout: google.translate.TranslateElement.InlineLayout.SIMPLE
//     }, 'google_translate_element');
// }

// Scrollable div functionality
// let rightScoll = document.querySelector('#right-scroll');
// let leftScoll = document.querySelector('#left-scroll');
// let scrollableDiv = document.getElementById('scrollableDiv');
// let scrollTo = scrollableDiv.clientWidth;

// rightScoll.addEventListener('click', () => scrollableDiv.scrollLeft += scrollTo);
// leftScoll.addEventListener('click', () => scrollableDiv.scrollLeft -= scrollTo);

// Modal functionality
let currentImageIndex = 0;
let images = document.querySelectorAll('.gallery-imgs img');
let modal = document.getElementById('imageModal');
let modalImage = document.getElementById('modalImage');
let slideNumber = document.getElementById('slideNumber');

console.log(images);

function openModal(element) {
    console.log("element", element);
    currentImageIndex = Array.from(images).indexOf(element.querySelector('img'));
    showImage();
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

function showImage() {
    modalImage.src = images[currentImageIndex].src;
    slideNumber.textContent = `${currentImageIndex + 1} of ${images.length}`;
}

function previousImage() {
    currentImageIndex = (currentImageIndex === 0) ? images.length - 1 : currentImageIndex - 1;
    showImage();
}

function nextImage() {
    currentImageIndex = (currentImageIndex === images.length - 1) ? 0 : currentImageIndex + 1;
    showImage();
}

document.addEventListener('keydown', function (event) {
    if (!modal.classList.contains('hidden')) {
        if (event.key === 'ArrowLeft') {
            previousImage();
        } else if (event.key === 'ArrowRight') {
            nextImage();
        } else if (event.key === 'Escape') {
            closeModal();
        }
    }
});


//Chatbot functionality
const chatbox = document.getElementById("chatbox");
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const openChatButton = document.getElementById("open-chat");
const closeChatButton = document.getElementById("close-chat");

let isChatboxOpen = false; // Set the initial state to closed

// Function to toggle the chatbox visibility
function toggleChatbox() {
    chatContainer.classList.toggle("hidden");
    isChatboxOpen = !isChatboxOpen; // Toggle the state
    // if (isChatboxOpen) {
    //     addBotMessage("Hi I am Bhumi, how can I help you today?");
    // }
}

// Add an event listener to the open chat button
openChatButton.addEventListener("click", toggleChatbox);

// Add an event listener to the close chat button
closeChatButton.addEventListener("click", toggleChatbox);

// Add an event listener to the send button
sendButton.addEventListener("click", function () {
    const userMessage = userInput.value;
    if (userMessage.trim() !== "") {
        addUserMessage(userMessage);
        addThinkingMessage();
        respondToUser(userMessage);
        userInput.value = "";
    }
});

userInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        const userMessage = userInput.value;
        if (userMessage.trim() !== "") {
            addUserMessage(userMessage);
            addThinkingMessage();
            respondToUser(userMessage);
            userInput.value = "";
        }
    }
});

function addUserMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("mb-2", "text-right");
    messageElement.innerHTML = `<p class="bg-blue-500 text-white rounded-2xl rounded-br-none py-2 px-4 inline-block">${message}</p>`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function addBotMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("mb-2");
    messageElement.innerHTML = `<p class="bg-gray-200 text-gray-700 rounded-2xl rounded-tl-none py-2 px-4 inline-block">${message}</p>`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function addThinkingMessage() {
    const thinkingElement = document.createElement("div");
    thinkingElement.classList.add("mb-2", "thinking");
    thinkingElement.innerHTML = `<p class="bg-gray-200 text-gray-700 rounded-2xl rounded-tl-none py-2 px-4 inline-block">...</p>`;
    chatbox.appendChild(thinkingElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function removeThinkingMessage() {
    const thinkingElement = chatbox.querySelector(".thinking");
    if (thinkingElement) {
        chatbox.removeChild(thinkingElement);
    }
}

async function respondToUser(userMessage) {
    const apiKey = 'AIzaSyCXz0gGSXdEPAupdFvti-w-Ay4bDwXIRnc'; // Replace with your actual API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const requestBody = JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });

        const data = await response.json();

        removeThinkingMessage();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const botMessage = data.candidates[0].content.parts[0].text;
            addBotMessage(botMessage);
        } else {
            console.error('Unexpected API response:', data);
            addBotMessage("Sorry, there was an error processing your request.");
        }
    } catch (error) {
        console.error('Error:', error);
        removeThinkingMessage();
        addBotMessage("Sorry, there was an error processing your request.");
    }
}


const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => navLinks.classList.toggle('max-h-[1000px]'));


window.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById('preloader').classList.add('opacity-30', '-translate-y-full');
    }, 2000);
});

let containers = document.querySelectorAll(".logo-cloud");
let isScrolling;

containers.forEach(container => {
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2; // Center the scroll for each container
    container.addEventListener('scrollend', snapBackToCenter);
    container.addEventListener('touchend', snapBackToCenter);
});

function snapBackToCenter(event) {
    let container = event.currentTarget;
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        container.scrollTo({
            left: (container.scrollWidth - container.clientWidth) / 2,
            behavior: 'smooth'
        });
    }, 100);
}

AOS.init({
    duration: 1200,
});