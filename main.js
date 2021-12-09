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
var tDist = tarOne.offsetWidth;
var tCen = [0,0];
var fittsID = Math.log(2);
var rTime = -1;
var tActive = -1;
var nTaps = -2;
var toggleRec = false;
var vw = window.innerWidth;
var vh = window.innerHeight;
var pwidth = tarOne.parentElement.offsetWidth;

var struct_data = {
  "tar_width": [],
  "tar_dist": [],
  "RT": [],
  "ID": []
}

// Update the current slider value (each time you drag the slider handle)
sliderRad.oninput = function() {
  var testVal = (this.value/200) * pwidth;

  if (testVal < tDist && (testVal + tDist) < pwidth) {
    tRad = (Math.round(this.value /2) /100) * pwidth;
    fittsID = Math.log(2*tDist/tRad);

    tarOne.style.width = tRad + 'px';
    tarTwo.style.width = tRad + 'px';

    tarOne.style.left = Math.round(tCen[0] * pwidth) - Math.round(tRad/2) + 'px';
    tarTwo.style.left = Math.round(tCen[1] * pwidth) - Math.round(tRad/2) + 'px';

    // Update Labels
    lblRad.innerHTML = Math.round(tarOne.offsetWidth/2);
    lblDist.innerHTML = tarTwo.offsetLeft - tarOne.offsetLeft;
    lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;
  }
}

sliderDist.oninput = function() {
  var testVal = (this.value/100) * pwidth;

  if (tRad < testVal && (testVal + tRad) < pwidth) {
    var perHalf = 0.5 * (this.value/100);
    tCen = [0.5 - perHalf, 0.5 + perHalf];

    // Update Vals
    tDist = Math.round((tCen[1] - tCen[0]) * pwidth);
    fittsID = Math.log(2*tDist/tRad);

    // Update Interface
    tarOne.style.left = Math.round(tCen[0] * pwidth) - Math.round(tRad/2) + 'px';
    tarTwo.style.left = Math.round(tCen[1] * pwidth) - Math.round(tRad/2) + 'px';

    // Update Labels
    lblDist.innerHTML = Math.round(tDist);
    lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;
  }
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
    nTaps = -2;
    tarOne.classList.remove("active");
    tarTwo.classList.remove("active");
    btnRec.classList.remove("active");
  }
  displayNTaps();
}

//#region UI SET
window.onload = function() {
  tCen = [.25, .75];
  vw = window.innerWidth;
  vh = window.innerHeight;
  pwidth = tarOne.parentElement.offsetWidth;
  tRad = tarOne.offsetWidth;
  tDist = Math.round((tCen[1] - tCen[0]) * pwidth);
  fittsID = Math.log(2*tDist/tRad);

  tarOne.style.left = Math.round(tCen[0] * pwidth) - Math.round(tRad/2) + 'px';
  tarTwo.style.left = Math.round(tCen[1] * pwidth) - Math.round(tRad/2) + 'px';

  lblRad.innerHTML = Math.round(tarOne.offsetWidth/2);
  lblDist.innerHTML = tDist;
  lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;

  plotData();
}
window.onresize = function() {
  vw = window.innerWidth;
  vh = window.innerHeight;
  pwidth = tarOne.parentElement.offsetWidth;
  tRad = tarOne.offsetWidth;
  tDist = Math.round((tCen[1] - tCen[0]) * pwidth);
  fittsID = Math.log(2*tDist/tRad);

  tarOne.style.left = Math.round(tCen[0] * pwidth) - Math.round(tRad/2) + 'px';
  tarTwo.style.left = Math.round(tCen[1] * pwidth) - Math.round(tRad/2) + 'px';

  lblRad.innerHTML = Math.round(tarOne.offsetWidth/2);
  lblDist.innerHTML = tDist;
  lblID.innerHTML = "Index of Difficulty: " + Math.round(100*fittsID)/100;
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
  if (nTaps<1) {
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
      type: 'scatter',
      marker: {
        color: 'rgba(214, 40, 40,0.75)',
        size: Math.round(0.01*vw),
        line: {
          color: 'rgb(72, 86, 103)',
          width: 2
        }
      }
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