function renderHotels(hotels) {
    const hotelList = document.getElementById('hotelList');
    hotelList.innerHTML = ''; // Clear previous content

    hotels.forEach(hotel => {
        const row = document.createElement('tr');
        const cellName = row.insertCell(0);
        const cellStreet = row.insertCell(1);
        const cellCity = row.insertCell(2);
        const cellZip = row.insertCell(3);
        const cellCountry = row.insertCell(4);
        const cellRoomAmount = row.insertCell(5);
        const cellAction = row.insertCell(6); // Add a new cell for the buttons

        cellName.textContent = hotel.name;
        cellStreet.textContent = hotel.street;
        cellCity.textContent = hotel.city;
        cellZip.textContent = hotel.zip;
        cellCountry.textContent = hotel.country;
        cellRoomAmount.textContent = hotel.roomAmount;

        // Create an "Update" button for each row
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', function() {
            // Redirect to the update page with the hotel ID
            window.location.href = `updateHotel.html?id=${hotel.id}`;
        });

        // Create a "Delete" button for each row
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button'); // Add a class for event delegation
        deleteButton.dataset.hotelId = hotel.id;

        // Append event listener for the delete button
        deleteButton.addEventListener('click', function() {
            // Delete the hotel when the delete button is clicked
            const hotelId = this.dataset.hotelId;
            deleteHotel(hotelId);
        });

        // Append buttons to the action cell
        cellAction.appendChild(updateButton);
        cellAction.appendChild(deleteButton);

        // Append the row to the table body
        hotelList.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener for the delete buttons
    document.getElementById('hotelList').addEventListener('click', function (event) {
        const targetButton = event.target;

        if (targetButton.classList.contains('delete-button')) {
            // Delete the hotel when a delete button is clicked
            const hotelId = targetButton.dataset.hotelId;
            deleteHotel(hotelId);
        }
    });
});


// get all hotels
function fetchHotels() {
    fetch('http://localhost:8080/hotels')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            renderHotels(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// render hotels
fetchHotels();

// Create a new hotel
function createHotel() {
    const name = document.getElementById('hotel-name').value;
    const street = document.getElementById('hotel-street').value;
    const city = document.getElementById('hotel-city').value;
    const zip = document.getElementById('hotel-zip').value;
    const country = document.getElementById('hotel-country').value;
    const roomAmount = document.getElementById('room-amount').value;

    const hotelRequest = {
        name: name,
        street: street,
        city: city,
        zip: zip,
        country: country,
        roomAmount: roomAmount,
    };

    fetch('http://localhost:8080/hotel', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(hotelRequest),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // render all hotels
            fetchHotels();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// find product by name
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('searchHotel');

    fetch('http://localhost:8080/hotels')
        .then(response => response.json())
        .then(hotels => {
            // Initial rendering of all hotels
            renderHotels(hotels);

            // Add event listener for input change
            searchInput.addEventListener('input', function () {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredHotels = hotels.filter(hotel =>
                    hotel.name.toLowerCase().includes(searchTerm)
                );
                // Render filtered products
                renderHotels(filteredHotels);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

// updateHotel.js
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');

    // Fetch hotel data using the hotelId and populate the update form
    fetch(`http://localhost:8080/hotel/${hotelId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(hotel => {
            document.getElementById('update-hotel-id').value = hotel.id;
            document.getElementById('update-hotel-name').value = hotel.name;
            document.getElementById('update-hotel-street').value = hotel.street;
            document.getElementById('update-hotel-city').value = hotel.city;
            document.getElementById('update-hotel-zip').value = hotel.zip;
            document.getElementById('update-hotel-country').value = hotel.country;
            document.getElementById('update-room-amount').value = hotel.roomAmount;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});



function performUpdate() {
    const id = document.getElementById('update-hotel-id').value;
    const name = document.getElementById('update-hotel-name').value;
    const street = document.getElementById('update-hotel-street').value;
    const city = document.getElementById('update-hotel-city').value;
    const zip = document.getElementById('update-hotel-zip').value;
    const country = document.getElementById('update-hotel-country').value;
    const roomAmount = document.getElementById('update-room-amount').value;

    // Update hotel
    fetch(`http://localhost:8080/hotel/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            street: street,
            city: city,
            zip: zip,
            country: country,
            roomAmount: roomAmount,
        }),
    })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response status text:', response.statusText);

            // Check if the content type is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                // If not JSON, return the response text
                return response.text();
            }
        })
        .then(responseData => {
            if (typeof responseData === 'object') {
                // If it's a JSON object, handle it as before
                console.log('Updated hotel:', responseData);
                handleUpdateLocalData(responseData);
                handleUpdateUI(responseData);
            } else {
                // If it's not a JSON object, handle the text response accordingly
                console.log('Text response:', responseData);
                // Handle the text response as needed
            }

            // Go back to the previous page
            window.location.href = document.referrer; // Automatically go back

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


