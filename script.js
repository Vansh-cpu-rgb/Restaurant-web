// LOADER

window.addEventListener("load", () => {

  setTimeout(() => {

    document.querySelector(".loader").style.display = "none";

    document.querySelector(".app").style.display = "block";

  }, 1800);

});

// PRODUCTS DATA

// PRODUCTS DATA

window.products = [];

// GLOBALS

let cart = [];

let selectedCategory = "All";

// DOM

const productsContainer = document.getElementById("products");

const searchInput = document.getElementById("searchInput");

const categoryBtns = document.querySelectorAll(".category-btn");

const floatingCart = document.getElementById("floatingCart");

const totalPrice = document.getElementById("totalPrice");

const popup = document.getElementById("popup");

const popupImg = document.getElementById("popupImg");

const popupTitle = document.getElementById("popupTitle");

const popupDesc = document.getElementById("popupDesc");

const popupPrice = document.getElementById("popupPrice");

const popupBtn = document.getElementById("popupBtn");

// RENDER PRODUCTS

window.renderProducts = function() {

if(!window.products){

return;

}

productsContainer.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

console.log(window.products.length);
console.log(
"Rendering Products:",
window.products
);
const filteredProducts =
window.products.filter((item) => {

    const matchCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const matchSearch =
      item.name.toLowerCase().includes(searchText);

    return matchCategory && matchSearch;

  });
console.log("Filtered:", filteredProducts);
  filteredProducts.forEach((item) => {

    const card = document.createElement("div");

    card.classList.add("food-card");

    card.innerHTML = `

      <img src="${item.image}" />

      <div class="food-info">

<h3>${item.name}</h3>

<div class="product-rating">

  ⭐ ${
    window.productRatings?.[item.id]?.average
    || "0.0"
  }

  <span>

    (${
      window.productRatings?.[item.id]
      ?.totalReviews || 0
    } Reviews)

  </span>

</div>

<p>${item.desc}</p>

        <div class="food-bottom">

          <span>₹${item.price}</span>

<button onclick="openPopup('${item.id}')">

            Add

          </button>

        </div>

      </div>

    `;

    productsContainer.appendChild(card);

  });

}

// CATEGORY FILTER

categoryBtns.forEach((btn) => {

  btn.addEventListener("click", () => {

    document
      .querySelector(".active-category")
      ?.classList.remove("active-category");

    btn.classList.add("active-category");

    selectedCategory = btn.dataset.category;

    renderProducts();

  });

});

// SEARCH

searchInput.addEventListener("input", renderProducts);

// OPEN POPUP

function openPopup(id) {

const product =
window.products.find((item) => item.id == id);

  window.currentProduct = product;

  popup.style.display = "flex";

  popupImg.src = product.image;

  popupTitle.innerText = product.name;

  popupDesc.innerText = product.desc;

  popupPrice.innerText = `₹${product.price}`;

// HEART RESET
const favoriteBtn =
document.getElementById("favoriteBtn");

if(favoriteBtn){

favoriteBtn.innerHTML =
'<i class="fa-regular fa-heart"></i>';

}

// FIREBASE CHECK
if(window.checkFavorite){

  window.checkFavorite(product.id);

}

// LOAD REVIEWS
if(window.loadProductReviews){

  window.loadProductReviews(product.id);

}

  popupBtn.onclick = () => {

    addToCart(id);

    closePopup();

  };

}
// CLOSE POPUP

function closePopup() {

  popup.style.display = "none";

}

// ADD TO CART

function addToCart(id) {

const product = window.products.find((item) => item.id == id);

  const existing = cart.find((item) => item.id === id);

  if(existing){

    existing.qty += 1;

  }else{

    cart.push({

      ...product,

      qty:1,

    });

  }

  updateCart();

  showToast(`${product.name} added to cart`);

}

// UPDATE CART

function updateCart() {

  let total = 0;

  let totalItems = 0;

  cart.forEach((item) => {

    total += item.price * item.qty;

    totalItems += item.qty;

  });

  totalPrice.innerText = total;

  if(totalItems > 0){

    floatingCart.style.display = "flex";

  }else{

    floatingCart.style.display = "none";

  }

}

// OPEN CART

function openCart(){

  let cartItems = "";

  cart.forEach((item)=>{

    cartItems += `
    
      ${item.name} x ${item.qty}
    
    `;

  });

  alert(

    `Cart Items:\n\n${cartItems}\n\nTotal ${totalPrice.innerText}`

  );

}

// TOAST

function showToast(message){

  const toast = document.createElement("div");

  toast.classList.add("toast");

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(()=>{

    toast.remove();

  },2000);

}

// INITIAL

if(window.loadAllRatings){

  window.loadAllRatings()
  .then(()=>{

    console.log(
      "Ratings Loaded",
      window.productRatings
    );

    renderProducts();

  });

}else{

  renderProducts();

}
// SAVE CART

function saveCart(){

  localStorage.setItem(

    "foodCart",

    JSON.stringify(cart)

  );

}

// LOAD CART

