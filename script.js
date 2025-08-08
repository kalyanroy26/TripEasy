// authentication and authorization
const url = "https://tripeasy-server.onrender.com"

let isLoggedIn = false
let booked_seats = [];

let login_error = document.getElementById('invalid_user')
let logged_user = document.getElementById('current_user')
let logged_user_sm = document.getElementById('current_user_sm')

// handle signup 
const signup = () => {
    login_error.innerText = "";
    login_error.style.display = 'none';

    let name = document.getElementById('name').value
    let passsword = document.getElementById('password').value
    let email = document.getElementById('email').value
    let mobile = document.getElementById('mobile').value

    let newUser = {
        "username": name,
        "password": passsword,
        "email": email,
        "mobile": mobile
    }
    console.log(newUser);
    addUser(newUser)
}

// save user into database
let addUser = async (data) => {
    try {
        let reg_users = await getAllUsers()
        let emailExists = reg_users.some(user => user.email === data.email)

        if (emailExists) {
            login_error.style.display = 'block'
            login_error.innerText = "email is already registered"
            return
        }
        const response = await axios.post(`${url}/register`, data)
        console.log(response.data)

        window.location.href = './pages/login.html'

    } catch (error) {
        console.log("error: ", error.message)
    }
}

// get all registered users from database
let getAllUsers = async () => {
    try {
        const response = await axios.get(`${url}/register`)
        const allUsers = await response.data
        return allUsers
    } catch (error) {
        console.log("error: ", error.message)
    }
}

// handle login 
let login = async () => {
    const alreadyLoggedIn = localStorage.getItem("current_user");

    if (alreadyLoggedIn) {
        alert("User already logged in");
        window.location.href = "../index.html";
        return;
    }

    login_error.innerText = "";
    login_error.style.display = 'none';

    let email = document.getElementById('user_email').value
    let password = document.getElementById('user_password').value
    let userFound = false
    try {
        const regUsers = await getAllUsers()

        for (const user of regUsers) {
            if (user.email === email && user.password === password) {
                userFound = true
                localStorage.setItem("current_user", JSON.stringify(user))
                break
            }
        }

        if (userFound) {
            alert("login Successfull")
            console.log(currentUser)
            isLoggedIn = true
            window.location.href = "../index.html";
        }
        else {
            login_error.style.display = 'block'
            login_error.innerHTML = "invalid credentials"
        }

    } catch (error) {
        console.log("error: ", error.message)
    }
}

// handle logout
let logout = () => {
    localStorage.removeItem("current_user")
    localStorage.removeItem('booked_bus_details')
    logged_user.innerText = "Hello Guest"
    logout_btn.style.display = 'none'
    logout_btn_sm.style.display = 'none'
    isLoggedIn = false
    window.localStorage.removeItem('ticketDetails')
    window.location.href = "./pages/login.html";

}

// Redirect logged-in users away from login/signup page
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem("current_user"));
    if (user && window.location.pathname.includes("login.html")) {
        alert("You're already logged in!");
        window.location.href = "../index.html";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem("current_user"));
    if (user && window.location.pathname.includes("register.html")) {
        alert("You're already logged in!");
        window.location.href = "../index.html";
    }
});


// session

const currentUser = JSON.parse(localStorage.getItem("current_user"));
const logout_btn = document.getElementById('logout_btn')
const logout_btn_sm = document.getElementById('logout_btn_sm')

if (currentUser && currentUser.username) {
    logged_user.innerText = currentUser.username;
    if (logged_user_sm) {
        logged_user_sm.innerText = currentUser.username;
    }
    isLoggedIn = true;
}

if (logout_btn) {
    logout_btn.style.display = currentUser ? 'block' : 'none';
}

if (logout_btn_sm) {
    logout_btn_sm.style.display = currentUser ? 'inline-block' : 'none';
}


// bus selection page
let filters = document.getElementsByClassName('filter-btn')
let filter_type = [];
for (const filter of filters) {
    filter.addEventListener('click', () => {
        filter.classList.toggle('selected')
    })
}

// search 
// dropdown places selection
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function () {
        const dropdown = this.closest('.dropdown');
        const input = dropdown.querySelector('input');
        input.value = this.textContent;
    })
})


