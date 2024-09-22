const staffForm = document.getElementById("staffForm");
let editingCard = null; // Variable to keep track of the card being edited

// Event listener for form submission
staffForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission

  // Retrieve values from the form
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const shift = document.getElementById("shift").value;

  // Create HTML structure for the staff card
  const cardHtml = `
    <table class="card-table">
      <thead>
        <tr>
          <th colspan="2">${name}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Address</strong></td>
          <td>${address}</td>
        </tr>
        <tr>
          <td><strong>Phone Number</strong></td>
          <td>${phone}</td>
        </tr>
        <tr>
          <td><strong>Email</strong></td>
          <td>${email}</td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="card-actions">
              <button class="btn btn-check" onclick="confirmStaff('${name}')">✔</button>
              <button class="btn btn-delete" onclick="deleteStaff(this)">🗑</button>
              <button class="btn btn-edit" onclick="modifyStaff(this)">✏️</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  // Determine the correct section for the staff card based on the selected shift
  const shiftCardsContainer = document.getElementById(
    shift === "shift-night" ? "shift-night-cards" : "shift-morning-cards"
  );
  const existingCards = shiftCardsContainer.querySelector(".no-cards-message");

  // Remove no-cards message if present
  if (existingCards) {
    existingCards.remove();
  }

  // If editing a card, replace the existing card with the new HTML
  if (editingCard) {
    editingCard.outerHTML = cardHtml;
    editingCard = null; // Reset editing card after replacement
  } else {
    // If not editing, add the new card to the container
    shiftCardsContainer.insertAdjacentHTML("beforeend", cardHtml);
  }

  // Display a SweetAlert with the details of the staff member
  Swal.fire({
    title: "Detail Staf",
    html: `<strong>Name:</strong> ${name} <br><strong>Address:</strong> ${address} <br><strong>Phone Number:</strong> ${phone} <br><strong>Email:</strong> ${email}`,
    icon: "success",
    confirmButtonText: "OK",
  });

  staffForm.reset(); // Reset the form for new input
});

// Function to delete a staff member
function deleteStaff(button) {
  // Show confirmation alert before deleting
  Swal.fire({
    title: "Konfirmasi Hapus",
    text: "Apakah Anda yakin ingin menghapus staf ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      const card = button.closest("table");
      const shiftCardsContainer = button.closest(".custom-scroll");

      card.remove();

      // Check if there are any remaining cards
      if (!shiftCardsContainer.querySelector("table")) {
        const noCardsMessage = document.createElement("div");
        noCardsMessage.className = "no-cards-message text-white text-center";
        noCardsMessage.innerText =
          shiftCardsContainer.id === "shift-night-cards"
            ? "Tidak ada staf di Shift Malam"
            : "Tidak ada staf di Shift Pagi";
        shiftCardsContainer.appendChild(noCardsMessage);
      }
    }
  });
}

// Function to confirm a staff member
function confirmStaff(name) {
  // Show confirmation alert for staff confirmation
  Swal.fire({
    title: "Staff Confirmed",
    text: `${name} has been confirmed.`,
    icon: "success",
    confirmButtonText: "OK",
  });
}

// Function to modify staff details and change shifts
function modifyStaff(button) {
  const card = button.closest("table");

  // Extract current details from the card
  const name = card.querySelector("th").innerText;
  const address = card.querySelector("td:nth-child(2)").innerText;
  const phone = card.querySelector(
    "tbody tr:nth-child(2) td:nth-child(2)"
  ).innerText; // Phone number
  const email = card.querySelector(
    "tbody tr:nth-child(3) td:nth-child(2)"
  ).innerText; // Email
  const currentShift = card.closest("#shift-night-cards")
    ? "shift-night"
    : "shift-morning";

  // Show SweetAlert to get new staff details, including shift
  Swal.fire({
    title: "Edit Staff",
    html: `
      <input id="swal-input-name" class="swal2-input" placeholder="Name" value="${name}">
      <input id="swal-input-address" class="swal2-input" placeholder="Address" value="${address}">
      <input id="swal-input-phone" class="swal2-input" placeholder="Phone" value="${phone}">
      <input id="swal-input-email" class="swal2-input" placeholder="Email" value="${email}">
      <select id="swal-input-shift" class="swal2-input">
        <option value="shift-morning" ${
          currentShift === "shift-morning" ? "selected" : ""
        }>Morning Shift</option>
        <option value="shift-night" ${
          currentShift === "shift-night" ? "selected" : ""
        }>Night Shift</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      return {
        name: document.getElementById("swal-input-name").value,
        address: document.getElementById("swal-input-address").value,
        phone: document.getElementById("swal-input-phone").value,
        email: document.getElementById("swal-input-email").value,
        shift: document.getElementById("swal-input-shift").value,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, address, phone, email, shift } = result.value;

      // Update the card with the new details
      card.querySelector("th").innerText = name;
      card.querySelector("td:nth-child(2)").innerText = address;
      card.querySelector("tbody tr:nth-child(2) td:nth-child(2)").innerText =
        phone;
      card.querySelector("tbody tr:nth-child(3) td:nth-child(2)").innerText =
        email;

      const oldShiftCardsContainer = card.closest(".custom-scroll");
      const newShiftCardsContainer = document.getElementById(
        shift === "shift-night" ? "shift-night-cards" : "shift-morning-cards"
      ); // Get the new shift container

      // If the shift has changed, move the card to the new container
      if (shift !== currentShift) {
        oldShiftCardsContainer.removeChild(card);

        // Show message if no staff left in the old shift
        if (!oldShiftCardsContainer.querySelector("table")) {
          const noCardsMessage = document.createElement("div");
          noCardsMessage.className = "no-cards-message text-white text-center";
          noCardsMessage.innerText =
            oldShiftCardsContainer.id === "shift-night-cards"
              ? "No staff in Night Shift"
              : "No staff in Morning Shift";
          oldShiftCardsContainer.appendChild(noCardsMessage);
        }

        // Remove no-cards message if it exists in the new shift container
        const existingCards =
          newShiftCardsContainer.querySelector(".no-cards-message");
        if (existingCards) {
          existingCards.remove();
        }

        newShiftCardsContainer.appendChild(card);
      }

      // Show success message after update
      Swal.fire({
        title: "Success!",
        text: "Staff details have been updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  });
}

// DARK-THEMESS

let body = document.body;
let navbar = document.getElementById("navbar");
let navbarFill = document.getElementById("navbarCollapse");
let footer = document.getElementById("footer");
let link = document.querySelectorAll("#link");
let carousel = document.querySelectorAll("#name, #description");
let catalogFill = document.querySelectorAll("#headline, #author");
let carouselFrame = document.getElementById("carouselExampleRide");
let testimonial = document.getElementById("Testimonial");
let catalog = document.getElementById("catalog");
let darkTheme = document.getElementById("buttonDark");
let lightTheme = document.getElementById("buttonLight");

darkTheme.addEventListener('click', () => {

  body.style.backgroundColor = "#0F0F0F";
  navbar.style.backgroundColor = "#494949";
  carouselFrame.style.backgroundColor = "#707070";
  navbarFill.style.color = "#2DC9EF";
  footer.style.color = "white";
  testimonial.style.color = "white";
  catalog.style.color = "white";

  link.forEach(link => {
    link.style.color = "white";
  });

  carousel.forEach(carousel => {
    carousel.style.color = "white";
  });

  catalogFill.forEach(catalogFill => {
    catalogFill.style.color = "black";
  });
    
});

lightTheme.addEventListener('click', () => {

  body.style.backgroundColor = "#FFFFFF";
  navbar.style.backgroundColor = "#0065D0";
  carouselFrame.style.backgroundColor = "#2DC9EF";
  navbarFill.style.color = "#2DC9EF";
  footer.style.color = "black";
  testimonial.style.color = "black";
  catalog.style.color = "black";

  link.forEach(link => {
    link.style.color = "black";
  });

  carousel.forEach(carousel => {
    carousel.style.color = "black";
  });

  catalogFill.forEach(catalogFill => {
    catalogFill.style.color = "black";
  });

});

