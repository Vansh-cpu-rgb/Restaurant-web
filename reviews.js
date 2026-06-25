import { db } from "./firebase.js";

import {
  collection,
  getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("Reviews JS Loaded 🔥");
window.productRatings = {};

window.loadProductReviews =
async function(productId){

  const reviewsBox =
  document.getElementById(
    "productReviews"
  );

  const avgBox =
  document.getElementById(
    "productAverageRating"
  );

  const countBox =
  document.getElementById(
    "productReviewCount"
  );

  if(!reviewsBox) return;

  reviewsBox.innerHTML =
  "Loading reviews...";

  const snap =
  await getDocs(
    collection(db,"reviews")
  );

  let html = "";

  let totalRating = 0;

  let totalReviews = 0;

  snap.forEach((doc)=>{

    const data = doc.data();

    if(data.productId == productId){

      totalReviews++;

      totalRating +=
      data.foodRating || 0;

      html += `

      <div class="single-review">

        <h4>
          ⭐ ${data.foodRating}
        </h4>

        <p>
          ${data.review || ""}
        </p>

      </div>

      `;

    }

  });

  const average =

  totalReviews > 0

  ?

  (totalRating / totalReviews)
  .toFixed(1)

  :

  "0.0";
  window.productRatings[productId] = {

  average: average,

  totalReviews: totalReviews

};

  avgBox.innerText =
  average;

countBox.innerText =
totalReviews;

const reviewsArray = [];

snap.forEach((doc)=>{

  const data = doc.data();

  if(data.productId == productId){

    reviewsArray.push(data);

  }

});
window.currentReviews =
reviewsArray;

const commentReviews =

reviewsArray.filter(
  r => r.review &&
  r.review.trim() !== ""
);

const top3 =
commentReviews.slice(0,3);
const viewBtn =
document.getElementById(
  "viewAllReviewsBtn"
);

if(viewBtn){

  if(commentReviews.length === 0){

    viewBtn.style.display =
    "none";

  }else{

    viewBtn.style.display =
    "block";

  }

}

html = "";

top3.forEach((data)=>{

const reviewDate =
data.createdAt
? new Date(
    data.createdAt.seconds * 1000
  ).toLocaleDateString(
    "en-IN",
    {
      day:"numeric",
      month:"short",
      year:"numeric"
    }
  )
: "";

html += `

<div class="review-card">

  <div>
    ⭐ ${data.foodRating}
  </div>

  <p>
    ${data.review}
  </p>

  <small>
    📅 ${reviewDate}
  </small>

  <br>

  <small>
    ✅ Verified Order
  </small>

</div>

`;

});

reviewsBox.innerHTML =
html ||
`
<div class="empty-review-box">

  <div class="empty-review-title">
    ⭐ Rated by ${totalReviews} customers
  </div>

  <div class="empty-review-text">
    No written reviews yet
  </div>

</div>
`;

};
window.productRatings = {};
window.loadAllRatings =
async function(){

  const snap =
  await getDocs(
    collection(db,"reviews")
  );

  window.productRatings = {};

  snap.forEach((doc)=>{

    const data = doc.data();

    const id = data.productId;

    if(!window.productRatings[id]){

      window.productRatings[id] = {

        totalRating:0,
        totalReviews:0

      };

    }

    window.productRatings[id]
    .totalRating +=
    data.foodRating || 0;

    window.productRatings[id]
    .totalReviews++;

  });

  Object.keys(
    window.productRatings
  ).forEach((id)=>{

    const item =
    window.productRatings[id];

    item.average = (

      item.totalRating
      /
      item.totalReviews

    ).toFixed(1);

  });

};
window.loadAllRatings()
.then(()=>{

  window.renderProducts();

});
document
.getElementById(
  "viewAllReviewsBtn"
)
?.addEventListener(
  "click",
  ()=>{

    if(
      !window.currentReviews
    ) return;

    let text = "";

    window.currentReviews
    .forEach((r)=>{

      text +=

      `⭐ ${r.foodRating}\n` +

      `${r.review || "No Comment"}\n\n`;

    });

const list =
document.getElementById(
  "allReviewsList"
);

let html = "";

window.currentReviews
.filter(
  r =>
  r.review &&
  r.review.trim() !== ""
)
.forEach((r)=>{

  html += `

  <div class="review-card">

    <div>
      ⭐ ${r.foodRating}
    </div>

    <p>
      ${r.review || "No Comment"}
    </p>

  </div>

  `;

});

list.innerHTML = html;

document
.getElementById(
  "allReviewsPopup"
)
.style.display = "flex";
document
.getElementById(
  "closeAllReviews"
)
.addEventListener(
  "click",
  ()=>{

    document
    .getElementById(
      "allReviewsPopup"
    )
    .style.display = "none";

  }
);

  }
);