const submitSearch = () => {
    let from = document.getElementById('from').value.trim();
    let to = document.getElementById('to').value.trim();
    let date = document.getElementById('datepicker').value;

    if (!from || !to || !date) {
        alert("Please fill From, To and Date.");
        return;
    }

    localStorage.setItem("search_data", JSON.stringify({ from, to, date }));
    window.location.href = "./pages/bus.html";
};

// document.getElementById('search').addEventListener('click', submitSearch);



let fetchBuses = async () => {
    let from = document.getElementById('from').value.trim();
    let to = document.getElementById('to').value.trim();
    let date = document.getElementById('datepicker').value;
    booked_seats = [];
    localStorage.removeItem("booked_bus_details");

    if (!from || !to || !date) {
        alert("Please fill From, To and Date.");
        return;
    }
    try {
        const response = await axios.get(`${url}/buses`, {
            params: {
                from: from.charAt(0).toUpperCase() + from.slice(1),
                to: to.charAt(0).toUpperCase() + to.slice(1),
            }
        })

        const data = await response.data
        renderBuses(data)


    } catch (error) {
        console.log("Error: ", error.message)
    }
}

// document.getElementById('search').addEventListener('click', fetchBuses);


let renderBuses = (data) => {
    let no_of_buses = document.getElementById('no_of_buses')
    try {
        no_of_buses.innerText = `${data.length} Buses Found`
        createBusCard(data)
    } catch (error) {
        console.log("Error: ", error.message)
    }
}

function getAmenityIcon(name) {
    const map = {
        "WiFi": '<i class="fi fi-rr-wifi"></i>',
        "Water Bottle": '<i class="fi fi-rr-water-bottle"></i>',
        "Charging Point": '<i class="fi fi-rr-car-charger-bolt"></i>',
        "Blanket": '<i class="fi fi-rr-blanket"></i>',
        "Reading Light": '<i class="fi fi-rr-lamp-desk"></i>',
        "TV": '<i class="fi fi-rr-tv-retro"></i>'
    };
    return map[name] || `<span>${name}</span>`; // fallback if icon not found
}


function createBusCard(buses) {
    const container = document.getElementById("bus-container");
    container.innerHTML = ""; // Clear existing cards

    const renderSeat = (seat) => `
        <div class="seat border border-1 d-flex align-items-center rounded-2 justify-content-center p-2 btn 
            ${seat.status === 'booked' ? 'disabled-seat' : ''}"
            ${seat.status === 'booked' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}
        >
            <span>${seat.number}</span>
            <svg height="40px" viewBox="0 0 24 24" fill="none" class="seat_svg" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 20V22C22.5 22.5523 22.0523 23 21.5 23H7.59646C6.66266 23 5.85314 22.3538 5.64619 21.4432L1.27764 2.22162C1.13542 1.59586 1.61105 1 2.25277 1H5.70799C6.17204 1 6.57512 1.31925 6.6814 1.77096L10.5 18H20.5C21.6046 18 22.5 18.8954 22.5 20Z"
                    stroke="${seat.status === 'booked' ? '#d1d5db' : '#71717A'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.96729 3H8.99999C9.55228 3 10 3.44772 10 4V6L8 7.5"
                    stroke="${seat.status === 'booked' ? '#d1d5db' : '#71717A'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.5 14.375H9.625H7.5"
                    stroke="${seat.status === 'booked' ? '#d1d5db' : '#71717A'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    `;

    buses.forEach((bus) => {
        const card = document.createElement("div");
        card.className = "bus-card rounded-2 p-3";

        // Split seats into 3 rows: 8 + 8 + 8
        const seatsTop1 = bus.seats.slice(0, 8);
        const seatsTop2 = bus.seats.slice(8, 16);
        const seatsBottom = bus.seats.slice(16, 24);

        card.innerHTML = `
        <img src="../assets/icons/bus-ticket.png" alt="bus-ticket" height="40" class="b-ticket" />

        <div class="b-name d-flex flex-column align-items-center">
            <span class="fs-5 fw-bold">${bus.travels}</span>
            <span class="fw-medium">${bus.type}</span>
        </div>

        <div class="duration d-flex gap-3 fs-5 fw-medium">
            <div id="b-time">
                <span>${bus.departure}</span><br />
                <span>${bus.from}</span>
            </div>
            <i class="fi fi-rr-arrow-right"></i>
            <div>
                <span>${bus.arrival}</span><br />
                <span>${bus.to}</span>
            </div>
        </div>

        <div class="b-price fs-5 fw-bold">
            <span>₹${bus.price}/-</span>
            <span>Onwards</span>
        </div>

        <div class="sep my-2 border-bottom"></div>

        <div class="rating fs-5 fw-medium mb-2">Rating: ${bus.rating}</div>

        <div class="amenties fs-5 d-flex gap-4 flex-wrap align-items-center">
            <span class="fs-5 fw-medium">Amenities: </span>
            <div class="d-flex justify-content-start gap-3">
                ${bus.amenities.map((item) => getAmenityIcon(item)).join("")}
            </div>
        </div>

        <button class="seat-btn btn btn-danger">View Seats</button>

        <div class="seats_container col-9 align-items-start justify-content-between mt-3">
            <i class="fi fi-rr-steering-wheel fs-3 my-3"></i>

            <div class = "d-flex flex-column gap-4">
            <div class = "d-flex flex-column gap-2">
            <div class="d-flex justify-content-evenly gap-2">
                ${seatsTop1.map(renderSeat).join("")}
            </div>
            <div class="d-flex justify-content-evenly gap-2">
                ${seatsTop2.map(renderSeat).join("")}
            </div>
            </div>
            <div class="d-flex justify-content-evenly gap-2 mt-3">
                ${seatsBottom.map(renderSeat).join("")}
            </div>
            </div>
        </div>

        <button class="book mt-2 rounded-2 align-items-center justify-content-center">Book</button>
        `;

        container.appendChild(card);
    });
}


