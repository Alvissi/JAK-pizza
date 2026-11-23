// ===============================================
// PIZZA ORDERING SYSTEM - script.js
// ===============================================

// -----------------------------------------------
// 1. PIZZA DATA (stored in a simple array)
// -----------------------------------------------
const pizzas = [
  {
    id: 1,
    name: "Classic Pepperoni",
    description: "Loaded with pepperoni and melted mozzarella cheese.",
    price: 229,
    image: "peppe.jpg"
  },
  {
    id: 2,
    name: "Ham & Cheese",
    description: "Ham, cheese, and lots of mozzarella.",
    price: 229,
    image: "h&c.jpg"
  },
  {
    id: 3,
    name: "Hawaiian Delight",
    description: "Sweet pineapple chunks with savory ham.",
    price: 229,
    image: "hawain.jpg"
  },
  {
    id: 4,
    name: "Overload",
    description: "Loaded with savory pepperoni, ham, beef, onions, bell peppers, and mushrooms under a blanket of melted mozzarella.",
    price: 299,
    image: "overload.jpg"
  },
  {
    id: 5,
    name: "Four Cheese",
    description: "A rich blend of mozzarella, cheddar, parmesan, and feta.",
    price: 219,
    image: "fourcheese.jpg"
  },
  {
    id: 6,
    name: "Veggie Supreme",
    description: "Bell peppers, mushrooms, olives, and onions.",
    price: 269,
    image: "vege.jpg"
  }
];

// -----------------------------------------------
// 2. ORDER STATE (temporary, browser memory only)
// -----------------------------------------------
// Each order item looks like: { id, name, price, quantity }
let order = [];

// Every order that has been placed, stored here so it can be viewed in the
// "All Orders" section (like a food-delivery app's order list). This is kept
// in browser memory only, so it resets if the page is reloaded.
let orderHistory = [];
let nextOrderNumber = 1;

// -----------------------------------------------
// 3. DOM ELEMENT REFERENCES
// -----------------------------------------------
const pizzaListEl = document.getElementById("pizza-list");
const emptyOrderMsgEl = document.getElementById("empty-order-msg");
const orderTableEl = document.getElementById("order-table");
const orderTableBodyEl = document.getElementById("order-table-body");
const orderTotalEl = document.getElementById("order-total");
const totalAmountEl = document.getElementById("total-amount");

const customerForm = document.getElementById("customer-form");
const customerNameInput = document.getElementById("customer-name");
const customerContactInput = document.getElementById("customer-contact");
const customerAddressInput = document.getElementById("customer-address");

const confirmationSection = document.getElementById("confirmation-section");
const confirmNameEl = document.getElementById("confirm-name");
const confirmContactEl = document.getElementById("confirm-contact");
const confirmAddressEl = document.getElementById("confirm-address");
const confirmItemsEl = document.getElementById("confirm-items");
const confirmTotalEl = document.getElementById("confirm-total");
const newOrderBtn = document.getElementById("new-order-btn");

// Navigation + All Orders view
const orderViewEl = document.getElementById("order-view");
const allOrdersViewEl = document.getElementById("all-orders-view");
const navOrderBtn = document.getElementById("nav-order-btn");
const navAllOrdersBtn = document.getElementById("nav-all-orders-btn");
const noOrdersMsgEl = document.getElementById("no-orders-msg");
const allOrdersListEl = document.getElementById("all-orders-list");

