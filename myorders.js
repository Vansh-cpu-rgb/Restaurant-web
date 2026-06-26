import { auth, db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ordersContainer =
document.getElementById("ordersContainer");

onAuthStateChanged(auth, async(user)=>{

if(!user) return;

const q = query(
collection(db,"orders"),
where("userId","==",user.uid)
);

const snapshot =
await getDocs(q);

ordersContainer.innerHTML = "";
if(snapshot.empty){

  ordersContainer.innerHTML = `

    <div class="empty-orders">

      <h2>🍔 No Orders Yet</h2>

      <p>
        You haven't placed any orders yet.
      </p>

      <button onclick="window.location.href='index.html'">

        Start Ordering

      </button>

    </div>

  `;

  return;

}

snapshot.forEach((docSnap)=>{

const order = docSnap.data();
if(
  order.status !== "Delivered" ||
  order.reviewSubmitted !== true
){
  return;
}

const card =
  document.createElement("div");

card.classList.add("order-card");

card.innerHTML = `

  <h3>🍔 Order #${docSnap.id.slice(0,8)}</h3>

  <p>🕒 ${order.orderTime}</p>

  <p>💰 ₹${order.total}</p>

  <p>📦 ${order.items.length} Item(s)</p>

  <p class="status">${order.status}</p>

  <button class="view-btn">
    View Details →
  </button>

`;

card.querySelector(".view-btn")
.addEventListener("click",()=>{

  const popup =
    document.getElementById("orderPopup");

  const popupDetails =
    document.getElementById("popupDetails");

popupDetails.innerHTML = `

<p>
<strong>Order ID:</strong>
${docSnap.id.slice(0,8)}
</p>

<p>
<strong>Status:</strong>
${order.status}
</p>

<p>
<strong>Order Time:</strong>
${order.orderTime}
</p>

<hr>

<h3>📍 Delivery Address</h3>

<p>
${order.address.fullName}<br>
${order.address.address}<br>
${order.address.city}<br>
📞 ${order.address.phone}
</p>

<hr>

<h3>🍔 Items</h3>

${order.items.map(item => `

<div class="popup-item">

  <img
    src="${item.image}"
    class="popup-item-img"
  >

  <div class="popup-item-info">

    <h4>${item.name}</h4>

    <p>Qty: ${item.qty}</p>

    <p>₹${item.price}</p>

  </div>

</div>

`).join("")}

<hr>

<p>
<strong>Food Total:</strong>
₹${order.total - 50}
</p>

<p>
<strong>Delivery Fee:</strong>
₹50
</p>

<h3>
Grand Total: ₹${order.total}
</h3>

`;

  popup.style.display = "flex";

  document
  .getElementById("reorderBtn")
  .onclick = ()=>{

    localStorage.setItem(
      "foodCart",
      JSON.stringify(order.items)
    );

    window.location.href =
      "cart.html";

  };

});

ordersContainer.appendChild(card);

});

});

document
.getElementById("closePopup")
.addEventListener("click",()=>{

document
.getElementById("orderPopup")
.style.display = "none";

});
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