// selecting particular bus
document.addEventListener('DOMContentLoaded', function () {
    const busContainer = document.getElementById('bus-container');
    if (!busContainer) return;
    busContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('seat-btn')) {
            const seatsContainer = e.target.nextElementSibling;
            const book_btn = seatsContainer.nextElementSibling;


            if (seatsContainer) {
                seatsContainer.classList.toggle('show');
                book_btn.classList.toggle('show');
            }
        }
    });

})


// selecting seats container
document.addEventListener('DOMContentLoaded', function () {
    const busContainer = document.getElementById('bus-container');
    if (!busContainer) return;


    busContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('seat-btn')) {
            const seatsContainer = e.target.nextElementSibling;
            const seats = seatsContainer.querySelectorAll('.seat');

            seats.forEach(seat => {
                seat.addEventListener('click', () => {
                    const svg = seat.querySelector('svg');
                    const paths = svg.querySelectorAll('path');

                    const isSelected = svg.getAttribute('data-selected') === 'true';


                    if (isSelected) {
                        // Unselect
                        svg.style.fill = 'none';
                        paths.forEach(path => path.setAttribute('stroke', '#71717A')); // default stroke
                        svg.setAttribute('data-selected', 'false');
                    } else {
                        // Select
                        svg.style.fill = '#1fab89';
                        paths.forEach(path => path.setAttribute('stroke', 'none'));
                        svg.setAttribute('data-selected', 'true');
                    }

                    seat_selection(seat, seat.closest('.bus-card'))
                });
            });
        }
    });
})


// seat booking and saving to local db
let getBusInfo = async (bus_name) => {
    const from = document.getElementById('from').value.trim().toLowerCase();
    const to = document.getElementById('to').value.trim().toLowerCase();

    try {
        const response = await axios.get(`${url}/buses`);
        const allBuses = response.data;

        // Manually filter with case-insensitive match
        const matched = allBuses.find(bus =>
            bus.from.toLowerCase() === from &&
            bus.to.toLowerCase() === to &&
            bus.travels.toLowerCase() === bus_name.toLowerCase()
        );

        return matched; // will return undefined only if really not found
    } catch (error) {
        console.log("Error fetching bus info:", error.message);
    }
}