function loadCart(){

  const savedCart = localStorage.getItem("foodCart");

  if(savedCart){

    cart = JSON.parse(savedCart);

    updateCart();

  }

}

loadCart();

// OPEN CART PAGE

function openCart(){

  window.location.href = "cart.html";

}

// GO BACK

function goBack(){

  window.location.href = "index.html";

}

// RENDER CART PAGE

function renderCartPage(){

  const cartItems = document.getElementById("cartItems");

  const subtotal = document.getElementById("subtotal");

  const grandTotal = document.getElementById("grandTotal");

  if(!cartItems) return;

  cartItems.innerHTML = "";

  if(cart.length === 0){

    cartItems.innerHTML = `

      <div class="empty-cart">

        <i class="fa-solid fa-cart-shopping"></i>

        <h2>Your cart is empty</h2>

        <p>Add delicious food now ðŸ˜„</p>

      </div>

    `;

    subtotal.innerText = "â‚¹0";

    grandTotal.innerText = "â‚¹0";

    return;

  }

  let total = 0;

  cart.forEach((item)=>{

    total += item.price * item.qty;

    const div = document.createElement("div");

    div.classList.add("cart-item");

    div.innerHTML = `

      <img src="${item.image}" />

      <div class="cart-item-info">

        <h3>${item.name}</h3>

        <p>${item.desc}</p>

        <span class="cart-price">

          ₹${item.price}

        </span>

        <div class="quantity-box">

          <button onclick="decreaseQty(${item.id})">

            -

          </button>

          <span>${item.qty}</span>

          <button onclick="increaseQty(${item.id})">

            +

          </button>

        </div>

      </div>

      <button class="remove-btn"

        onclick="removeItem(${item.id})">

        <i class="fa-solid fa-trash"></i>

      </button>

    `;

    cartItems.appendChild(div);

  });

  subtotal.innerText = `₹${total}`;

  grandTotal.innerText = `₹${total + 40}`;

}

// INCREASE QTY

function increaseQty(id){

  const item = cart.find((i)=>i.id === id);

  item.qty += 1;

  saveCart();

  renderCartPage();

  updateCart();

}

// DECREASE QTY

function decreaseQty(id){

  const item = cart.find((i)=>i.id === id);

  if(item.qty > 1){

    item.qty -= 1;

  }else{

    cart = cart.filter((i)=>i.id !== id);

  }

  saveCart();

  renderCartPage();

  updateCart();

}

// REMOVE ITEM

function removeItem(id){

  cart = cart.filter((i)=>i.id !== id);

  saveCart();

  renderCartPage();

  updateCart();

}

// UPDATE CART

function updateCart(){

  let total = 0;

  let totalItems = 0;

  cart.forEach((item)=>{

    total += item.price * item.qty;

    totalItems += item.qty;

  });

  totalPrice.innerText = total;

  if(totalItems > 0){

    floatingCart.style.display = "flex";

  }else{

    floatingCart.style.display = "none";

  }

  saveCart();

}

// PLACE ORDER

const placeOrderBtn = document.querySelector(".place-order-btn");

if(placeOrderBtn){

  placeOrderBtn.addEventListener("click",()=>{

    alert(

      "ðŸŽ‰ Order Placed Successfully!"

    );

    cart = [];

    saveCart();

    renderCartPage();

    updateCart();

  });

}

// INITIAL

renderCartPage();
// PAYMENT OPTION SELECT

const paymentOptions = document.querySelectorAll(".payment-option");

paymentOptions.forEach((option)=>{

  option.addEventListener("click",()=>{

    document
      .querySelector(".active-payment")
      ?.classList.remove("active-payment");

    option.classList.add("active-payment");

  });

});

// SUCCESS POPUP

const successPopup = document.getElementById("successPopup");

// PLACE ORDER BUTTON

const placeBtn = document.querySelector(".place-order-btn");

if(placeBtn){

  placeBtn.addEventListener("click",()=>{

    if(cart.length === 0){

      alert("Your cart is empty ðŸ˜„");

      return;

    }

    successPopup.style.display = "flex";

    cart = [];

    saveCart();

    renderCartPage();

    updateCart();

  });

}

// BACK HOME

function goHome(){

  window.location.href = "index.html";

}

// UPDATED RENDER CART PAGE

function renderCartPage(){

  const cartItems = document.getElementById("cartItems");

  const subtotal = document.getElementById("subtotal");

  const grandTotal = document.getElementById("grandTotal");

  if(!cartItems) return;

  cartItems.innerHTML = "";

  // EMPTY CART

  if(cart.length === 0){

    cartItems.innerHTML = `

      <div class="empty-cart">

        <i class="fa-solid fa-cart-shopping"></i>

        <h2>Your cart is empty</h2>

        <p>Add delicious food now ðŸ˜„</p>

      </div>

    `;

    subtotal.innerText = "â‚¹0";

    grandTotal.innerText = "â‚¹0";

    return;

  }

  let total = 0;

  cart.forEach((item)=>{

    total += item.price * item.qty;

    const div = document.createElement("div");

    div.classList.add("cart-item");

    div.innerHTML = `

      <img src="${item.image}" />

      <div class="cart-item-info">

        <h3>${item.name}</h3>

        <p>${item.desc}</p>

        <div class="cart-price">

          â‚¹${item.price}

        </div>

        <div class="quantity-box">

          <button onclick="decreaseQty(${item.id})">

            -

          </button>

          <span>${item.qty}</span>

          <button onclick="increaseQty(${item.id})">

            +

          </button>

        </div>

      </div>

      <button class="remove-btn"

        onclick="removeItem(${item.id})">

        <i class="fa-solid fa-trash"></i>

      </button>

    `;

    cartItems.appendChild(div);

  });

  subtotal.innerText = `â‚¹${total}`;

  grandTotal.innerText = `â‚¹${total + 40}`;

}

