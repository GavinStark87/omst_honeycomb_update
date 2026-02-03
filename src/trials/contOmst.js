//*******************************************************************
//
//   File: contOmst.js               Folder: trials
//
//   Author: Craig Stark, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/26/23 (AGH): began converting cont_omst.html into honeycomb template
//                       (adding imports, exports, removing JATOS code)
//        6/27/23 (AGH): moved config variables (stim_set, orderfile...)
//                       to /config/contOmstset.js
//                       made dynamic for lang and resp_mode
//        6/28/23 (AGH):  moved repeat test_trials to /trials/trialCont.js +
//                       /timelines/testTrial.js + /timelines/testBlock.js
//        6/28/23 (AGH):  moved timeline variables set up of test_trials
//                       as the condition of exptBlock1 in /config/experiment.js
//                       (gets called in main timeline as testBlock(exptBlock1))
//        7/6/23 (AGH):  deleted preload
//        7/13/23 (AGH): added task data property to trials
//        7/14/23 (AGH): split instructions into keyboard and button version
//        7/21/23 (AGH): made debrief data calculations a seperate function o
//                       exported to /components/JsPsychExperiment
//        7/26/23 (AGH): consolodated key and button constructions with
//                       refresh_cont_trials called at Login
//        7/27/23 (AGH): added paragraph markers to param functions (previously
//                       within text file)
//        8/1/23 (AGH):  moved invNormcdf function to utils, now imported
//        10/28/23 (CELS): Added preloading
//
//   --------------------
//   This file includes the continuous oMST instructions and debrief trials
//   as well as the data anlaysis function for the cont oMST (it no longer
//   contains the looped trials or preload).
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychPreload from "@jspsych/plugin-preload";
import jsPsychCanvasButtonResponse from "@jspsych/plugin-canvas-button-response";
import jsPsychCanvasKeyboardResponse from "@jspsych/plugin-canvas-keyboard-response";
import jsPsychImageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import jsPsychImageButtonResponse from "@jspsych/plugin-image-button-response";

import './contOmst.css';

import { twochoice, lang, resp_mode } from "../App/components/Login";

import { invNormcdf, setupButtonListeners, cleanupButtonListeners, getDeviceType, drawHTMLText } from "../lib/utils";



// <script>
// function waitFor(conditionFunction) {
//   const poll = resolve => {
//   if(conditionFunction()) resolve();
//     else setTimeout(_ => poll(resolve), 400);
//   }
//   return new Promise(poll)
// }

// function leftFillNum(num, width){
//   return num
//   .toString()
//   .padStart(width,0)
// }

// jatos.onLoad(async function() {
//   //baseurl='https://starklab.bio.uci.edu/mst/'; // How we'll get images, videos, etc.  Set to empty string to use local folders
// var baseurl=''; // How we'll get images, videos, etc.  Set to empty string to use local folders
//   var sid=jatos.studySessionData['sid'];
//   if (typeof sid === 'undefined') {
//     sid=1234;
//   }
//   var resp_mode='button';
//   if (jatos.studySessionData['resp_mode'] == 'keyboard') {
//     resp_mode='keyboard';
//   }
//   var stim_set='1';
//   if (typeof jatos.studySessionData['set_omst'] !== 'undefined') {
//     stim_set = jatos.studySessionData['set_omst']
//   }
//   if (jatos.componentJsonInput && typeof jatos.componentJsonInput['force_set'] !== 'undefined') {
//     stim_set=jatos.componentJsonInput['force_set'];
//     console.log('Stim set forced via JSON component to ' + stim_set);
//   }
//   var trialorder='1';
//   if (typeof jatos.studySessionData['trialorder'] !== 'undefined') {
//     trialorder=jatos.studySessionData['trialorder'];
//   }
//   var run='1';
//   if (typeof jatos.studySessionData['run'] !== 'undefined') {
//     run=jatos.studySessionData['run'];
//   }
//   var twochoice=0;
//   if (typeof jatos.studySessionData['twochoice'] !== 'undefined') {
//     twochoice = jatos.studySessionData['twochoice']
//   }
//   if (jatos.componentJsonInput && typeof jatos.componentJsonInput['force_twochoice'] !== 'undefined') {
//     twochoice=jatos.componentJsonInput['force_twochoice'];
//     console.log('Two-choice mode forced via JSON component to ' + twochoice);
//   }
//   var selfpaced=1;
//   if (typeof jatos.studySessionData['selfpaced'] !== 'undefined') {
//     selfpaced = jatos.studySessionData['selfpaced']
//   }
//   var orderprefix = 'jsOrders/cMST_Imbal2_orders_';
//   if (jatos.componentJsonInput && typeof jatos.componentJsonInput['force_orderprefix'] !== 'undefined') {
//     orderprefix=jatos.componentJsonInput['force_orderprefix'];
//     console.log('Order prefix forced via JSON component to ' + orderprefix);
//   }