// -----------------------------------------------
// 4. RENDER THE PIZZA MENU
// -----------------------------------------------
function renderPizzaMenu() {
  pizzaListEl.innerHTML = "";

  pizzas.forEach(function (pizza) {
    const card = document.createElement("div");
    card.className = "pizza-card";

    card.innerHTML = `
      <img src="${pizza.image}" alt="${pizza.name}">
      <div class="pizza-card-body">
        <h3>${pizza.name}</h3>
        <p class="description">${pizza.description}</p>
        <p class="price">₱${pizza.price.toFixed(2)}</p>
        <div class="pizza-card-actions">
          <input type="number" min="1" value="1" id="qty-${pizza.id}">
          <button class="btn btn-add" data-id="${pizza.id}">Add to Order</button>
        </div>
      </div>
    `;

    pizzaListEl.appendChild(card);
  });

  // Attach click events to all "Add to Order" buttons
  const addButtons = document.querySelectorAll(".btn-add");
  addButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const pizzaId = parseInt(button.getAttribute("data-id"));
      addToOrder(pizzaId);
    });
  });
}

// -----------------------------------------------
// 5. ADD A PIZZA TO THE ORDER
// -----------------------------------------------
function addToOrder(pizzaId) {
  const pizza = pizzas.find(function (p) {
    return p.id === pizzaId;
  });

  const qtyInput = document.getElementById("qty-" + pizzaId);
  let quantity = parseInt(qtyInput.value);

  // Basic validation: quantity must be a positive whole number
  if (isNaN(quantity) || quantity < 1) {
    alert("Please enter a valid quantity (1 or more).");
    return;
  }

  // Check if this pizza is already in the order; if so, just add to its quantity
  const existingItem = order.find(function (item) {
    return item.id === pizzaId;
  });

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    order.push({
      id: pizza.id,
      name: pizza.name,
      price: pizza.price,
      quantity: quantity
    });
  }

  qtyInput.value = 1; // reset quantity field
  renderOrderSummary();
}

// -----------------------------------------------
// 6. REMOVE A PIZZA FROM THE ORDER
// -----------------------------------------------
function removeFromOrder(pizzaId) {
  order = order.filter(function (item) {
    return item.id !== pizzaId;
  });
  renderOrderSummary();
}

