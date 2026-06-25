import { auth, db } from "./firebase.js";

import {
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// GO BACK

function goBack(){

  window.location.href = "address.html";

}

// LOAD TOTAL

const paymentTotal =
  document.getElementById("paymentTotal");

let cart =
  JSON.parse(localStorage.getItem("foodCart")) || [];

let total = 0;

cart.forEach((item)=>{

  total += item.price * item.qty;

});

total += 50;

paymentTotal.innerText = `₹${total}`;

// PAYMENT SELECT

function selectPayment(element){

  const allOptions =
    document.querySelectorAll(".payment-option");

  allOptions.forEach((option)=>{

    option.classList.remove("active-payment");

  });

  element.classList.add("active-payment");

}

// PLACE ORDER

async function placeOrder(){

  if(cart.length === 0){

    alert("Cart is empty 😅");

    return;

  }

  const payBtn =
    document.getElementById("payBtn");

  const payBtnText =
    document.getElementById("payBtnText");

  // LOADING

  payBtnText.innerHTML =
    `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

  payBtn.disabled = true;

  // FAKE PAYMENT DELAY

setTimeout(async ()=>{

    // SAVE ORDER

const user = auth.currentUser;

const addressData =
  JSON.parse(localStorage.getItem("foodAddress")) || {};

const orderData = {

  userId: user.uid,

  userName:
    user.displayName || "FoodExpress User",

  userEmail:
    user.email,

  items: cart,

  address: addressData,

  total: total,

  status: "Pending",

  orderTime:
    new Date().toLocaleString(),

  createdAt:
    Date.now()

};
const orderRef = await addDoc(
  collection(db, "orders"),
  orderData
);

localStorage.setItem(
  "currentOrderId",
  orderRef.id
);

    localStorage.setItem(

      "foodOrder",

      JSON.stringify(orderData)

    );

    // CLEAR CART

    localStorage.removeItem("foodCart");

    // PLAY SOUND

    document
      .getElementById("successSound")
      .play();

    // SHOW POPUP

    document
      .getElementById("successPopup")
      .classList.add("show-popup");

    // REDIRECT

    setTimeout(()=>{

      window.location.href =
        "orders.html";

    },2500);

  },2000);

}
window.addEventListener("load", () => {

  setTimeout(() => {

    document.querySelector(".loader").style.display = "none";

    document.querySelector(".app").style.display = "block";

  }, 1800);

});

window.selectPayment = selectPayment;
window.placeOrder = placeOrder;
window.goBack = goBack;