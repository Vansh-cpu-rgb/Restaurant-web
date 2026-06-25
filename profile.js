import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("PROFILE JS LOADED 🔥");

onAuthStateChanged(auth,(user)=>{

  console.log("USER DATA:", user);

  if(user){

    document.getElementById("userName").innerText =
      user.displayName || "FoodExpress User";

    document.getElementById("userEmail").innerText =
      user.email;

    if(user.photoURL){

      document.getElementById("profilePhoto").src =
        user.photoURL;

    }

  }else{

    console.log("NO USER FOUND ❌");

  }

}); // ← YE IMPORTANT HAI

function openPage(page){

  document.querySelector(".page-loader").style.visibility = "visible";
  document.querySelector(".page-loader").style.opacity = "1";

  setTimeout(()=>{
    window.location.href = page;
  },500);

}

window.addEventListener("load", () => {

  const loader = document.querySelector(".page-loader");

  if(!loader) return;

  setTimeout(() => {

loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }, 1500);

});
// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

  logoutBtn.addEventListener("click", async () => {

    try{

await signOut(auth);

localStorage.removeItem("user");

localStorage.setItem("showLogin", "true");

window.location.href = "index.html";

    }catch(error){

      console.log("Logout Error:", error);

    }

  });

}
window.addEventListener("load", () => {

  const showLogin = localStorage.getItem("showLogin");

  if(showLogin === "true") {

    document.getElementById("loginOverlay").style.display = "flex";

    localStorage.removeItem("showLogin");

  }

});