let seat_selection = async (seat, bus) => {
    const svg = seat.querySelector('svg')
    const isSelected = svg.getAttribute('data-selected') === 'true';
    const seatNumber = seat.firstElementChild.innerText;



    if (isSelected) {
        if (!booked_seats.includes(seatNumber)) {
            if (booked_seats.length >= 6) {
                alert("Maximum 6 seats only allowed");
                // Reset the selection UI (visually unselect the seat)
                svg.style.fill = 'none';
                svg.setAttribute('data-selected', 'false');
                const paths = svg.querySelectorAll('path');
                paths.forEach(path => path.setAttribute('stroke', '#71717A'));
                return;
            }
            booked_seats.push(seatNumber);
        }
    } else {
        booked_seats = booked_seats.filter(item => item !== seatNumber);
    }

    // console.log(booking_seats);
    let bus_name = bus.querySelector('.b-name').firstElementChild.innerText
    let bus_info = await getBusInfo(bus_name)
    const date = document.getElementById('datepicker').value.trim().toLowerCase();


    console.log(bus_info);


    if (bus_info) {
        let booked_bus_details = {
            ...bus_info,
            booked_seats,
            date: date,
            total_cost: booked_seats.length * bus_info.price
        };

        window.localStorage.setItem("booked_bus_details", JSON.stringify(booked_bus_details))
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const busContainer = document.getElementById('bus-container');
    if (!busContainer) return;
    busContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('book')) {
            if (booked_seats.length != 0) {
                if (isLoggedIn) {
                    window.location.href = "./pages/booking.html";
                }
                else {
                    alert('please login')
                    window.location.href = "./pages/login.html";
                }
            }
            else {
                alert('please select seats')
            }
        }
    });

})


// booking container
document.addEventListener('DOMContentLoaded', function () {
    const bookingContainer = document.getElementById('booking_container');
    let tripDetails = JSON.parse(window.localStorage.getItem('booked_bus_details'));

    if (!bookingContainer) return;

    bookingContainer.innerHTML = '';

    bookingContainer.innerHTML = `
    <div class="passenger_info col-12 col-md-6 rounded-3 p-3 d-flex flex-column gap-3">
      <span class="fs-3 ms-1 fw-medium text-decoration-underline">Trip Details</span> 

      <div class="trip_details rounded-2 mt-2">
        <div class="t_name px-3 pt-3">
          <i class="fi fi-rr-bus-ticket fs-3"></i>
        </div>

        <div class="trip d-flex align-items-center justify-content-between px-3 pb-2">
          <div class="time">
            <span class="fw-bold fs-4">${tripDetails.from}</span>
            <span>${tripDetails.departure}</span>
          </div>

          <div class="line"></div>

          <span class="duration rounded-5 px-2">${tripDetails.duration}</span>

          <div class="line"></div>

          <div class="time">
            <span class="fw-bold fs-4">${tripDetails.to}</span>
            <span>${tripDetails.arrival}</span>
          </div>
        </div>

        <div class="shade p-2 px-3 rounded-bottom-2">
          <div>
            <span class="from fs-5 fw-medium">${tripDetails.travels}</span><br />
            <span class="to ps-2">${tripDetails.type}</span>
          </div>

          <div class="d-flex gap-2 fs-5 pe-3">
            <span>Amenities: </span>
            ${tripDetails.amenities.map((item) => getAmenityIcon(item)).join("")}
          </div>
        </div>
      </div>

      <div class="d-flex flex-column gap-4">
        <span class="fs-3 fw-medium text-decoration-underline my-2">Contact Details</span>
        <span class="contact_details"><i class="fi fi-rr-phone-call"></i> <input type="text" name="mobile" id="mobile" placeholder="Mobile Number"></span>
        <span class="contact_details"><i class="fi fi-rr-envelope "></i> <input type="email" name="email" id="email" placeholder="Email ID"></span>
        </div>
                    

        
    <div>
        <span class="fs-3 fw-medium text-decoration-underline my-2">Passenger Details</span>
        ${tripDetails.booked_seats.map((item, index) => {
        return `
            <div class="passenger_form align-items-start px-2">
            <span class="fw-medium fs-5">Passenger ${index + 1}</span> 
            <div class=" d-flex justify-content-evenly gap-3">
            <span class="fw-medium border border-1 rounded-2 p-2 seat-num">Seat-${item}</span>
            <input type="text" class="form-control w-auto" placeholder="Name" name="passenger_name_${index}" />
            <input type="number" class="form-control w-auto" placeholder="Age" min="1" max="100" name="passenger_age_${index}" />
            <select class="form-select w-auto" name="passenger_gender_${index}">
            <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        </select>            
            </div>

            
        </div>
        `
    }).join("")}
        </div>


    </div>

    <div class="fare_details col-12 col-md-5 rounded-3 pt-2 d-flex flex-column justify-content-evenly">
      <div class="border-bottom mb-3 pb-4">
        <span class="fs-4 text-decoration-underline fw-bold px-2">Fare Details</span>

        <div class="d-flex justify-content-between px-2 fs-5">
          <span>Base Fare</span>
          <span class="fw-medium">₹ ${tripDetails.total_cost}.00</span>                
        </div>

        <div class="d-flex justify-content-between px-2 fs-5">
          <span>GST</span>
          <span class="fw-medium">₹ ${(tripDetails.total_cost * 0.05).toFixed(2)}</span>                
        </div>
      </div>

      <div class="d-flex justify-content-between px-2 fs-5 pb-3">
        <span class="fs-4 fw-bold">Total Fare</span>
        <span class="fw-medium">₹ ${(tripDetails.total_cost * 1.05).toFixed(2)}</span>                
      </div>

      <div class="d-flex justify-content-between px-2 fs-5 pb-3 mt-3">
        <span class="fw-bold fs-4">Choose Payment Mode:</span>
        <div>
          <select class="form-select" aria-label="Default select example">
            <option value="upi">UPI App</option>
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
          </select>   
        </div>
      </div>

      <button class="rounded-2 cb_btn p-3 mb-2 align-self-end" id="cb_btn">Continue Booking</button>
    </div>
  `;
});

