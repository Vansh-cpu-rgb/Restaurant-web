// ==========================
// FIREBASE
// ==========================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================
// DOM
// ==========================

const productsContainer = document.getElementById("productsContainer");
const categoryTitle = document.getElementById("categoryTitle");
const searchInput = document.getElementById("searchInput");

// ==========================
// STATE
// ==========================

let allProducts = [];
let filteredProducts = [];

// ==========================
// CATEGORY FROM URL
// ==========================

const urlParams = new URLSearchParams(window.location.search);

const currentCategory =
urlParams.get("category") || "All";

categoryTitle.textContent = currentCategory;

// ==========================
// PAGE LOADER
// ==========================

function hideLoader(){

    const loader =
    document.querySelector(".page-loader");

    if(!loader) return;

    setTimeout(()=>{

        loader.style.opacity="0";
        loader.style.visibility="hidden";

    },500);

}

// ==========================
// LOAD PRODUCTS
// ==========================

async function loadProducts(){

    try{

        const snap =
        await getDocs(
            collection(db,"products")
        );

        allProducts=[];

        snap.forEach(doc=>{

            const data=doc.data();

            if(

                currentCategory==="All"

                ||

                (data.category||"")
                .toLowerCase()

                ===

                currentCategory.toLowerCase()

            ){

                allProducts.push({

                    id:doc.id,

                    name:data.name || "",

                    price:Number(data.price)||0,

                    image:data.image || "",

                    desc:data.description || "",

                    category:data.category || "",

                    rating:data.rating || "⭐ 4.5",

                    offer:data.offer || "Best Seller"

                });

            }

        });

        filteredProducts=[...allProducts];

        renderProducts();

        hideLoader();

    }

    catch(error){

        console.error(error);

    }

}
function renderProducts(){

    productsContainer.innerHTML="";

    if(filteredProducts.length===0){

        productsContainer.innerHTML=`

        <div class="empty-products">

            <i class="fa-solid fa-burger"></i>

            <h2>No Products Found</h2>

            <p>Please try another category.</p>

        </div>

        `;

        return;

    }

    filteredProducts.forEach(product=>{

        productsContainer.innerHTML+=`

        <div
        class="product-card fade-in"
        onclick="openPopup('${product.id}')">

            <div class="offer-tag">

                ${product.offer}

            </div>

            <img

            src="${product.image}"

            alt="${product.name}"

            loading="lazy"

            onload="this.classList.add('loaded')"

            >

            <div class="product-info">

                <h3>

                    ${product.name}

                </h3>

                <p class="product-desc">

                    ${product.desc}

                </p>

                <div class="price-rating">

                    <div class="product-price">

                        ₹${product.price}

                    </div>

                    <div class="product-rating">

                        ${product.rating}

                    </div>

                </div>

                <button

                class="add-cart-btn"

                onclick="event.stopPropagation();openPopup('${product.id}')">

                    Add To Cart

                </button>

            </div>

        </div>

        `;

    });

}
searchInput.addEventListener("input",()=>{

    const value=
    searchInput.value
    .toLowerCase()
    .trim();

    filteredProducts=

    allProducts.filter(product=>

        product.name
        .toLowerCase()
        .includes(value)

    );

    renderProducts();

});
loadProducts();
// ==========================
// POPUP ELEMENTS
// ==========================

const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const popupTitle = document.getElementById("popupTitle");
const popupDesc = document.getElementById("popupDesc");
const popupPrice = document.getElementById("popupPrice");
const popupBtn = document.getElementById("popupBtn");

let currentProduct = null;

// ==========================
// OPEN POPUP
// ==========================

window.openPopup = async function(productId){

    const product = allProducts.find(
        item => item.id === productId
    );

    if(!product) return;

    currentProduct = product;

    popup.style.display = "flex";

    popupImg.src = product.image;
    popupTitle.textContent = product.name;
    popupDesc.textContent = product.desc;
    popupPrice.textContent = product.price;

    await loadProductReviews(product.id);

}
// ==========================
// PRODUCT REVIEWS
// ==========================