// // START OF CODE THAT SHOULD BE CONSTANT REGARDLESS OF JATOS / CORDOVA
// const phasename='oMSTCont';

// var jsPsych = initJsPsych();

// jsPsych.data.addProperties({
//   task: phasename,
//   subject: sid,
//   set: stim_set,
//   selfpaced: selfpaced,
//   orderfile: orderfile
// });

//----------------------- 2 ----------------------
//---------------- HELPER METHODS ----------------
// helper methods that setup prompts and response options based on keyboard/button and 2/3 choices

var omst_preload = {
  type: jsPsychPreload,
  auto_preload: true,
};

var instr_choice = function () {
  if (resp_mode == "button") {
    return [lang.cont.button.instr_choice];
  } else {
    return lang.cont.key.instr_choice;
  }
};

var instr_prompt = function () {
  if (resp_mode == "button") {
    return "<p class='prompt_text'>" + lang.cont.button.instr_prompt + "</p>";
  } else {
    return "<p class='prompt_text'>" + lang.cont.key.instr_prompt + "</p>";
  }
};

var instr_stim = function () {
  if (resp_mode == "button") {
    if (twochoice == 0) {
      return "<p>" + lang.cont.button.threechoice.instr_stim + "</p>";
    } else {
      return "<p>" + lang.cont.button.twochoice.instr_stim + "</p>";
    }
  } else {
    if (twochoice == 0) {
      return "<p>" + lang.cont.key.threechoice.instr_stim + "</p>";
    } else {
      return "<p>" + lang.cont.key.twochoice.instr_stim + "</p>";
    }
  }
};

//--------------------CONSTANTS--------------------
const device = getDeviceType();
console.log("have device " + device);
const isMobile = device[0];
const isTablet = device[1];
const smallScreen = device[2];
console.log("smallScreen " + smallScreen);
const canvasWidth = isMobile ? stars_12 ? window.innerWidth * 1 : window.innerWidth * .9 
                    : isTablet ? stars_12 ? window.innerWidth * 1 : window.innerWidth * .9
                    : window.innerWidth * .9;
const canvasHeight = isMobile ? window.innerHeight * 0.65 
                    : smallScreen ? window.innerHeight * 0.75 
                    : isTablet ? window.innerHeight * 0.8 
                    : window.innerHeight * .70;
const fontScale = isMobile ? 1.5 : 1.0;
const stimScale = isMobile ? 2 : smallScreen ? 0.85: isTablet ? 1.2 : 1.0;
const classicGraphics = false; // for now

//----------------------- 3 ----------------------
//--------------------- TRIALS -------------------

//-------------instructions-------------

var instr_trial = {};

function refresh_cont_trials() {
  instr_trial = {
    type: resp_mode == "button" ? jsPsychCanvasButtonResponse : jsPsychCanvasKeyboardResponse,
    choices: instr_choice,
    prompt: instr_prompt(),
    margin_horizontal: "40px",
    margin_vertical: "20px",
    canvas_size: isMobile ? [canvasHeight * 0.8, canvasWidth] : isTablet ? [canvasHeight * 0.8, canvasWidth] : smallScreen ? [canvasHeight * 0.6, canvasWidth] : [canvasHeight * 0.65, canvasWidth],
    button_html: `
        <div class="image-btn-wrapper">
          <input type="image" src="/assets/blank_green.png"
                class="image-btn" style="">
          <svg class="image-btn-text" viewBox="0 0 266 160">
            <text class="text-stroke" x="50%" y="50%">%choice%</text>
            <text class="text-fill" x="50%" y="50%">%choice%</text>
          </svg>
        </div>
      `,

    stimulus: function(c) {
      console.log("instr stim " + instr_stim());
      console.log("instr prompt " + instr_prompt());
      const ctx = c.getContext('2d');
      const width = c.width;
      const height = c.height;
      const stimHTML = instr_stim();

      // Background
      ctx.fillStyle = "#fff9e0";
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      if (isMobile) {
        if (['kr', 'nl', 'ru'].includes(lang)) {
          drawHTMLText(ctx, stimHTML, canvasWidth / 2, height * 0.2, 64, device, classicGraphics);
        } else if (['cn', 'es'].includes(lang)) {
          drawHTMLText(ctx, stimHTML, canvasWidth / 2, height * 0.2, 84, device, classicGraphics);
        } else {
          drawHTMLText(ctx, stimHTML, canvasWidth / 2, height * 0.2, 96, device, classicGraphics );
        }
      } else if (isTablet) {
        if (['kr', 'nl', 'ru'].includes(lang)) {
          drawHTMLText(ctx, stimHTML, canvasWidth / 2, height * 0.1, 64, device, classicGraphics);
        } else {
          drawHTMLText(ctx, stimHTML, canvasWidth / 2, height * 0.1, 64, device, classicGraphics);
        }
      } else {
        if (['kr', 'nl', 'ru'].includes(lang)) {
          drawHTMLText(ctx, stimHTML, canvasWidth / 2, height * 0.2, 64, device, classicGraphics);
        } else {
          drawHTMLText(ctx, stimHTML, canvasWidth / 2, height * 0.2, 64, device, classicGraphics);
        }
      }

      ctx.restore();
    },
    on_load: function() {
      setupButtonListeners();
    },

    on_finish: function() {
      cleanupButtonListeners();
    },
    // add task name to data collection
    data: { task: "oMSTCont" },
  };
}

