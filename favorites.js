console.log("Favorites JS Loaded");
import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

  if(user){

    currentUser = user;

    console.log("User Logged In 🔥");

  }

});
const favoriteBtn =
document.getElementById("favoriteBtn");

favoriteBtn.addEventListener("click", async ()=>{

  if(!currentUser){

    alert("Please Login First 😅");
    return;

  }

  const product =
    window.currentProduct;

  if(!product){

    alert("Product not found");
    return;

  }

const q = query(
  collection(db,"favorites"),
  where("userId","==",currentUser.uid),
  where("productId","==",product.id)
);

const snapshot =
  await getDocs(q);

if(!snapshot.empty){

  const favDoc =
    snapshot.docs[0];

  await deleteDoc(favDoc.ref);

  favoriteBtn.innerHTML =
    '<i class="fa-regular fa-heart"></i>';
    favoriteBtn.style.transform = "scale(0.85)";

setTimeout(()=>{
  favoriteBtn.style.transform = "scale(1)";
},200);

}else{

  await addDoc(
    collection(db,"favorites"),
    {
      userId: currentUser.uid,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      restaurantId: "rest_1782542247610",
      createdAt: Date.now()
    }
  );

  favoriteBtn.innerHTML =
    '<i class="fa-solid fa-heart"></i>';
    favoriteBtn.style.transform = "scale(1.2)";

setTimeout(()=>{
  favoriteBtn.style.transform = "scale(1)";
},200);

}
});

window.checkFavorite = async function(productId){

  if(!currentUser) return;

  const q = query(
    collection(db,"favorites"),
    where("userId","==",currentUser.uid),
    where("productId","==",productId)
  );

  const snapshot =
    await getDocs(q);

  const favoriteBtn =
    document.getElementById("favoriteBtn");

  if(snapshot.empty){

    favoriteBtn.innerHTML =
      '<i class="fa-regular fa-heart"></i>';

  }else{

    favoriteBtn.innerHTML =
      '<i class="fa-solid fa-heart"></i>';

  }

};
window.checkFavorite = async function(productId){

  const favoriteBtn =
    document.getElementById("favoriteBtn");

  favoriteBtn.innerHTML =
    '<i class="fa-regular fa-heart"></i>';

  if(!currentUser) return;

  const q = query(
    collection(db,"favorites"),
    where("userId","==",currentUser.uid),
    where("productId","==",productId)
  );

  const snapshot =
    await getDocs(q);

  if(snapshot.empty){

    favoriteBtn.innerHTML =
      '<i class="fa-regular fa-heart"></i>';

  }else{

    favoriteBtn.innerHTML =
      '<i class="fa-solid fa-heart"></i>';

  }

};