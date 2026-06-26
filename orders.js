import { auth, db } from "./firebase.js";

import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// BACK BUTTON

function goBack(){
  window.location.href = "index.html";
}

window.goBack = goBack;

// LOADER

window.addEventListener("load", () => {

  setTimeout(() => {

    document.querySelector(".loader").style.display = "none";

    document.querySelector(".app").style.display = "block";

  }, 1800);

});

// WAIT FOR LOGIN

auth.onAuthStateChanged((user)=>{

  if(!user){

    document.getElementById(
      "ordersContainer"
    ).innerHTML = `
      <div class="empty-orders">
        <h2>Please Login</h2>
      </div>
    `;

    return;
  }

  loadOrders(user.uid);

});

// LOAD ORDERS

function loadOrders(userId){

  const ordersContainer =
    document.getElementById("ordersContainer");

  const emptyOrders =
    document.getElementById("emptyOrders");

  const q = query(
    collection(db,"orders"),
    where("userId","==",userId)
  );

  onSnapshot(q,(snapshot)=>{

    let html = "";

    let activeOrders = 0;

    snapshot.forEach((doc)=>{

      const order = doc.data();
      if (
  order.status === "Delivered" &&
  order.reviewSubmitted !== true &&
  !currentReviewOrder
) {

  order.id = doc.id;

  setTimeout(() => {
    openReviewPopup(order);
  }, 500);

}

      // ONLY ACTIVE ORDERS

// ONLY ACTIVE ORDERS

const activeStatuses = [
  "Pending",
  "Accepted",
  "Preparing",
  "Out For Delivery"
];

if(
  order.status === "Delivered" &&
  order.reviewSubmitted === true
){
  return;
}

if(
  !activeStatuses.includes(order.status) &&
  order.status !== "Delivered"
){
  return;
}

      activeOrders++;

      let statusClass = "pending";

      if(order.status === "Preparing"){
        statusClass = "preparing";
      }

      if(order.status === "Out For Delivery"){
        statusClass = "delivery";
      }

      let itemsHtml = "";

      order.items.forEach((item)=>{

        itemsHtml += `
          <div class="order-item">

            <div class="order-item-name">
              ${item.name}
              x${item.qty}
            </div>

            <div class="order-item-price">
              ₹${item.price * item.qty}
            </div>

          </div>
        `;

      });

      html += `

      <div class="order-card">

        <div class="order-top">

          <div class="order-id">
            Order ID:
            ${doc.id.slice(0,8)}
          </div>

          <div class="order-status ${statusClass}">
            ${order.status}
          </div>

        </div>

        <div class="order-items">

          ${itemsHtml}

        </div>

        <div class="order-total">

          <span>Total Amount</span>

          <strong>
            ₹${order.total}
          </strong>

        </div>

        <div class="order-address">

          <h4>
            Delivery Address
          </h4>

          <p>

            ${order.address?.fullName || ""}

            <br>

            ${order.address?.address || ""}

            <br>

            ${order.address?.city || ""}

          </p>

        </div>

        <div class="order-time">

          Ordered:
          ${order.orderTime}

        </div>

      </div>

      `;

    });

    if(activeOrders === 0){

      ordersContainer.innerHTML = "";

      emptyOrders.style.display = "block";

      return;
    }

    emptyOrders.style.display = "none";

    ordersContainer.innerHTML = html;
    const orderCards =
document.querySelectorAll(".order-card");

let index = 0;

snapshot.forEach((doc)=>{

  const order = doc.data();

const activeStatuses = [
  "Pending",
  "Accepted",
  "Preparing",
  "Out For Delivery",
  "Delivered"
];

if(!activeStatuses.includes(order.status)){
  return;
}

  order.id = doc.id;

  orderCards[index].addEventListener("click",()=>{

    openOrderDetails(order);

  });

  index++;

});

  });

}
  function openOrderDetails(order){

const popup =
document.getElementById("orderDetailsPopup");

const content =
document.getElementById("orderPopupContent");

let itemsHTML = "";

order.items.forEach(item=>{

itemsHTML += `
<div class="popup-product">

<img src="${item.image}">

<div>

<h3>${item.name}</h3>

<p>₹${item.price}</p>

<p>Qty : ${item.qty}</p>

</div>

</div>
`;

});

content.innerHTML = `

<h2 style="margin-bottom:20px;">
Order Details
</h2>

${itemsHTML}

<div class="popup-row">
<b>Order ID:</b>
${order.id}
</div>

<div class="popup-row">
<b>Total:</b>
₹${order.total}
</div>

<div class="popup-row">
<b>Order Time:</b>
${order.orderTime}
</div>

<div class="popup-row">
<b>Address:</b>
${order.address?.address || "N/A"}
</div>

<div class="popup-row">
<b>Status:</b>
<span class="popup-status">
${order.status}
</span>
</div>
`;

popup.style.display = "flex";

}