//---------------thank you--------------
// (button type not necessary)
var debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 500,
  stimulus: function () {
    return lang.cont.ty;
  },
  // add task name to data collection
  data: { task: "oMSTCont" },
};

// -------- graphical feedback ---------
const omst_feedback = (jsPsych) => ({
  type: resp_mode == "button" ? jsPsychCanvasButtonResponse : jsPsychCanvasKeyboardResponse, // TODO: Adapt this later for keyboard
  choices: instr_choice,
  canvas_size: [200, 600],
  on_start: function (trial) {
    trial.subjAge = 70; // TODO:  Will eventually get these numbers from the demog-form
    // Try to compute the LDI.  The data should be here by now
    let data = jsPsych.data.get();
    if (data === undefined) {
      trial.ldi = 0.0;
      trial.zscore = 0.0;
      console.log("NO DATA FOUND");
      return;
    }
    let validTrials = data.filterCustom(function (trial) {
      return trial.resp !== null;
    });
    //console.dir(validTrials);
    let lures = validTrials.filter({ condition: "lure" });
    let foils = validTrials.filter({ condition: "foil" });
    let lure_sim = lures.filter({ resp: "s" });
    let foil_sim = foils.filter({ resp: "s" });
    trial.ldi = lure_sim.count() / lures.count() - foil_sim.count() / foils.count();
    trial.zscore = (trial.ldi - (0.9688 - 0.006756 * trial.subjAge)) / 0.1753;
    console.log("LDI ", trial.ldi);
    //console.log(data)
  },
  prompt: lang.cont.ty,
  stimulus: function (c) {
    var ctx = c.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    //var randomNumber=-1.5;
    // Create gradient
    var grd = ctx.createLinearGradient(0, 0, 150, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(0.6, "yellow");
    grd.addColorStop(1, "green");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 30, 600, 160);

    let ldi = this.ldi.toFixed(2);
    let zscore = Math.min(Math.max(this.zscore, -2.95), 2.95);
    var xPos = ((zscore + 3) / 6) * 600; // Scale the random number to canvas width
    //console.log(ldi,zscore);
    //console.log(xPos);
    ctx.beginPath();
    ctx.moveTo(xPos, 30); // main line
    ctx.lineTo(xPos, 190);
    ctx.moveTo(xPos - 10, 20); // top arrow
    ctx.lineTo(xPos, 30);
    ctx.lineTo(xPos + 10, 20);
    ctx.moveTo(xPos - 10, 200); // bottom arrow
    ctx.lineTo(xPos, 190);
    ctx.lineTo(xPos + 10, 200);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgb(0 0 255 / 50%)";
    ctx.stroke();

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "black";
    //ctx.textAlign('center');  // shoot - don't seem to have these
    //ctx.textBaseline('top');
    //console.log('width',ctx.measureText(ldi.toString()))
    //let txtx = xPos - ctx.measureText(ldi.toString()).width / 2;
    //console.log(txtx)
    ctx.fillText(ldi.toString(), xPos - ctx.measureText(ldi.toString()).width / 2, 18);
  },
});

var retstr;

