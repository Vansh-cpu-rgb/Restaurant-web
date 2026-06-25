// PAGE LOADER

window.addEventListener("load", ()=>{

const loader = document.querySelector(".page-loader");  

setTimeout(()=>{  

    loader.style.opacity = "0";  
    loader.style.visibility = "hidden";  

},800);

});
const toast = document.getElementById("toast");

// PRODUCTS DATA

const products = [

{
name:"Cheese Pizza",
category:"pizza",
price:"₹249",
rating:"4.8⭐",
image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800",
offer:"20% OFF"
},

{
name:"Veg Burger",
category:"burger",
price:"₹149",
rating:"4.6⭐",
image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
offer:"Best Seller"
},

{
name:"Chicken Biryani",
category:"biryani",
price:"₹299",
rating:"4.9⭐",
image:"https://images.unsplash.com/photo-1633945274309-2c16c9682a8d?q=80&w=800",
offer:"Hot Deal"
},

{
name:"Cold Drink",
category:"drinks",
price:"₹99",
rating:"4.4⭐",
image:"https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800",
offer:"Refreshing"
},

{
name:"Chocolate Cake",
category:"dessert",
price:"₹199",
rating:"4.7⭐",
image:"https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800",
offer:"Sweet Treat"
},

{
name:"Farmhouse Pizza",
category:"pizza",
price:"₹349",
rating:"4.9⭐",
image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800",
offer:"Cheesy"
}

];

const productsContainer = document.getElementById("productsContainer");
const categoryCards = document.querySelectorAll(".category-card");
const searchInput = document.getElementById("searchInput");

// DISPLAY PRODUCTS

function displayProducts(items){

productsContainer.innerHTML = "";  

if(items.length === 0){  

    productsContainer.innerHTML = `  
        <h2>No food found 😔</h2>  
    `;  

    return;  
}  

items.forEach(product => {  

    productsContainer.innerHTML += `  
    <div class="product-card">  

        <div class="offer-tag">${product.offer}</div>  

        <img src="${product.image}" alt="${product.name}">  

        <div class="product-info">  
            <h3>${product.name}</h3>  

            <div class="price-rating">  
                <span>${product.price}</span>  
                <span>${product.rating}</span>  
            </div>  

            <button class="add-cart-btn">  
                Add To Cart 🛒  
            </button>  
        </div>  

    </div>  
    `;  

});

}

// DEFAULT PRODUCTS

displayProducts(products);

// CATEGORY FILTER

categoryCards.forEach(card => {

card.addEventListener("click", ()=>{  

    document.querySelector(".category-card.active")  
    .classList.remove("active");  

    card.classList.add("active");  

    const category = card.dataset.category;  

    if(category === "all"){  
        displayProducts(products);  
    }  
    else{  

        const filteredProducts = products.filter(product =>  
            product.category === category  
        );  

        displayProducts(filteredProducts);  
    }  

});

});

// SEARCH FILTER

searchInput.addEventListener("keyup", ()=>{

const searchValue = searchInput.value.toLowerCase();  

const filteredProducts = products.filter(product =>  
    product.name.toLowerCase().includes(searchValue)  
);  

displayProducts(filteredProducts);

});

// REAL ADD TO CART SYSTEM

let cart =
JSON.parse(localStorage.getItem("foodCart")) || [];

let cartItems = cart.length;

let cartPrice = 0;

cart.forEach(item => {
    cartPrice += item.price;
});

const cartCount =
document.getElementById("cartCount");

const cartTotal =
document.getElementById("cartTotal");

updateCartUI();

// ADD TO CART

document.addEventListener("click", function(e){

if(e.target.classList.contains("add-cart-btn")){  

    const productCard =  
    e.target.closest(".product-card");  

    const name =  
    productCard.querySelector("h3").innerText;  

    const priceText =  
    productCard.querySelector(".price-rating span")  
    .innerText;  

    const image =  
    productCard.querySelector("img").src;  

    const price =  
    parseInt(priceText.replace("₹",""));  

    const product = {  

        name:name,  
        price:price,  
        image:image  

    };  

    cart.push(product);

cartItems++;
cartPrice += price;

saveCart();
updateCartUI();

// TOAST  

    toast.classList.add("show");  

    setTimeout(()=>{  

        toast.classList.remove("show");  

    },2000);  

}

});
function saveCart(){

    localStorage.setItem(
        "foodCart",
        JSON.stringify(cart)
    );

}

// UPDATE CART UI

function updateCartUI(){

cartCount.innerText =  
`${cartItems} Items`;  

cartTotal.innerText =  
`₹${cartPrice}`;

}

// VIEW CART BUTTON

document.querySelector(".floating-cart button")
.addEventListener("click", ()=>{

window.location.href = "cart.html";

});