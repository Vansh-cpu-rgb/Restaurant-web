// ===========================
// ELEMENTS
// ===========================

const viewer = document.getElementById("viewer");
const loading = document.getElementById("viewerLoading");
const title = document.getElementById("viewerTitle");

const rotateBtn = document.getElementById("toggleRotate");
const resetBtn = document.getElementById("resetView");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const arBtn = document.getElementById("arBtn");

// ===========================
// LOAD MODEL
// ===========================

const model = localStorage.getItem("current3DModel");
const modelName = localStorage.getItem("current3DName") || "3D Viewer";

title.innerText = modelName;

if (!model) {

loading.innerHTML = `
<i class="fa-solid fa-cube"
style="font-size:70px;color:#ff6b00;"></i>

<h2>No 3D Model</h2>

<p>This product doesn't have a 3D model.</p>
`;

throw new Error("No model found");

}

viewer.src = model;

// ===========================
// MODEL LOADED
// ===========================

viewer.style.opacity = "0";

viewer.addEventListener("load", () => {

loading.style.display = "none";

viewer.style.transition = "opacity .5s";

viewer.style.opacity = "1";

// Camera Reset

viewer.jumpCameraToGoal();

viewer.cameraTarget = "auto auto auto";

viewer.cameraOrbit = "0deg 75deg auto";

});

// ===========================
// MODEL ERROR
// ===========================

viewer.addEventListener("error", () => {

loading.innerHTML = `

<i class="fa-solid fa-circle-exclamation"
style="font-size:70px;color:red;"></i>

<h2>Failed To Load</h2>

<p>

Model URL is invalid
or GitHub cannot access it.

</p>

`;

});

// ===========================
// ROTATE
// ===========================

let rotating = true;

rotateBtn.onclick = () => {

rotating = !rotating;

viewer.autoRotate = rotating;

rotateBtn.style.background =
rotating ? "#ff6b00" : "#202020";

};

// ===========================
// RESET CAMERA
// ===========================

resetBtn.onclick = () => {

viewer.jumpCameraToGoal();

viewer.cameraTarget = "auto auto auto";

viewer.cameraOrbit = "0deg 75deg auto";

};

// ===========================
// FULLSCREEN
// ===========================

fullscreenBtn.onclick = () => {

if (!document.fullscreenElement) {

document.documentElement.requestFullscreen();

} else {

document.exitFullscreen();

}

};

// ===========================
// AR
// ===========================

arBtn.onclick = () => {

viewer.activateAR();

};

// ===========================
// EXTRA SAFETY
// ===========================

// Agar 10 second me load na ho

setTimeout(() => {

if (loading.style.display !== "none") {

loading.innerHTML = `

<i class="fa-solid fa-triangle-exclamation"
style="font-size:65px;color:#ff9800;"></i>

<h2>Still Loading...</h2>

<p>

Check your GLB file URL.

</p>

`;

}

},10000);