// SAVE CART

function saveCart(){

  localStorage.setItem(

    "foodCart",

    JSON.stringify(cart)

  );

}

// LOAD CART

function loadCart(){

  const savedCart = localStorage.getItem("foodCart");

  if(savedCart){

    cart = JSON.parse(savedCart);

  }

}

loadCart();

// UPDATE CART

function updateCart(){

  let total = 0;

  let totalItems = 0;

  cart.forEach((item)=>{

    total += item.price * item.qty;

    totalItems += item.qty;

  });

  if(totalPrice){

    totalPrice.innerText = total;
  }

  if(floatingCart){

    if(totalItems > 0){

      floatingCart.style.display = "flex";

    }else{

      floatingCart.style.display = "none";

    }

  }

  saveCart();

}

// INCREASE QTY

function increaseQty(id){

  const item = cart.find((i)=>i.id === id);

  item.qty += 1;

  saveCart();

  renderCartPage();

  updateCart();

}

// DECREASE QTY

function decreaseQty(id){

  const item = cart.find((i)=>i.id === id);

  if(item.qty > 1){

    item.qty -= 1;

  }else{

    cart = cart.filter((i)=>i.id !== id);

  }

  saveCart();

  renderCartPage();

  updateCart();

}

// REMOVE ITEM

function removeItem(id){

  cart = cart.filter((i)=>i.id !== id);

  saveCart();

  renderCartPage();

  updateCart();

}

// INITIAL

renderCartPage();

updateCart();
// GO TO ORDERS

function goToOrders(){

  window.location.href =
    "orders.html";

}
window.addEventListener("load", ()=>{

    const loader = document.querySelector(".page-loader");

    if(loader){

        setTimeout(()=>{

            loader.style.opacity = "0";
            loader.style.visibility = "hidden";

        },800);

    }

});
function openPage(page){

    document.querySelector(".page-loader").style.visibility="visible";
    document.querySelector(".page-loader").style.opacity="1";

    setTimeout(()=>{
        window.location.href = page;
    },500);

}
function openPage(page){

    window.location.href = page;

}
window.addEventListener("load", () => {

  const showLogin = localStorage.getItem("showLogin");

  if(showLogin === "true") {

    const loginOverlay =
      document.getElementById("loginOverlay");

    if(loginOverlay){

      loginOverlay.style.display = "flex";

    }

    localStorage.removeItem("showLogin");

  }

});

window.addEventListener("load", () => {

  const showLogin = localStorage.getItem("showLogin");

  if(showLogin === "true") {

    const loginOverlay =
      document.getElementById("loginOverlay");

    if(loginOverlay){

      loginOverlay.style.display = "flex";

    }

    localStorage.removeItem("showLogin");

  }

});
async function loadProductReviews(productId){

  const reviewsBox =
    document.getElementById(
      "productReviews"
    );

  const avgBox =
    document.getElementById(
      "productAverageRating"
    );

  const countBox =
    document.getElementById(
      "productReviewCount"
    );

}
async function loadProductReviews(productId){

  const reviewsBox =
  document.getElementById(
    "productReviews"
  );

  const avgBox =
  document.getElementById(
    "productAverageRating"
  );

  const countBox =
  document.getElementById(
    "productReviewCount"
  );

  reviewsBox.innerHTML =
  "Loading reviews...";

  const snap =
  await getDocs(
    collection(db,"reviews")
  );

  let reviews = [];

  snap.forEach((doc)=>{

    const data = doc.data();

    if(
      data.productId === productId
    ){

      reviews.push(data);

    }

  });

  countBox.innerText =
  reviews.length;

  if(reviews.length === 0){

    avgBox.innerText = "0.0";

    reviewsBox.innerHTML =

    `
      <p>
      No Reviews Yet 😅
      </p>
    `;

    return;

  }

  let total = 0;

  reviews.forEach((r)=>{

    total +=
    r.foodRating;

  });

  avgBox.innerText =

  (
    total /
    reviews.length
  ).toFixed(1);

  reviewsBox.innerHTML = "";

  reviews
  .slice(-3)
  .reverse()
  .forEach((r)=>{

    reviewsBox.innerHTML +=

    `
      <div class="review-card">

        <div>
          ⭐ ${r.foodRating}
        </div>

        <p>
          ${r.review}
        </p>

      </div>
    `;

  });

}