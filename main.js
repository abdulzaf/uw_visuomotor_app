var sliderRad = document.getElementById("tar-rad");
var sliderDist = document.getElementById("tar-dist");
var tarOne = document.getElementById("tar-one");
var tarTwo = document.getElementById("tar-two");
var lblDist = document.getElementById("lbl-dist");
var lblRad = document.getElementById("lbl-rad");
var lblID = document.getElementById("lbl-ID");
var pltData = document.getElementById('plot');
var btnRec = document.getElementById('btn-record');
var txtTap = document.getElementById('tap-count');

var tOneX = tarOne.offsetLeft;
var tTwoX = tarTwo.offsetLeft + Math.round(tRad/2);
var tRad = tarOne.offsetWidth;
var tDist = tarTwo.offsetLeft - tarOne.offsetLeft
var fittsID = Math.log(2);
var rTime = -1;
var tActive = -1;
var nTaps = -1;
var toggleRec = false;
var vw = window.innerWidth;
var vh = window.innerHeight;

var struct_data = {
  "tar_width": [],
  "tar_dist": [],
  "RT": [],
  "ID": []
}

// Init
sliderDist.value = 0;
lblRad.innerHTML = tRad;
lblDist.innerHTML = tRad;
lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;

// Update the current slider value (each time you drag the slider handle)
sliderRad.oninput = function() {
  tRad = (Math.round(this.value /2) /100) * tarTwo.parentElement.offsetWidth;
  tDist = tRad;
  fittsID = Math.log(2*tDist/tRad);

  sliderDist.value = 0;
  tarOne.style.width = tRad + 'px';
  tarTwo.style.width = tRad + 'px';
  tarTwo.style.left = tOneX + tRad + 'px';

  // Update Labels
  lblRad.innerHTML = tarOne.offsetWidth;
  lblDist.innerHTML = tarTwo.offsetLeft - tarOne.offsetLeft;
  lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;
}

sliderDist.oninput = function() {
  // Update Vals
  tDist = tRad + (tarTwo.parentElement.offsetWidth - 2*tRad) * (this.value/100)
  fittsID = Math.log(2*tDist/tRad);

  // Update Interface
  tarTwo.style.left = tOneX
    + Math.round(tDist)
    + 'px';

  // Update Labels
  lblDist.innerHTML = Math.round(tDist);
  lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;
  }

tarOne.onclick = function() {
  if (tActive==1) {
    toggleTarget();
    responseTime();
    plotData();
  }
}
tarTwo.onclick = function() {
  if (tActive==2) {
    toggleTarget();
    responseTime();
    plotData();
  }
}

btnRec.onclick = function() {
  toggleRec = !toggleRec;

  if (toggleRec) {
    btnRec.innerHTML = "STOP";
    tActive = 2;
    btnRec.classList.add("active");
    toggleTarget();
  } else {
    btnRec.innerHTML = "START";
    tActive = -1;
    rTime = -1;
    nTaps = -1;
    tarOne.classList.remove("active");
    tarTwo.classList.remove("active");
    btnRec.classList.remove("active");
  }
  displayNTaps();
}

//#region UI SET
window.onload = function() {
  tarTwo.style.left = tOneX + tRad + 'px';
  vw = window.innerWidth;
  vh = window.innerHeight;
  plotData();
}
window.onresize = function() {
  vw = window.innerWidth;
  vh = window.innerHeight;
  plotData();
};

function toggleTarget() {
  if (tActive==1) {
    tActive = 2;

    tarOne.classList.remove("active");
    tarTwo.classList.add("active");
  } else if (tActive==2) {
    tActive = 1;

    tarTwo.classList.remove("active");
    tarOne.classList.add("active");
  }

  nTaps++;
  displayNTaps();
}

function displayNTaps() {
  if (nTaps==-1) {
    txtTap.innerHTML = "# of taps: -";
  } else {
    txtTap.innerHTML = "# of taps: " + nTaps;
  }
}

function updateParams() {
  // Update Vals
  tRad = tarOne.offsetWidth;
  tDist = tarTwo.offsetLeft - tarOne.offsetLeft
  fittsID = Math.log(2);
}

function responseTime() {
  if (rTime==-1) {
    rTime = Date.now();
  } else {
    struct_data.RT.push(Date.now() - rTime);
    struct_data.ID.push(fittsID);
    struct_data.tar_dist.push(tDist);
    struct_data.tar_width.push(tRad);

    rTime = -1;
  }
}

function plotData() {
  var data = [{
      x: struct_data.ID,
      y: struct_data.RT,
      mode: 'markers',
      type: 'scatter'
      }]
  var layout = {
      autosize: false,
      height: Math.round(0.6*vh),
      width: Math.round(0.7*vw),
      xaxis: {
        title: "Target Distance",
        titlefont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'black'
        }
      },
      yaxis: {
        title: "Target Width",
        titlefont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'black'
        }
      }
    };
  var config = {responsive: true}
  Plotly.newPlot(
      pltData, data, layout, config);
}