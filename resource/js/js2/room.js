// Fetch and render hotels for the dropdown
function fetchAndRenderHotels() {
    fetch('http://localhost:8080/hotels')
        .then(response => response.json())
        .then(hotels => {
            renderHotelsDropdown(hotels);
        })
        .catch(error => console.error('Error fetching and rendering hotels:', error));
}

// Render hotels in the dropdown
function renderHotelsDropdown(hotels) {
    const hotelDropdown = document.getElementById('hotel-dropdown');

    // Clear existing options
    hotelDropdown.innerHTML = '';

    // default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a hotel';
    hotelDropdown.appendChild(defaultOption);

    hotels.forEach(hotel => {
        const option = document.createElement('option');
        option.value = hotel.id;
        option.textContent = hotel.name;
        hotelDropdown.appendChild(option);
    });
}

// Call the fetchAndRenderHotels function to populate the dropdown initially
fetchAndRenderHotels();

// create Room
function createRoom() {
    const roomNumber = document.getElementById('room-roomNumber').value;
    const numberOfBeds = document.getElementById('room-numberOfBeds').value;
    const price = document.getElementById('room-price').value;
    const isAvailable = document.getElementById('room-isAvailable').checked ? 1 : 0;
    const hotel_id = document.getElementById('hotel-dropdown').value;

    const roomRequest = {
        roomNumber: roomNumber,
        numberOfBeds: numberOfBeds,
        price: price,
        isAvailable: isAvailable,
        hotel_id: hotel_id,
    };

    fetch('http://localhost:8080/room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomRequest),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Re-fetch the list of rooms
            fetchAndRenderRooms();  // You'll need to implement this function
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}