// -----------------------------------------------
// 7. RENDER THE ORDER SUMMARY TABLE
// -----------------------------------------------
function renderOrderSummary() {
  orderTableBodyEl.innerHTML = "";

  if (order.length === 0) {
    emptyOrderMsgEl.classList.remove("hidden");
    orderTableEl.classList.add("hidden");
    orderTotalEl.classList.add("hidden");
    return;
  }

  emptyOrderMsgEl.classList.add("hidden");
  orderTableEl.classList.remove("hidden");
  orderTotalEl.classList.remove("hidden");

  let total = 0;

  order.forEach(function (item) {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>₱${item.price.toFixed(2)}</td>
      <td>₱${subtotal.toFixed(2)}</td>
      <td><button class="btn btn-remove" data-id="${item.id}">Remove</button></td>
    `;
    orderTableBodyEl.appendChild(row);
  });

  totalAmountEl.textContent = total.toFixed(2);

  // Attach click events to all "Remove" buttons
  const removeButtons = document.querySelectorAll(".btn-remove");
  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const pizzaId = parseInt(button.getAttribute("data-id"));
      removeFromOrder(pizzaId);
    });
  });
}

// -----------------------------------------------
// 8. CALCULATE ORDER TOTAL
// -----------------------------------------------
function calculateTotal() {
  return order.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);
}

// -----------------------------------------------
// 9. HANDLE "PLACE ORDER" FORM SUBMISSION
// -----------------------------------------------
customerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (order.length === 0) {
    alert("Your order is empty. Please add at least one pizza before placing an order.");
    return;
  }

  const name = customerNameInput.value.trim();
  const contact = customerContactInput.value.trim();
  const address = customerAddressInput.value.trim();

  if (name === "" || contact === "" || address === "") {
    alert("Please fill in your name, contact number, and delivery address.");
    return;
  }

  showConfirmation(name, contact, address);
});

// -----------------------------------------------
// 10. SHOW ORDER CONFIRMATION
// -----------------------------------------------
function showConfirmation(name, contact, address) {
  confirmNameEl.textContent = name;
  confirmContactEl.textContent = contact;
  confirmAddressEl.textContent = address;

  confirmItemsEl.innerHTML = "";
  order.forEach(function (item) {
    const li = document.createElement("li");
    const subtotal = item.price * item.quantity;
    li.textContent = item.name + " x " + item.quantity + " = ₱" + subtotal.toFixed(2);
    confirmItemsEl.appendChild(li);
  });

  const total = calculateTotal();
  confirmTotalEl.textContent = total.toFixed(2);

  // Save this order into the order history so it shows up in "All Orders"
  orderHistory.push({
    orderNumber: nextOrderNumber,
    name: name,
    contact: contact,
    address: address,
    items: order.map(function (item) {
      return { name: item.name, price: item.price, quantity: item.quantity };
    }),
    total: total,
    placedAt: new Date()
  });
  nextOrderNumber++;
  renderAllOrders();

  // Hide the ordering sections, show the confirmation section
  document.querySelector(".menu-section").classList.add("hidden");
  document.querySelector(".order-section").classList.add("hidden");
  document.querySelector(".customer-section").classList.add("hidden");
  confirmationSection.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// -----------------------------------------------
// 10b. RENDER THE ALL ORDERS VIEW
// -----------------------------------------------
function renderAllOrders() {
  allOrdersListEl.innerHTML = "";

  if (orderHistory.length === 0) {
    noOrdersMsgEl.classList.remove("hidden");
    return;
  }

  noOrdersMsgEl.classList.add("hidden");

  // Show the most recent order first
  const ordersNewestFirst = orderHistory.slice().reverse();

  ordersNewestFirst.forEach(function (pastOrder) {
    const card = document.createElement("div");
    card.className = "order-card";

    const itemsHtml = pastOrder.items
      .map(function (item) {
        const subtotal = item.price * item.quantity;
        return "<li>" + item.name + " x " + item.quantity + " = ₱" + subtotal.toFixed(2) + "</li>";
      })
      .join("");

    const timeText = pastOrder.placedAt.toLocaleString();

    card.innerHTML = `
      <div class="order-card-header">
        <span class="order-number">Order #${pastOrder.orderNumber}</span>
        <span class="order-time">${timeText}</span>
      </div>
      <p><strong>Customer:</strong> ${pastOrder.name}</p>
      <p><strong>Contact:</strong> ${pastOrder.contact}</p>
      <p><strong>Address:</strong> ${pastOrder.address}</p>
      <ul>${itemsHtml}</ul>
      <p class="order-card-total">Total: ₱${pastOrder.total.toFixed(2)}</p>
    `;

    allOrdersListEl.appendChild(card);
  });
}

// -----------------------------------------------
// 10c. NAVIGATION BETWEEN "ORDER" AND "ALL ORDERS" VIEWS
// -----------------------------------------------
navOrderBtn.addEventListener("click", function () {
  orderViewEl.classList.remove("hidden");
  allOrdersViewEl.classList.add("hidden");
  navOrderBtn.classList.add("active");
  navAllOrdersBtn.classList.remove("active");
});

navAllOrdersBtn.addEventListener("click", function () {
  orderViewEl.classList.add("hidden");
  allOrdersViewEl.classList.remove("hidden");
  navAllOrdersBtn.classList.add("active");
  navOrderBtn.classList.remove("active");
});

// -----------------------------------------------
// 11. START A NEW ORDER (reset everything)
// -----------------------------------------------
newOrderBtn.addEventListener("click", function () {
  order = [];
  customerForm.reset();
  renderOrderSummary();

  document.querySelector(".menu-section").classList.remove("hidden");
  document.querySelector(".order-section").classList.remove("hidden");
  document.querySelector(".customer-section").classList.remove("hidden");
  confirmationSection.classList.add("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
});

// -----------------------------------------------
// 12. INITIALIZE THE PAGE
// -----------------------------------------------
renderPizzaMenu();
renderOrderSummary();
renderAllOrders();