var dataCalcFunction = (data) => {
  let validtrials = data.filterCustom(function (trial) {
    return trial.resp !== null;
  });
  let targets = validtrials.filter({ condition: "target" });
  let lures = validtrials.filter({ condition: "lure" });
  let foils = validtrials.filter({ condition: "foil" });

  console.log("validtrials: " + validtrials.count());
  console.log("targets: " + targets.count());
  console.log("lures: " + lures.count());
  console.log("foils: " + foils.count());

  if (twochoice == 1) {
    let corr_targs = targets.filter({ correct: true });
    let corr_lures = lures.filter({ correct: true });
    let corr_foils = foils.filter({ correct: true });
    let hits = Math.round((corr_targs.count() / targets.count()) * 100);
    let cr_lure = Math.round((corr_lures.count() / lures.count()) * 100);
    let cr_foil = Math.round((corr_foils.count() / foils.count()) * 100);
    let p_fa_foil = 0.0;
    let p_fa_lure = 0.0;
    let p_hit = 0.0;
    if (corr_targs.count() == 0) {
      p_hit = 0.5 / targets.count();
    } else if (corr_targs.count() == targets.count()) {
      p_hit = (targets.count() - 0.5) / targets.count();
    } else {
      p_hit = corr_targs.count() / targets.count();
    }

    if (corr_lures.count() == lures.count()) {
      p_fa_lure = 0.5 / lures.count();
    } else if (corr_lures.count() == 0) {
      p_fa_lure = (lures.count() - 0.5) / lures.count();
    } else {
      p_fa_lure = 1 - corr_lures.count() / lures.count();
    }

    if (corr_foils.count() == foils.count()) {
      p_fa_foil = 0.5 / foils.count();
    } else if (corr_foils.count() == 0) {
      p_fa_foil = (foils.count() - 0.5) / foils.count();
    } else {
      p_fa_foil = 1 - corr_foils.count() / foils.count();
    }

    console.log(corr_targs.count() + " " + targets.count() + " " + p_hit);
    console.log(corr_lures.count() + " " + lures.count() + " " + p_fa_lure);
    console.log(corr_foils.count() + " " + foils.count() + " " + p_fa_foil);
    console.log(invNormcdf(p_hit));
    console.log(invNormcdf(p_fa_lure));
    console.log(invNormcdf(p_fa_foil));

    let dpTF = invNormcdf(p_hit) - invNormcdf(p_fa_foil);
    let dpTL = invNormcdf(p_hit) - invNormcdf(p_fa_lure);

    retstr =
      "HR, " +
      hits +
      ", CR-L, " +
      cr_lure +
      ", CR-F rate, " +
      cr_foil +
      ", d'T:F, " +
      dpTF.toFixed(3) +
      ", d'T:L, " +
      dpTL.toFixed(3);

    console.log("retstr:" + retstr);

    return retstr;
  } else {
    // OSN
    let targ_old = targets.filter({ resp: "o" });
    let targ_sim = targets.filter({ resp: "s" });
    let targ_new = targets.filter({ resp: "n" });
    let lure_old = lures.filter({ resp: "o" });
    let lure_sim = lures.filter({ resp: "s" });
    let lure_new = lures.filter({ resp: "n" });
    let foil_old = foils.filter({ resp: "o" });
    let foil_sim = foils.filter({ resp: "s" });
    let foil_new = foils.filter({ resp: "n" });

    let rec = targ_old.count() / targets.count() - foil_old.count() / foils.count();
    let ldi = lure_sim.count() / lures.count() - foil_sim.count() / foils.count();
    // removed var
    retstr = "Valid, " + targets.count() + ", " + lures.count() + ", " + foils.count() + "\n";
    retstr += "Old, " + targ_old.count() + ", " + lure_old.count() + ", " + foil_old.count() + "\n";
    retstr +=
      "Similar, " + targ_sim.count() + ", " + lure_sim.count() + ", " + foil_sim.count() + "\n";
    retstr += "New, " + targ_new.count() + ", " + lure_new.count() + ", " + foil_new.count() + "\n";
    retstr += "REC, " + rec.toFixed(3) + ", LDI, " + ldi.toFixed(3);

    console.log("ldi: " + ldi);
    console.log("retstr: " + retstr);

    return retstr;
  }
};
//----------------------- 4 ----------------------
//--------------------- EXPORTS -------------------

export {
  refresh_cont_trials,
  omst_preload,
  instr_trial,
  omst_feedback,
  debrief_block,
  dataCalcFunction,
  retstr,
};
