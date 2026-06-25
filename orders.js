import { auth, db } from "./firebase.js";

import {
  collection,
  query,
  where,
  onSnapshot
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

      // ONLY ACTIVE ORDERS

      if(
        order.status !== "Pending" &&
        order.status !== "Preparing" &&
        order.status !== "Out For Delivery"
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

  if(
    order.status !== "Pending" &&
    order.status !== "Preparing" &&
    order.status !== "Out For Delivery"
  ){
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