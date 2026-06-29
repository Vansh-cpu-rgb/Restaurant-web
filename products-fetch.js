import { db } from "./firebase.js";

import {
getDocs,
collection
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadFirebaseProducts(){

const snap =
await getDocs(
collection(db,"products")
);

window.firebaseProducts = [];

snap.forEach((doc)=>{

const data = doc.data();

window.firebaseProducts.push({

id: doc.id,

name: data.name,

category: data.category,

price: Number(data.price),

image: data.image,

desc: data.description,

model3D: data.model3D || ""

});

});

console.log(
window.firebaseProducts
);

}

loadFirebaseProducts();
async function syncProducts(){

const snap =
await getDocs(
collection(db,"products")
);

window.products = [];

snap.forEach((productDoc)=>{

const data =
productDoc.data();

window.products.push({

id: productDoc.id,

name: data.name,

category: data.category,

price: Number(data.price),

image: data.image,

desc: data.description,

model3D: data.model3D || ""

});
});

console.log(
"Firebase Products:",
window.products
);

if(window.renderProducts){

window.renderProducts();

}

}

syncProducts();
setTimeout(()=>{

if(window.renderProducts){

window.renderProducts();

}

},1000);