// ---------------- COST CALCULATION ----------------
function calculateCost() {
  let vehicle = document.getElementById("vehicle").value;
  let pickup = document.getElementById("pickup").checked;
  let summary = document.getElementById("summary");

  if (!vehicle) {
    summary.innerHTML = "⚠ Select all fields";
    return;
  }

  let base = vehicle == 2 ? 1000 : 3000;
  let pickupCharge = pickup ? 500 : 0;

  summary.innerHTML = `💰 Estimated Cost: ₹${base + pickupCharge}`;
}

// ---------------- FIREBASE CONFIG ----------------
const firebaseConfig = {
  apiKey: "AIzaSyDB5nVKuVEu48egVWK8zPXtzi4VqLJwSx8",
  authDomain: "smart-garage-4cb18.firebaseapp.com",
  projectId: "smart-garage-4cb18",
  storageBucket: "smart-garage-4cb18.appspot.com",
  messagingSenderId: "630399871832",
  appId: "1:630399871832:web:d2d9b2522923ed3411d32d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();

// ---------------- CONTACT FORM LOGIC ----------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        status.style.color = "red";
        status.textContent = "Please fill all fields.";
        return;
      }

      status.style.color = "black";
      status.textContent = "Sending...";

      db.collection("contactMessages").add({
        name,
        email,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        status.style.color = "green";
        status.textContent = "Message sent successfully!";
        form.reset();
      })
      .catch((error) => {
        status.style.color = "red";
        status.textContent = "Something went wrong. Try again.";
        console.error(error);
      });
    });
  }

  // ---------------- BOOKING FORM LOGIC ----------------
  const bookingForm = document.getElementById("bookingForm");
  const bookingStatus = document.getElementById("bookingStatus");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("custName").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const vehicle = document.getElementById("vehicle").value;
      const service = document.getElementById("service").value;
      const pickup = document.getElementById("pickup").checked;

      if (!name || !phone || !vehicle || !service) {
        bookingStatus.style.color = "red";
        bookingStatus.textContent = "Please fill all fields.";
        return;
      }

      const baseCost = vehicle == 2 ? 1000 : 3000;
      const pickupCharge = pickup ? 500 : 0;
      const totalCost = baseCost + pickupCharge;

      bookingStatus.style.color = "black";
      bookingStatus.textContent = "Booking service...";

      db.collection("bookings").add({
        name: name,
        phone: phone,
        vehicle: vehicle == 2 ? "Two Wheeler" : "Four Wheeler",
        service: service,
        pickup: pickup,
        cost: totalCost,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        bookingStatus.style.color = "green";
        bookingStatus.textContent = "Booking successful!";
        bookingForm.reset();
        document.getElementById("summary").textContent = "";
      })
      .catch((error) => {
        bookingStatus.style.color = "red";
        bookingStatus.textContent = "Booking failed. Try again.";
        console.error(error);
      });
    });
  }
});
