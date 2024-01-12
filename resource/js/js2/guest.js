// create new guest

function createGuest() {
    const username = document.getElementById("guest-username").value;
    const firstName = document.getElementById("guest-firstName").value;
    const lastName = document.getElementById("guest-lastName").value;
    const email = document.getElementById("guest-email").value;
    const phoneNumber = document.getElementById("guest-phoneNumber").value;



    const guestRequest = {
        username: username,
        firstname: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber
    };

    fetch('http://localhost:8080/guest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guestRequest)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // re-render all products
            fetchHotels();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}