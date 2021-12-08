var sliderRad = document.getElementById("tar-rad");
var sliderDist = document.getElementById("tar-dist");
var tarOne = document.getElementById("tar-one");
var tarTwo = document.getElementById("tar-two");
var lblDist = document.getElementById("lbl-dist");
var lblRad = document.getElementById("lbl-rad");
var lblID = document.getElementById("lbl-ID");

var tOneX = tarOne.offsetLeft;
var tTwoX = tarTwo.offsetLeft + Math.round(tRad/2);
var tRad = tarOne.offsetWidth;
var tDist = tarTwo.offsetLeft - tarOne.offsetLeft
var fittsID = Math.log(2);
var tActive = 1;

lblRad.innerHTML = tRad;
lblDist.innerHTML = tRad;
lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;

// Update the current slider value (each time you drag the slider handle)
sliderRad.oninput = function() {
  tarOne.style.width = Math.round(this.value / 2) + '%';

  // Update Vals
  tRad = tarOne.offsetWidth;
  tDist = tarTwo.offsetLeft - tarOne.offsetLeft
  fittsID = Math.log(2);

  tarTwo.style.width = Math.round(this.value / 2) + '%';
  tarTwo.style.left = tOneX + tRad + 'px';

  // Update Labels
  lblRad.innerHTML = tarOne.offsetWidth;
  lblDist.innerHTML = tarTwo.offsetLeft - tarOne.offsetLeft;
  lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;
}

sliderDist.oninput = function() {
  tarTwo.style.left = tOneX
    + tRad
    + Math.round(
      (tarTwo.parentElement.offsetWidth - 2*tRad) * (this.value/100))
    + 'px';

  // Update Vals
  tRad = tarOne.offsetWidth;
  tDist = tarTwo.offsetLeft - tarOne.offsetLeft
  fittsID = Math.log(2*tDist/tRad);

  // Update Labels
  lblDist.innerHTML = tarTwo.offsetLeft - tarOne.offsetLeft;
  lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;
  }

tarOne.onclick = function() {
  if (tActive==1) {
    toggleTarget();
  }
}
tarTwo.onclick = function() {
  if (tActive==2) {
    toggleTarget();
  }
}

//#region UI SET
window.onload = function() {
  tarTwo.style.left = tOneX + tRad + 'px';
}

function toggleTarget() {
  if (tActive==1) {
    tActive = 2;

    tarOne.classList.remove("active");
    tarTwo.classList.add("active");
  } else {
    tActive = 1;

    tarTwo.classList.remove("active");
    tarOne.classList.add("active");
  }
}