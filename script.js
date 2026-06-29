// ===============================
// LOADER
// ===============================

window.addEventListener("load", () => {

    setTimeout(() => {

        const loader = document.querySelector(".loader");
        const app = document.querySelector(".app");

        if (loader) loader.style.display = "none";
        if (app) app.style.display = "block";

    }, 1800);

});

// ===============================
// PRODUCTS
// ===============================

window.products = [];
window.productRatings = {};

let selectedCategory = "All";
let currentProduct = null;

// ===============================
// CART
// ===============================

let cart =
JSON.parse(localStorage.getItem("foodCart")) || [];

// ===============================
// DOM
// ===============================

const productsContainer =
document.getElementById("products");

const searchInput =
document.getElementById("searchInput");

const categoryBtns =
document.querySelectorAll(".category-btn");

const floatingCart =
document.getElementById("floatingCart");

const totalPrice =
document.getElementById("totalPrice");

const popup =
document.getElementById("popup");

const popupImg =
document.getElementById("popupImg");

const popupTitle =
document.getElementById("popupTitle");

const popupDesc =
document.getElementById("popupDesc");

const popupPrice =
document.getElementById("popupPrice");

const popupBtn =
document.getElementById("popupBtn");

// ===============================
// SAVE CART
// ===============================

function saveCart(){

    localStorage.setItem(
        "foodCart",
        JSON.stringify(cart)
    );

}

// ===============================
// LOAD CART
// ===============================

function loadCart(){

    cart =
    JSON.parse(
        localStorage.getItem("foodCart")
    ) || [];

}

// ===============================
// UPDATE FLOATING CART
// ===============================

function updateCart(){

    let total = 0;
    let totalItems = 0;

cart.forEach(item => {

    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 1;

    total += price * qty;
    totalItems += qty;

});

    if(totalPrice){
        totalPrice.innerText = total;
    }

    if(floatingCart){
        floatingCart.style.display = totalItems > 0 ? "flex" : "none";
    }

    saveCart();
}
function removeDuplicates(){

    const map = {};

    cart.forEach(item => {

        if(map[item.id]){
            map[item.id].qty += item.qty;
        } else {
            map[item.id] = item;
        }

    });

    cart = Object.values(map);

}
function normalizeCart(){

cart = cart.map(item => ({
id:item.id,
name:item.name,
image:item.image,
desc:item.desc,
price:Number(item.price)||0,
qty:Number(item.qty)||1
}));

}
// ===============================
// INITIAL CART
// ===============================

loadCart();
removeDuplicates();
normalizeCart();
updateCart();
// ===============================
// RENDER PRODUCTS
// ===============================

window.renderProducts = function () {

    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filteredProducts = window.products.filter(product => {

        const matchCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchSearch =
            product.name.toLowerCase().includes(searchText);

        return matchCategory && matchSearch;

    });

    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `
            <div class="empty-products">
                <i class="fa-solid fa-burger"></i>
                <h2>No Products Found</h2>
                <p>Try another search.</p>
            </div>
        `;

        return;

    }

    filteredProducts.forEach(product => {

        const rating =
            window.productRatings?.[product.id]?.average || "0.0";

        const totalReviews =
            window.productRatings?.[product.id]?.totalReviews || 0;

        const card = document.createElement("div");

        card.className = "food-card";

        card.innerHTML = `

            <img src="${product.image}" alt="${product.name}">

            <div class="food-info">

                <h3>${product.name}</h3>

                <div class="product-rating">

                    ⭐ ${rating}

                    <span>(${totalReviews} Reviews)</span>

                </div>

                <p>${product.desc}</p>

                <div class="food-bottom">

                    <span>₹${product.price}</span>

                    <button onclick="openPopup('${product.id}')">

                        Add

                    </button>

                </div>

            </div>

        `;

        productsContainer.appendChild(card);

    });

};

// ===============================
// CATEGORY FILTER
// ===============================

categoryBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        document
            .querySelector(".active-category")
            ?.classList.remove("active-category");

        btn.classList.add("active-category");

        selectedCategory = btn.dataset.category;

        renderProducts();

    });

});

// ===============================
// SEARCH
// ===============================

if (searchInput) {

    searchInput.addEventListener("input", renderProducts);

}

// ===============================
// LOAD RATINGS
// ===============================

if (window.loadAllRatings) {

    window.loadAllRatings().then(() => {

        renderProducts();

    });

} else {

    renderProducts();

}
// ===============================
// OPEN POPUP
// ===============================

window.openPopup = function(id){

    const product = window.products.find(item => item.id == id);

    if(!product) return;

    currentProduct = product;

    popup.style.display = "flex";

    popupImg.src = product.image;

    popupTitle.innerText = product.name;

    popupDesc.innerText = product.desc;

    popupPrice.innerText = `₹${product.price}`;

    // Reset Favourite
    const favoriteBtn =
    document.getElementById("favoriteBtn");

    if(favoriteBtn){

        favoriteBtn.innerHTML =
        '<i class="fa-regular fa-heart"></i>';

    }

    // Favourite Check
    if(window.checkFavorite){

        window.checkFavorite(product.id);

    }

    // Reviews Load
    if(window.loadProductReviews){

        window.loadProductReviews(product.id);

    }
    const view3DBtn =
document.getElementById("view3DBtn");

if(product.model3D){

view3DBtn.style.display = "flex";

}else{

view3DBtn.style.display = "none";

}
view3DBtn.onclick = () => {

localStorage.setItem(
"current3DModel",
currentProduct.model3D
);

localStorage.setItem(
"current3DName",
currentProduct.name
);

window.location.href = "view3d.html";

};

};

// ===============================
// CLOSE POPUP
// ===============================

window.closePopup = function(){

    popup.style.display = "none";

};

// ===============================
// ADD TO CART
// ===============================

function addToCart(){

    if(!currentProduct) return;

    const existing =
    cart.find(item => item.id === currentProduct.id);

    if(existing){

        existing.qty++;

    }else{

        cart.push({

            id: currentProduct.id,
            name: currentProduct.name,
            image: currentProduct.image,
            desc: currentProduct.desc,
            price: currentProduct.price,
            qty:1

        });

    }

    updateCart();

    showToast(
        currentProduct.name + " Added To Cart 🛒"
    );

    closePopup();

}

// ===============================
// POPUP BUTTON
// ===============================

popupBtn.onclick = addToCart;

// ===============================
// CLOSE POPUP OUTSIDE
// ===============================

popup.addEventListener("click",(e)=>{

    if(e.target===popup){

        closePopup();

    }

});

// ===============================
// ESC KEY
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closePopup();

    }

});

// ===============================
// TOAST
// ===============================

function showToast(message){

    const toast =
    document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },2000);

}
// ===============================
// OPEN CART
// ===============================

window.openCart = function(){

    window.location.href = "cart.html";

};

// ===============================
// GO HOME
// ===============================

window.goHome = function(){

    window.location.href = "index.html";

};

// ===============================
// GO ORDERS
// ===============================

window.goToOrders = function(){

    window.location.href = "orders.html";

};

// ===============================
// PAGE LOADER
// ===============================

window.openPage = function(page){

    window.location.href = page;

};

// ===============================
// LOGIN POPUP
// ===============================

window.addEventListener("load",()=>{

    const showLogin =
    localStorage.getItem("showLogin");

    if(showLogin==="true"){

        const loginOverlay =
        document.getElementById("loginOverlay");

        if(loginOverlay){

            loginOverlay.style.display="flex";

        }

        localStorage.removeItem("showLogin");

    }

});

console.log("✅ Home Script Loaded Successfully");
window.addEventListener("load", () => {
    setTimeout(() => {
        if (window.renderProducts) {
            window.renderProducts();
        }
    }, 500);
});