document
.getElementById("closeOrderPopup")
.onclick = ()=>{

document
.getElementById("orderDetailsPopup")
.style.display = "none";

};
window.openOrderDetails = openOrderDetails;
// =========================
// REVIEW SYSTEM VARIABLES
// =========================

let currentReviewOrder = null;

const reviewPopup =
document.getElementById("reviewPopup");

const reviewProducts =
document.getElementById("reviewProducts");

const riderStars =
document.querySelector(".rider-stars");

const riderComment =
document.getElementById("riderComment");
// =========================
// OPEN REVIEW POPUP
// =========================

function openReviewPopup(order){

currentReviewOrder = order;

reviewProducts.innerHTML = "";
reviewProducts.innerHTML = `

<div class="review-order-header">

<img
src="${order.items[0].image}"
class="review-main-image">

<div>

<h2>Order Delivered 🎉</h2>

<p>
Your food has been delivered successfully.
Please rate every item.
</p>

<div class="review-order-id">

Order #${order.id.slice(0,8)}

</div>

</div>

</div>

`;

order.items.forEach((item,index)=>{

const product = document.createElement("div");

product.className = "review-product";

product.innerHTML = `

<div class="review-product-top">

<img src="${item.image}">

<div>

<h3>${item.name}</h3>

<div class="review-price">

₹${item.price}

<span>

× ${item.qty}

</span>

</div>

<div class="rating-label">

Tap stars to rate

</div>

</div>

</div>

<div class="review-stars" id="stars-${index}"></div>

<textarea
id="comment-${index}"
placeholder="Write your review..."></textarea>

`;

reviewProducts.appendChild(product);

const stars =
product.querySelector(".review-stars");

for(let i=1;i<=5;i++){

const star =
document.createElement("span");

star.className = "review-star";
star.innerHTML = '<i class="fa-solid fa-star"></i>';


star.onclick = ()=>{

stars.setAttribute("data-rating",i);

stars.querySelectorAll(".review-star")
.forEach((s,idx)=>{

if(idx < i){

s.classList.add("active");

}else{

s.classList.remove("active");

}

});

};

stars.appendChild(star);

}

});

// Rider Stars

riderStars.innerHTML = "";

for(let i=1;i<=5;i++){

const star =
document.createElement("span");

star.className = "review-star";
star.innerHTML = '<i class="fa-solid fa-star"></i>';

star.onclick = ()=>{

riderStars.setAttribute("data-rating",i);

riderStars.querySelectorAll(".review-star")
.forEach((s,idx)=>{

if(idx < i){

s.classList.add("active");

}else{

s.classList.remove("active");

}

});

};

riderStars.appendChild(star);

}

reviewPopup.style.display = "flex";

}
// =========================
// SUBMIT REVIEW
// =========================

document.getElementById("submitReviewBtn").onclick = async ()=>{

if(!currentReviewOrder) return;

// Save every product review separately

for(let index=0; index<currentReviewOrder.items.length; index++){

const item = currentReviewOrder.items[index];

const rating = Number(
document
.getElementById(`stars-${index}`)
?.getAttribute("data-rating") || 0
);

const review =
document
.getElementById(`comment-${index}`)
?.value || "";

await addDoc(

collection(db,"reviews"),

{

productId:item.id,

productName:item.name,

foodRating:rating,

review:review,

image:item.image,

orderId:currentReviewOrder.id,

userId:auth.currentUser.uid,

userName:auth.currentUser.displayName || "Customer",

createdAt:serverTimestamp()

}

);

}

// Only mark review submitted

await updateDoc(

doc(db,"orders",currentReviewOrder.id),

{

reviewSubmitted:true

}

);

reviewPopup.style.display="none";

currentReviewOrder=null;

document
.getElementById("reviewSuccess")
.classList.add("show");

setTimeout(()=>{

document
.getElementById("reviewSuccess")
.classList.remove("show");

},1800);

};
document.getElementById("skipReviewBtn").onclick = async ()=>{

if(!currentReviewOrder) return;

await updateDoc(

doc(db,"orders",currentReviewOrder.id),

{

reviewSubmitted:true
}

);

reviewPopup.style.display="none";

currentReviewOrder=null;

};