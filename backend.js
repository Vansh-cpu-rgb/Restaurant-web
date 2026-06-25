// ==========================
// FIREBASE IMPORTS
// ==========================

import {

  auth,
  db

} from "./firebase.js";

import {

  doc,
  updateDoc,
  getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================
// CURRENT USER
// ==========================

let currentUser = null;

// ==========================
// USER STATE
// ==========================

onAuthStateChanged(auth,(user)=>{

  if(user){

    currentUser = user;

    console.log(
      "User Logged In ðŸ”¥",
      user.email
    );

  }else{

    currentUser = null;

    console.log(
      "No User"
    );

  }

});

// ==========================
// SAVE CART
// ==========================

export async function saveCart(cart){

  if(!currentUser){

    console.log("Login Required");

    return;

  }

  try{

    const userRef =
      doc(db,"users",currentUser.uid);

    await updateDoc(userRef,{

      cart: cart

    });

    console.log(
      "Cart Saved ðŸ”¥"
    );

  }catch(error){

    console.log(error);

  }

}

// ==========================
// LOAD CART
// ==========================

export async function loadCart(){

  if(!currentUser) return [];

  try{

    const userRef =
      doc(db,"users",currentUser.uid);

    const snap =
      await getDoc(userRef);

    if(snap.exists()){

      return snap.data().cart || [];

    }

  }catch(error){

    console.log(error);

  }

  return [];

}