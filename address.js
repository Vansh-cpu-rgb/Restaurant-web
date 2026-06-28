let userLatitude = "";
let userLongitude = "";
let googleMapLink = "";
// GO BACK

function goBack(){

  window.location.href = "cart.html";

}

// GET LOCATION

async function getLocation(){

    const locationText =
    document.getElementById("locationText");

    const detectBtn =
    document.getElementById("detectBtn");

    locationText.innerText =
    "Detecting your location...";

    detectBtn.innerText = "Detecting...";

    if(!navigator.geolocation){

        locationText.innerText =
        "Geolocation not supported";

        detectBtn.innerText = "Detect";

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            userLatitude =
            position.coords.latitude;

            userLongitude =
            position.coords.longitude;

            googleMapLink =
            `https://maps.google.com/?q=${userLatitude},${userLongitude}`;

            try{

                const res =
                await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${userLatitude}&lon=${userLongitude}`
                );

                const data =
                await res.json();

                const addr =
                data.address || {};

                document.getElementById("address").value =
                data.display_name || "";

                document.getElementById("city").value =
                addr.city ||
                addr.town ||
                addr.village ||
                "";

                const pin =
                document.getElementById("pincode");

                if(pin){

                    pin.value =
                    addr.postcode || "";

                }

                locationText.innerHTML =
                "✅ Location Detected";

                detectBtn.innerHTML =
                '<i class="fa-solid fa-check"></i>';

                detectBtn.style.background =
                "#22c55e";

            }

            catch(err){

                locationText.innerText =
                "Unable to fetch address";

                detectBtn.innerText =
                "Detect";

            }

        },

        ()=>{

            locationText.innerText =
            "Location Permission Denied";

            detectBtn.innerText =
            "Detect";

        },

        {

            enableHighAccuracy:true

        }

    );

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
    city,

    pincode:
    document.getElementById("pincode").value,

    latitude:userLatitude,

    longitude:userLongitude,

    googleMap:googleMapLink

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
