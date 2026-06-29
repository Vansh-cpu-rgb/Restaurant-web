const viewer =
document.getElementById("viewer");

const loading =
document.getElementById("viewerLoading");

const title =
document.getElementById("viewerTitle");

const rotateBtn =
document.getElementById("toggleRotate");

const resetBtn =
document.getElementById("resetView");

const fullscreenBtn =
document.getElementById("fullscreenBtn");

const arBtn =
document.getElementById("arBtn");

// ======================
// LOAD MODEL
// ======================

const model =
localStorage.getItem("current3DModel");


const modelName =
localStorage.getItem("current3DName") || "3D Viewer";

title.innerText = modelName;

if(model){

viewer.src = model;

}else{

    loading.innerHTML = `

    <i class="fa-solid fa-cube"
    style="
    font-size:70px;
    color:#ff6b00;
    "></i>

    <h2>
    3D Model Coming Soon
    </h2>

    <p>

    This product doesn't have a
    3D model yet.

    </p>

    `;

}

// ======================
// MODEL LOADED
// ======================

viewer.style.opacity = "0";

viewer.addEventListener("load",()=>{

loading.style.display="none";

viewer.style.transition =
"opacity .6s ease";

viewer.style.opacity = "1";

});

// ======================
// AUTO ROTATE
// ======================

let rotate = true;

rotateBtn.onclick=()=>{

rotate = !rotate;

viewer.autoRotate = rotate;

rotateBtn.style.background =
rotate ? "#ff6b00" : "#202020";

};

// ======================
// RESET CAMERA
// ======================

resetBtn.onclick=()=>{

viewer.cameraOrbit =

"0deg 75deg auto";

};

// ======================
// FULLSCREEN
// ======================

fullscreenBtn.onclick=()=>{

if(document.fullscreenElement){

document.exitFullscreen();

}else{

viewer.requestFullscreen();

}

};

// ======================
// AR BUTTON
// ======================

arBtn.onclick=()=>{

viewer.activateAR();

};