let saveBooking = async (booking_data) => {
    try {
        const response = await axios.post(`${url}/bookings`, booking_data)
        console.log("booking success", response.data)
    } catch (error) {
        console.log("error:", error.message);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const ticket_book = document.getElementById('cb_btn');
    let booking = JSON.parse(window.localStorage.getItem('booked_bus_details'));
    let user = JSON.parse(window.localStorage.getItem('current_user'));
    if (!ticket_book) return;

    ticket_book.addEventListener('click', (e) => {
        e.preventDefault()

        let mob = document.getElementById('mobile').value
        let email = document.getElementById('email').value
        const ticketDetails = {
            busName: booking.busName,
            travels: booking.travels,
            type: booking.type,
            from: booking.from,
            to: booking.to,
            date: booking.date,
            departure: booking.departure,
            arrival: booking.arrival,
            seats: booking.booked_seats,
            duration: booking.duration,
            mobile: mob,
            email: email,
            passenger: {
                username: user.username
            }
        };

        console.log(ticketDetails);


        localStorage.setItem('ticketDetails', JSON.stringify(ticketDetails));

        alert("booking successfull")
        saveBooking(ticketDetails)
        window.location.href = "./pages/tickets.html";
    })
})

let getTicket = async () => {
    let user = JSON.parse(window.localStorage.getItem('current_user')) || [];
    try {
        const response = await axios.get(`${url}/bookings`, {
            params: {
                email: user.email
            }
        })

        const data = await response.data
        return data
    } catch (error) {
        console.log("Error: ", error.message);
    }
}


// ticket design
document.addEventListener('DOMContentLoaded', async function () {
    const ticket_container = document.getElementById('ticket_container');
    let ticketDetails = JSON.parse(window.localStorage.getItem('ticketDetails')) || await getTicket();

    if (!ticket_container || !isLoggedIn) return;


    if (!ticketDetails || ticketDetails.length === 0) {
        ticket_container.innerHTML = '<h1 class="fw-medium">You do not have any bookings</h1>'
        return
    }
    else {
        ticket_container.innerHTML = '';

        ticket_container.innerHTML = `

    <div class="ticket_container rounded-2 col-md-8 col-sm-12 mb-3 p-3">
    <span class="fs-2 text-decoration-underline fw-bold et">E-Ticket</span>
    
            <div class="b_title d-flex ">
            <div class="t_icon">
            <i class="fi fi-rr-bus"></i>
            </div>
            <span class=" fs-5 fw-bold">${ticketDetails.busName}</span>
            </div>
                <div class="t_sep"></div>
                
                <div class="tt_name">
                <span class="from fs-5 fw-bold">${ticketDetails.travels}</span>
                <span class="to ps-2">${ticketDetails.type}</span>
                </div>
                
                <div
                class="t_trip d-flex align-items-center justify-content-between px-md-3 pb-2"
                >
                <div class="time">
                <span class="fw-bold fs-4">${ticketDetails.from}</span>
                </div>
                
                <div class="line"></div>
                
                <span class="duration rounded-5 px-2">${ticketDetails.duration}</span>
                
                <div class="line"></div>
                
                <div class="time">
                <span class="fw-bold fs-4">${ticketDetails.to}</span>
                </div>
                </div>
                
                <div class="dep d-flex flex-column">
                <span>Departure</span>
                <span class="fw-bold fs-5">${ticketDetails.departure}</span>
                </div>
                
                <div class="arv d-flex flex-column">
                <span>Arrival</span>
                <span class="fw-bold fs-5">${ticketDetails.arrival}</span>
                </div>
                
                <div class="p_name d-flex flex-column">
                <span>Passenger</span>
                <span class="fw-medium fs-5">${ticketDetails.passenger.username}</span>
                </div>
                
                <div class="pass d-flex flex-column">
                <span>Seats</span>
                <span class="fw-medium fs-5">${ticketDetails.seats}</span>
                </div>
                
                <div class="date d-flex flex-column">
                <span class="align-self-start">Date</span>
                <span class="fw-medium fs-5">${ticketDetails.date}</span>
                </div>
                
                <div class="qr_code">
                <canvas id="qr-code"></canvas>
                </div>
                
                
                </div>
                <button id="downloadTicket" class="rounded-2 dt_btn p-3 col-3">Download E-ticket</button>
                <canvas id="qrCanvas" style="display: none;"></canvas> <!-- hidden QR canvas -->
                
                `
    }

})

