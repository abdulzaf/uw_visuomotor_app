var sliderRad = document.getElementById("tar-rad");
var sliderDist = document.getElementById("tar-dist");
var tarOne = document.getElementById("tar-one");
var tarTwo = document.getElementById("tar-two");
var output = document.getElementById("output");

var tOneX = tarOne.offsetLeft;
var tRad = tarOne.offsetWidth;
var tTwoX = tarTwo.offsetLeft + Math.round(tRad/2);
console.log(tRad)

output.innerHTML = sliderRad.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sliderRad.oninput = function() {
  output.innerHTML = this.value;

  tarOne.style.width = Math.round(this.value / 3) + '%';
  tarOne.style.height = tarOne.offsetWidth + 'px';

  tRad = tarOne.offsetWidth;

  tarTwo.style.width = Math.round(this.value / 3) + '%';
  tarTwo.style.height = tarTwo.offsetWidth + 'px';
  tarTwo.style.left = tOneX + tRad + 'px';
}

sliderDist.oninput = function() {
    tarTwo.style.left = tOneX
    + tRad
    + Math.round(
      (tarTwo.parentElement.offsetWidth - 2*tRad) * (this.value/100))
    + 'px';
  }

//#region UI SET
window.onload = function() {
  tarTwo.style.left = tOneX + tRad + 'px';
}