async function loadProductReviews(productId){

    const reviewsBox =
    document.getElementById("productReviews");

    const avgBox =
    document.getElementById("productAverageRating");

    const countBox =
    document.getElementById("productReviewCount");

    if(!reviewsBox) return;

    reviewsBox.innerHTML="Loading Reviews...";

    const snap =
    await getDocs(
        collection(db,"reviews")
    );

    let reviews=[];

    snap.forEach(doc=>{

        const data=doc.data();

        if(data.productId===productId){

            reviews.push(data);

        }

    });

    countBox.textContent =
    reviews.length;

    if(reviews.length===0){

        avgBox.textContent="0.0";

        reviewsBox.innerHTML=`

        <div class="empty-review-box">

            <h4>No Reviews Yet ⭐</h4>

            <p>Be the first customer to review.</p>

        </div>

        `;

        return;

    }

    let total=0;

    reviews.forEach(r=>{

        total += Number(r.foodRating||0);

    });

    avgBox.textContent=
    (total/reviews.length).toFixed(1);

    reviewsBox.innerHTML="";

    reviews.slice(0,3).forEach(r=>{

        reviewsBox.innerHTML+=`

        <div class="review-card">

            <strong>

                ⭐ ${r.foodRating}

            </strong>

            <p>

                ${r.review}

            </p>

        </div>

        `;

    });

}
// ==========================
// CLOSE POPUP
// ==========================

window.closePopup=function(){

    popup.style.display="none";

}
popup.addEventListener("click",(e)=>{

    if(e.target===popup){

        closePopup();

    }

});
document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closePopup();

    }

});
// ==========================
// HOME CART CONNECTION
// ==========================

let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

// ==========================
// UPDATE CART UI
// ==========================

function updateFloatingCart() {

    cart = JSON.parse(localStorage.getItem("foodCart")) || [];

    const floatingCart = document.getElementById("floatingCart");

    if (!floatingCart) return;

    const totalPrice = document.getElementById("totalPrice");

    let items = 0;
    let total = 0;

    cart.forEach(item => {
        items += item.qty;
        total += item.price * item.qty;
    });

    if (items === 0) {
        floatingCart.style.display = "none";
        return;
    }

    floatingCart.style.display = "flex";

    if (totalPrice) {
        totalPrice.innerText = total;
    }

}

// ==========================
// ADD TO CART
// ==========================

popupBtn.onclick = function () {

    if (!currentProduct) return;

    let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

    const index = cart.findIndex(item => item.id === currentProduct.id);

    if (index !== -1) {

        cart[index].qty = (Number(cart[index].qty) || 1) + 1;

    } else {

        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            image: currentProduct.image,
            desc: currentProduct.desc,
            price: Number(currentProduct.price),
            qty: 1
        });

    }

    localStorage.setItem("foodCart", JSON.stringify(cart));

    updateFloatingCart();

    showToast(currentProduct.name + " Added 🛒");

    closePopup();

};

// ==========================
// VIEW CART
// ==========================

const floatingCart = document.getElementById("floatingCart");

if (floatingCart) {

    floatingCart.onclick = function () {

        window.location.href = "cart.html";

    };

}

// ==========================
// TOAST
// ==========================

function showToast(text) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = text;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}

// ==========================
// INITIAL
// ==========================

updateFloatingCart();
// ==========================
// REVIEW SECTION SAFETY
// ==========================

const reviewsBox = document.getElementById("productReviews");

if(reviewsBox){

    reviewsBox.innerHTML = "";

}

// ==========================
// IMAGE FALLBACK
// ==========================

document.addEventListener("error",(e)=>{

    if(e.target.tagName==="IMG"){

        e.target.src =
        "https://via.placeholder.com/300x220?text=Food";

    }

},true);

// ==========================
// PAGE ANIMATION
// ==========================

window.addEventListener("load",()=>{

    document.body.classList.add("fade-in");

});

// ==========================
// AUTO UPDATE CART
// ==========================

window.addEventListener("storage",()=>{

    updateFloatingCart();

});

// ==========================
// PRODUCT IMAGE EFFECT
// ==========================

document.addEventListener("load",(e)=>{

    if(e.target.tagName==="IMG"){

        e.target.classList.add("loaded");

    }

},true);

// ==========================
// SCROLL TO TOP ON SEARCH
// ==========================

searchInput.addEventListener("input",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

// ==========================
// READY
// ==========================

console.log("✅ Category Products V2 Loaded Successfully");