// qr code generator
document.addEventListener("DOMContentLoaded", function () {
    const tripDetails = JSON.parse(localStorage.getItem('ticketDetails')) || [];

    if (!tripDetails || Object.keys(tripDetails).length === 0) return;

    const qrValue = `Bus: ${tripDetails.travels}, Seats: ${tripDetails.seats.join(", ")}, From: ${tripDetails.from}, To: ${tripDetails.to}, Date: ${tripDetails.date}`;

    const qr = new QRious({
        element: document.getElementById('qr-code'),
        value: qrValue,
        size: 150,
        background: 'white',
        foreground: '#015551'
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const downloadTicket = document.getElementById('downloadTicket');

    if (downloadTicket) {
        downloadTicket.addEventListener('click', async () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const tripDetails = JSON.parse(window.localStorage.getItem('ticketDetails'));

            if (!tripDetails) {
                alert("No ticket data found.");
                return;
            }

            // ✅ Generate QR code
            const qr = new QRious({
                element: document.getElementById('qrCanvas'),
                value: JSON.stringify(tripDetails),
                size: 200
            });

            // ✅ Add ticket text to PDF
            doc.setFontSize(16);
            doc.text("E-Ticket", 90, 15);

            doc.setFontSize(12);
            doc.text(`Travels: ${tripDetails.travels} (${tripDetails.type})`, 20, 30);
            doc.text(`From: ${tripDetails.from}`, 20, 40);
            doc.text(`To: ${tripDetails.to}`, 20, 50);
            doc.text(`Departure: ${tripDetails.departure}`, 20, 60);
            doc.text(`Arrival: ${tripDetails.arrival}`, 20, 70);
            doc.text(`Passenger: ${tripDetails.passenger.username}`, 20, 80);
            doc.text(`Seat No: ${tripDetails.seats.join(", ")}`, 20, 90);
            doc.text(`Date: ${tripDetails.date}`, 20, 100);

            // ✅ Add QR image to PDF
            const qrImage = document.getElementById('qrCanvas').toDataURL("image/png");
            doc.addImage(qrImage, 'PNG', 140, 40, 50, 50);

            // ✅ Save as PDF
            doc.save("e-ticket.pdf");
        });
    }
});






// listener to ,load all elements into dom
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login');
    const searchData = JSON.parse(localStorage.getItem("search_data"));
    const searchBtn = document.getElementById('search');

    if (searchBtn) {
        searchBtn.addEventListener('click', submitSearch);
        searchBtn.addEventListener('click', fetchBuses);
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }

    const registerBtn = document.getElementById('register');
    if (registerBtn) {
        registerBtn.addEventListener('click', signup);
    }

    if (logout_btn) {
        logout_btn.addEventListener('click', logout);
    }

    // 🟡 If we have redirected from home with data
    if (searchData) {
        document.getElementById('from').value = searchData.from;
        document.getElementById('to').value = searchData.to;
        document.getElementById('datepicker').value = searchData.date;

        localStorage.removeItem("search_data");

        fetchBuses(); // call with prefilled inputs
    }
});
