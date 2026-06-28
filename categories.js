import { db } from "./firebase.js";

import {
collection,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM

const categoriesGrid =
document.getElementById("categoriesGrid");

const searchInput =
document.getElementById("searchInput");

// STATE

let allProducts = [];

let categories = [];

// CATEGORY IMAGES

const categoryImages = {

Pizza:
"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",

Burger:
"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",

Pasta:
"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",

Biryani:
"https://images.unsplash.com/photo-1633945274309-2c16c9682a8d?w=800",

Drinks:
"https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800",

Dessert:
"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800"

};

// LOADER

window.addEventListener("load",()=>{

const loader =
document.querySelector(".page-loader");

setTimeout(()=>{

loader.style.opacity="0";

loader.style.visibility="hidden";

},700);

});

// FIREBASE

onSnapshot(

collection(db,"products"),

(snapshot)=>{

allProducts=[];

snapshot.forEach(doc=>{

allProducts.push({

id:doc.id,

...doc.data()

});

});

buildCategories();

}

);

// BUILD CATEGORY LIST

function buildCategories(){

const map={};

allProducts.forEach(product=>{

const name=
product.category || "Others";

if(!map[name]){

map[name]=0;

}

map[name]++;

});

categories=

Object.keys(map).map(name=>({

name,

count:map[name]

}));

renderCategories();

}

// RENDER

function renderCategories(){

const keyword=

searchInput.value

.toLowerCase()

.trim();

categoriesGrid.innerHTML="";

const filtered=

categories.filter(cat=>

cat.name

.toLowerCase()

.includes(keyword)

);

if(filtered.length===0){

categoriesGrid.innerHTML=`

<div class="empty-category">

<i class="fa-solid fa-face-frown"></i>

<h2>

No Category Found

</h2>

<p>

Try another search

</p>

</div>

`;

return;

}

filtered.forEach(cat=>{

const image=

categoryImages[cat.name]

||

"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800";

categoriesGrid.innerHTML+=`

<div

class="category-card fade-in"

onclick="openCategory('${cat.name}')"

>

<img

src="${image}"

alt="${cat.name}">

<div class="category-overlay">

<div class="category-name">

${cat.name}

</div>

<div class="category-count">

<i class="fa-solid fa-utensils"></i>

${cat.count} Items

</div>

</div>

</div>

`;

});

}

// SEARCH

searchInput.addEventListener(

"input",

renderCategories

);

// OPEN CATEGORY

window.openCategory=

function(category){

window.location.href=

`category-products.html?category=${encodeURIComponent(category)}`;

}