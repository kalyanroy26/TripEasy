# 🚌 TripEasy – Bus Booking Web Application

A **responsive bus booking web application** where users can search for buses, select seats, book tickets, and download **QR code-enabled e-tickets**. Built with **HTML, CSS, JavaScript**, and a custom API using **MockAPI** & **JSON Server**.

<img width="2850" height="7522" alt="kalyanroy26 github io_TripEasy_" src="https://github.com/user-attachments/assets/7238924c-e0ca-4f5b-885a-1a856f16d3a3" />


## 🚀 Features

* 🔍 **Search Buses** by source, destination, and date.
* 🎯 **Dynamic Dropdowns** with all possible routes.
* 🎟 **Seat Selection** & instant booking confirmation.
* 📄 **E-Ticket PDF Generator** with embedded **QR code** using QRious & jsPDF.
* 👤 **User Authentication** – Registration & Login.
* 📱 **Fully Responsive** for desktop, tablet, and mobile devices.
* 🌐 **Custom API** for buses and users using MockAPI.

## 🛠 Tech Stack

**Frontend:**

* HTML5, CSS3 (Flexbox, Grid, Media Queries, Bootstrap 5)
* JavaScript (ES6)
* Bootstrap Icons

**Backend / API:**

* https://mockapi.io/projects/689719be250b078c2040f7fe
* JSON Server (local testing)

**Libraries:**

* Axios – API requests
* jsPDF – PDF generation
* QRious – QR code generation

**Hosting:**

* GitHub Pages – Frontend
* MockAPI – Backend

## 📂 Project Structure

```
├── assets/          # Images, icons, illustrations
├── css/             # Stylesheets
├── pages/           # HTML pages (bus.html, booking.html, login.html, register.html, tickets.html)
├── script.js        # Main JavaScript logic
└── index.html       # Homepage
```

## ⚙ API Endpoints

Example (MockAPI): `https://mockapi.io/projects/689719be250b078c2040f7fe`

* **Buses:** `https://mockapi.io/projects/689719be250b078c2040f7fe/buses`
* **Users:** `https://mockapi.io/projects/689719be250b078c2040f7fe/register`

## 📦 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/<your-username>/TripEasy.git
   cd TripEasy
   ```
2. **Open `index.html` in a browser** (for frontend).
3. **Run JSON Server** (for local API testing):

   ```bash
   json-server --watch db.json
   ```
4. **Deploy**

   * Frontend: GitHub Pages
   * Backend: MockAPI or Render

## 📌 Live Demo
🔗 https://kalyanroy26.github.io/TripEasy/

## 👨‍💻 Author
Kalyan Maharajulu

 GitHub: https://github.com/kalyanroy26
 LinkedIn: https://www.linkedin.com/in/kalyan-maharajulu-664573199/


