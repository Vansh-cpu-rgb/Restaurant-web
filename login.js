import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  auth,
  provider,
  db
} from "./firebase.js";

async function saveUserToFirestore(user) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      name: user.displayName || "FoodExpress User",
      email: user.email,
      photoURL: user.photoURL || "",
      foodieLevel: "New User",
      rewardPoints: 0,
      totalOrders: 0,
      createdAt: Date.now()
    },
    { merge: true }
  );
}

// ELEMENTS
const googleBtn = document.getElementById("googleLogin");
const loginBtn = document.getElementById("loginBtn");
const createAccount = document.getElementById("createAccount");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

// GOOGLE LOGIN
googleBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await saveUserToFirestore(user);

    localStorage.setItem("user", JSON.stringify(user));

    alert("Google Login Successful ðŸ”¥");
    document.getElementById("loginOverlay").style.display = "none";
  } catch (error) {
    alert(error.message);
  }
});

// PASSWORD TOGGLE
togglePassword.addEventListener("click", () => {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
});

// AUTO LOGIN
window.addEventListener("load", () => {

  const showLogin = localStorage.getItem("showLogin");

  if(showLogin === "true"){

    document.getElementById("loginOverlay").style.display = "flex";

    localStorage.removeItem("showLogin");

    return;
  }

  const user = localStorage.getItem("user");

  if(user){

    document.getElementById("loginOverlay").style.display = "none";

  }

});

// EMAIL LOGIN
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    await saveUserToFirestore(userCredential.user);

    localStorage.setItem(
      "user",
      JSON.stringify(userCredential.user)
    );

    alert("Login Successful ðŸ”¥");
    document.getElementById("loginOverlay").style.display = "none";
  } catch (error) {
    alert(error.message);
  }
});

// CREATE ACCOUNT
createAccount.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await saveUserToFirestore(userCredential.user);

    localStorage.setItem(
      "user",
      JSON.stringify(userCredential.user)
    );

    alert("Account Created Successfully ðŸŽ‰");
    document.getElementById("loginOverlay").style.display = "none";
  } catch (error) {
    alert(error.message);
  }
});