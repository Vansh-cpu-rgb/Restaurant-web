let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

const cartItems = document.getElementById("cartItems");
const subtotal = document.getElementById("subtotal");
const grandTotal = document.getElementById("grandTotal");
const bottomTotal = document.getElementById("bottomTotal");

function saveCart() {
  localStorage.setItem(
    "foodCart",
    JSON.stringify(cart)
  );
}

function goBack() {
  window.location.href = "index.html";
}

function increaseQty(id) {

  const item = cart.find(
    p => p.id == id
  );

  if(item){

    item.qty++;

    saveCart();

    renderCart();

  }

}

function decreaseQty(id) {

  const item = cart.find(
    p => p.id == id
  );

  if(!item) return;

  if(item.qty > 1){

    item.qty--;

  }else{

    cart = cart.filter(
      p => p.id != id
    );

  }

  saveCart();

  renderCart();

}

function removeItem(id){

  cart = cart.filter(
    p => p.id != id
  );

  saveCart();

  renderCart();

}

function applyCoupon(){

  alert(
    "Coupon System Coming Soon 🔥"
  );

}

function goToAddress(){

  if(cart.length === 0){

    alert(
      "Your cart is empty 😅"
    );

    return;

  }

  window.location.href =
  "address.html";

}

function renderCart(){

  if(!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;

  if(cart.length === 0){

    cartItems.innerHTML = `

    <div class="empty-cart">

      <i class="fa-solid fa-cart-shopping"></i>

      <h2>Your Cart Is Empty</h2>

      <p>Add delicious food now 😋</p>

    </div>

    `;

    subtotal.innerText = "₹0";
    grandTotal.innerText = "₹0";
    bottomTotal.innerText = "₹0";

    return;

  }

  cart.forEach(item => {

    total += item.price * item.qty;

    cartItems.innerHTML += `

    <div class="cart-item">

      <img
      src="${item.image}"
      alt="${item.name}">

      <div class="cart-item-info">

        <h3>${item.name}</h3>

        <p>${item.desc || ""}</p>

        <div class="cart-price">

          ₹${item.price}

        </div>

        <div class="quantity-box">

          <button
          onclick="decreaseQty('${item.id}')">

          -

          </button>

          <span>

          ${item.qty}

          </span>

          <button
          onclick="increaseQty('${item.id}')">

          +

          </button>

        </div>

      </div>

      <button
      class="remove-btn"
      onclick="removeItem('${item.id}')">

      <i class="fa-solid fa-trash"></i>

      </button>

    </div>

    `;

  });

  const finalTotal =
  total + 50;

  subtotal.innerText =
  `₹${total}`;

  grandTotal.innerText =
  `₹${finalTotal}`;

  bottomTotal.innerText =
  `₹${finalTotal}`;

}

window.goBack = goBack;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.removeItem = removeItem;
window.applyCoupon = applyCoupon;
window.goToAddress = goToAddress;

renderCart();
window.addEventListener("load", () => {

  setTimeout(() => {

    const loader = document.querySelector(".loader");

    if(loader){
      loader.style.display = "none";
    }

  },1800);

});