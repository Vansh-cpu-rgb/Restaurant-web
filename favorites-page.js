console.log("Favorites Page Loaded 🔥");

import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const favoritesContainer = document.getElementById("favoritesContainer");
const favoriteTitle = document.getElementById("favoriteTitle");
const loader = document.querySelector(".page-loader");

// ================= TOAST =================
function showToast(message){
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },2000);
}

// ================= HIDE LOADER =================
function hideLoader(){
  if(loader){
    loader.style.opacity = "0";
    setTimeout(()=>{
      loader.style.display = "none";
    },500);
  }
}

// ================= MAIN =================
onAuthStateChanged(auth, async(user)=>{

  try {

    if(!user){
      favoritesContainer.innerHTML = "<h3>Please login first</h3>";
      hideLoader();
      return;
    }

    const q = query(
      collection(db,"favorites"),
      where("userId","==",user.uid)
    );

    const snapshot = await getDocs(q);

    let favoriteCount = snapshot.size;

    favoriteTitle.innerText =
      `❤️ My Favorites (${favoriteCount})`;

    // EMPTY STATE
    if(snapshot.empty){
      favoritesContainer.innerHTML = `
        <div class="empty-box">
          <h3>💔 No Favorites Yet</h3>
          <p>Save your favorite foods here</p>
          <button onclick="window.location.href='index.html'"
          style="padding:12px;border:none;border-radius:10px;background:#ff7a00;color:white;">
            Browse Foods 🍔
          </button>
        </div>
      `;
      hideLoader();
      return;
    }

    favoritesContainer.innerHTML = "";

    const favorites = snapshot.docs.sort(
      (a,b)=> b.data().createdAt - a.data().createdAt
    );

    favorites.forEach((docSnap)=>{

      const fav = docSnap.data();

      const card = document.createElement("div");
      card.classList.add("favorite-card");

      card.innerHTML = `
        <img src="${fav.image}">
        <h3>${fav.name}</h3>
        <p>₹${fav.price}</p>

        <p class="favDate">
          ❤️ Added On: ${
            new Date(
              fav.createdAt?.seconds
                ? fav.createdAt.seconds * 1000
                : fav.createdAt
            ).toLocaleDateString()
          }
        </p>

        <button class="cartBtn">Add To Cart 🛒</button>
        <button class="removeBtn">Remove ❤️</button>
      `;

      // ================= CART =================
      card.querySelector(".cartBtn").addEventListener("click",()=>{

        let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

        const existing = cart.find(item => item.id === fav.productId);

        if(existing){
          existing.qty += 1;
        } else {
          cart.push({
            id: fav.productId,
            name: fav.name,
            price: fav.price,
            image: fav.image,
            qty: 1
          });
        }

        localStorage.setItem("foodCart", JSON.stringify(cart));
        showToast("Added To Cart 🛒");
      });

      // ================= REMOVE =================
      card.querySelector(".removeBtn").addEventListener("click", async()=>{

        await deleteDoc(doc(db, "favorites", docSnap.id));

        card.remove();
showToast("Removed From Favorites ❤️");
        favoriteCount--;

        favoriteTitle.innerText =
          `❤️ My Favorites (${favoriteCount})`;

        if(favoriteCount <= 0){
favoritesContainer.innerHTML = `
  <div class="empty-box">
    <h3>💔 No Favorites Yet</h3>
    <p>Save your favorite foods here</p>

    <button
      onclick="window.location.href='index.html'"
      style="
        padding:12px 20px;
        border:none;
        border-radius:12px;
        background:#ff7a00;
        color:white;
        font-weight:bold;
        cursor:pointer;
      ">
      Browse Foods 🍔
    </button>
  </div>
`;
        }
      });

      favoritesContainer.appendChild(card);
    });

  } catch(error){
    console.log("Error:", error);
    favoritesContainer.innerHTML = "<h3>Error loading favorites</h3>";
  }

  hideLoader();
});

// ================= LOADER SAFETY =================
window.addEventListener("load",()=>{
  setTimeout(hideLoader, 800);
});