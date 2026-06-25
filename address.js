// GO BACK

function goBack(){

  window.location.href = "cart.html";

}

// GET LOCATION

function getLocation(){

  const locationText =
    document.getElementById("locationText");

  locationText.innerText =
    "Fetching current location...";

  if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(

      (position)=>{

        locationText.innerText =
          "Location detected successfully 😎";

      },

      ()=>{

        locationText.innerText =
          "Location access denied 😅";

      }

    );

  }else{

    locationText.innerText =
      "Geolocation not supported";

  }

}

// SAVE ADDRESS

function saveAddress(){

  const fullName =
    document.getElementById("fullName").value;

  const phone =
    document.getElementById("phone").value;

  const address =
    document.getElementById("address").value;

  const landmark =
    document.getElementById("landmark").value;

  const city =
    document.getElementById("city").value;

  // VALIDATION

  if(
    fullName === "" ||
    phone === "" ||
    address === ""
  ){

    alert("Please fill all required fields 😅");

    return;

  }

  // SAVE DATA

  const userAddress = {

    fullName,
    phone,
    address,
    landmark,
    city

  };

  localStorage.setItem(

    "foodAddress",

    JSON.stringify(userAddress)

  );

  // SUCCESS

  alert("Address saved successfully 😎🔥");

  // NEXT PAGE

  window.location.href = "payment.html";

}
window.addEventListener("load", () => {

  setTimeout(() => {

    document.querySelector(".loader").style.display = "none";

    document.querySelector(".app").style.display = "block";

  }, 1800);

});
