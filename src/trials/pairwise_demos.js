//*******************************************************************
//
//   File: pairwise_demos.js               Folder: trials
//
//   Author: Gavin Stark
//   --------------------
//   Copied from pcon_demos.js with changes pulled from pairwise.html
//   --------------------
//   This file includes the instruction and demo trials of the pairwise perceptual
//   control task as well as a pcon data analysis function.
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
//import jsPsychImageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
//import jsPsychImageButtonResponse from "@jspsych/plugin-image-button-response";
import jsPsychCanvasKeyboardResponse from "@jspsych/plugin-canvas-keyboard-response";
import jsPsychCanvasButtonResponse from "@jspsych/plugin-canvas-button-response";
import jsPsychPreload from "@jspsych/plugin-preload";

import { lang, resp_mode, classic_graphics } from "../App/components/Login";
import {
  images,
  invNormcdf,
  fitIntroOutroToScreen,
  setupButtonListeners,
  cleanupButtonListeners,
  fitSideBySideTrialToScreen,
  roundRect,
  calculateSideBySideCanvasSize,
  getDeviceType,
} from "../lib/utils";

import "./css/pcon_demos.css";

//----------------------- 2 ----------------------
//----------------- HELPER METHODS ---------------
// These methods house the dynamic parameters of the trials below.

// var to store the task name (data property)
const phasename = "pairwise";

var instr_choice = function () {
  if (resp_mode == "button") {
    console.log("RETURNING: ", lang.pcon.button.instr_choice);
    return [lang.pcon.button.instr_choice];
  } else {
    return lang.pcon.key.instr_choice;
  }
};

var q_prompt = function () {
  if (resp_mode == "button") {
    return lang.pcon.button.trial_txt;
  } else {
    return lang.pcon.key.trial_txt;
  }
};

var instr1_prompt = function () {
  if (resp_mode == "button") {
    return lang.pcon.button.instr1_prompt;
  } else {
    return lang.pcon.key.instr1_prompt;
  }
};

var instr1_stim = function () {
  return "In this task, you will see two objects appear on the screen at the same time. \
    Your job is to determine if the two images are <i>exactly the same</i> \
    or similar to each other.";
};

var instr2_prompt = function () {
  if (resp_mode == "button") {
    return lang.pcon.button.instr2_prompt;
  } else {
    return lang.pcon.key.instr2_prompt;
  }
};

var instr3_prompt = function () {
  if (resp_mode == "button") {
    return lang.pcon.button.instr3_prompt;
  } else {
    return lang.pcon.key.instr3_prompt;
  }
};

var trial_choices = function () {
  if (resp_mode == "button") {
    return [`${lang.pcon.button.trial_choices.same}`, `${lang.pcon.button.trial_choices.dif}`];
  } else {
    return [`${lang.pcon.key.trial_choices.same}`, `${lang.pcon.key.trial_choices.dif}`];
  }
};

function makeSideBySideTrial(imgLeft, imgRight, stimulusText, promptText, buttonLabel) {
  console.log("button label", buttonLabel);

  return {
    type: resp_mode == "button" ? jsPsychCanvasButtonResponse : jsPsychCanvasKeyboardResponse,
    choices: [buttonLabel],
    canvas_size: calculateSideBySideCanvasSize(smallScreen, true, true),
    stimulus: function (c) {
      const ctx = c.getContext("2d");
      ctx.fillStyle = classicGraphics ? "white" : "#fff9e0";
      const gap = 60; // spacing between the two images
      const framePadding = 20;
      const radius = 25;
      const width = c.width;
      const height = c.height;
      ctx.fillRect(0, 0, width, height);

      const imgL = new Image();
      const imgR = new Image();

      imgL.onload = imgR.onload = function () {
        // Calculate image size to fit within canvas
        // Two images side by side with a gap

        const availableWidth = (width - gap - framePadding * 4) / 2;
        const availableHeight = height - framePadding * 2;

        // Use the smaller dimension to ensure images fit
        const imgSize = Math.min(availableWidth, availableHeight);

        const imgWidth = imgSize;
        const imgHeight = imgSize;
        const totalWidth = imgWidth * 2 + gap;
        const x = (width - totalWidth) / 2;
        const y = (height - imgHeight) / 2;

        // draw function for each image
        function drawFramedImage(img, xPos) {
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#5d2514";
          ctx.lineWidth = 15;
          if (!classicGraphics) {
            roundRect(
              ctx,
              xPos - framePadding,
              y - framePadding,
              imgWidth + 2 * framePadding,
              imgHeight + 2 * framePadding,
              radius
            );
          }
          ctx.fill();
          ctx.stroke();
          ctx.drawImage(img, xPos, y, imgWidth, imgHeight);
        }
        drawFramedImage(imgL, x);
        drawFramedImage(imgR, x + imgWidth + gap);
      };

      imgL.src = imgLeft;
      imgR.src = imgRight;
    },
    prompt: `<div class="prompt_text">${promptText}</div>`,
    button_html: classicGraphics
      ? `<div class="image-btn-wrapper" style="margin-top: 40px;">
          <input type="image" src="./assets/blank_button.png"
                class="image-btn">
          <svg class="image-btn-text" viewBox="0 0 266 160">
            <text x="50%" y="50%">%choice%</text>
          </svg>
        </div>`
      : `<div class="image-btn-wrapper" style="margin-top: 40px;">
          <input type="image" src="./assets/blank_green.png"
                class="image-btn">
          <svg class="image-btn-text" viewBox="0 0 266 160">
            <text class="text-stroke" x="50%" y="50%">%choice%</text>
            <text class="text-fill" x="50%" y="50%">%choice%</text>
          </svg>
        </div>`,
    on_load: function () {
      // Insert stimulus text above the canvas
      const canvasElement = document.querySelector(".jspsych-content canvas");
      if (canvasElement && stimulusText) {
        const stimulusDiv = document.createElement("div");
        stimulusDiv.className = "prompt_text stimulus_div";
        stimulusDiv.style.textAlign = "center";
        stimulusDiv.style.padding = "0px 20px";
        stimulusDiv.innerHTML = `<p class="prompt_text">${stimulusText}</p>`;
        canvasElement.parentNode.insertBefore(stimulusDiv, canvasElement);
      }

      requestAnimationFrame(() => {
        fitSideBySideTrialToScreen(smallScreen, true);
      });

      setupButtonListeners();
    },

    on_finish: function () {
      cleanupButtonListeners();
    },
  };
}

function makeSideBySideChoice(
  buttonLabels,
  image1,
  image2,
  score = false,
  data = null,
  STIMULUS_DURATION = 2000,
  prompt = ""
) {
  return {
    type: resp_mode == "button" ? jsPsychCanvasButtonResponse : jsPsychCanvasKeyboardResponse,
    post_trial_gap: 500,
    choices: buttonLabels,
    render_on_canvas: true,
    clear_canvas: false,
    prompt: `<p class="prompt_text">${prompt}</p>`,
    button_html: classicGraphics
      ? buttonLabels.map(
          (txt) => `
        <div class="image-btn-wrapper">
            <input type="image" src="./assets/blank_button.png"
                class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
            <text x="50%" y="50%">${txt}</text>
            </svg>
        </div>
        `
        )
      : buttonLabels.map(
          (txt, i) => `
        <div class="image-btn-wrapper">
            <input type="image" src="./assets/blank_${["red", "green"][i]}.png"
                class="image-btn" >
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
            <text class="text-stroke" x="50%" y="50%">${txt}</text>
            <text class="text-fill" x="50%" y="50%">${txt}</text>
            </svg>
        </div>
        `
        ),
    canvas_size: [canvasHeight * 0.8, canvasWidth],

    stimulus: function (c) {
      const img1 = image1;
      const img2 = image2;
      const ctx = c.getContext("2d");
      const width = c.width;
      const height = c.height;
      ctx.fillStyle = classicGraphics ? "white" : "#fff9e0";
      ctx.fillRect(0, 0, width, height);

      const gap = 60; // spacing between images
      const framePadding = 20;
      const radius = 25;
      const imgL = new Image();
      const imgR = new Image();

      // Star and brain setup
      const totalStars = 5;
      const maxFill = 10; // star1–star10
      const starSize = Math.min(width, height) * 0.15;
      const spacing = starSize * 0.25;
      const brainScale = smallScreen ? 0.15 : 0.2;

      function drawScene() {
        // === Progress info (stars/brain) ===
        const progress = num_correct * 4; // w/ 26 trials we want each correct answer to fill 1/5 of a star
        // Draw stars and brain
        const step = Math.floor(((progress % (maxFill * 2)) + 1) / 2) || 0;
        const fullStars = Math.floor(progress / 2 / maxFill);
        const fillLevel = step;
        const currentLevel = Math.min(fillLevel, 10);

        if (score && !classicGraphics) {
          const leftX = smallScreen ? 10 : 40;
          const leftStartY = height * 0.25;

          for (let i = 0; i < fullStars; i++) {
            const star = starImgs[10];
            const posY = leftStartY + (i % 2) * (starSize + spacing);
            star.onload = function () {
              ctx.drawImage(
                star,
                leftX + Math.floor(i / 2) * (starSize + spacing),
                posY,
                starSize,
                starSize
              );
            };
            ctx.drawImage(
              star,
              leftX + Math.floor(i / 2) * (starSize + spacing),
              posY,
              starSize,
              starSize
            );
          }

          const currentStar = starImgs[currentLevel];
          const activeStarScale = 1.75;
          const activeStarSize = starSize * activeStarScale;
          const brainW = brain.width * brainScale;
          const brainH = brain.height * brainScale;
          const brainX = width - brainW - 60;
          const brainY = height * 0.55;

          const starX = brainX + brainW / 2 - activeStarSize / 2;
          const starY = brainY - activeStarSize * 1.2;

          ctx.drawImage(brain, brainX, brainY, brainW, brainH);
          currentStar.onload = function () {
            ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize);
          };
          if (currentStar.complete) {
            ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize);
          }
        }
        return;
      }

      imgL.onload = imgR.onload = function () {
        drawScene();

        // *** CALCULATE AVAILABLE SPACE FOR IMAGES ***
        const topMargin = 15;
        const bottomMargin = 30;
        const imageTopY = topMargin;
        const availableHeight = height - imageTopY - bottomMargin;
        const horizontalSpace = width * 0.6;

        // Two square images side by side with gap
        const availableWidthPerImage = (horizontalSpace - gap - framePadding * 4) / 2;
        const availableHeightForImages = availableHeight - framePadding * 2;

        // Use square images - take the smaller dimension
        const imgSize = Math.min(availableWidthPerImage, availableHeightForImages);

        const imgWidth = imgSize;
        const imgHeight = imgSize;
        const totalWidth = imgWidth * 2 + gap;
        const x = (width - totalWidth) / 2;
        const y = imageTopY + (availableHeight - imgHeight - 2 * framePadding) / 2;

        // Draw function for each image
        function drawFramedImage(img, xPos) {
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#5d2514";
          ctx.lineWidth = 15;
          if (!classicGraphics) {
            roundRect(
              ctx,
              xPos - framePadding,
              y - framePadding,
              imgWidth + 2 * framePadding,
              imgHeight + 2 * framePadding,
              radius
            );
          }
          ctx.fill();
          ctx.stroke();
          ctx.drawImage(img, xPos, y, imgWidth, imgHeight);
        }

        drawFramedImage(imgL, x);
        drawFramedImage(imgR, x + imgWidth + gap);

        // Store for setTimeout clear
        imgL._renderInfo = { x: x, y, imgWidth, imgHeight };
        imgR._renderInfo = { x: x + imgWidth + gap, y, imgWidth, imgHeight };
      };

      imgL.src = img1;
      imgR.src = img2;
      // After stimulus duration, remove both images + frames
      const startTime = performance.now();
      function checkAndClear() {
        if (performance.now() - startTime >= STIMULUS_DURATION) {
          if (imgL._renderInfo && imgR._renderInfo) {
            const ctx2 = c.getContext("2d");
            const lineWidth = 15;
            // Clear left/top image
            ctx2.clearRect(
              imgL._renderInfo.x - framePadding - lineWidth,
              imgL._renderInfo.y - framePadding - lineWidth,
              imgL._renderInfo.imgWidth + 2 * framePadding + lineWidth * 2,
              imgL._renderInfo.imgHeight + 2 * framePadding + lineWidth * 2
            );
            // Clear right/bottom image
            ctx2.clearRect(
              imgR._renderInfo.x - framePadding - lineWidth,
              imgR._renderInfo.y - framePadding - lineWidth,
              imgR._renderInfo.imgWidth + 2 * framePadding + lineWidth * 2,
              imgR._renderInfo.imgHeight + 2 * framePadding + lineWidth * 2
            );
          }
        } else {
          requestAnimationFrame(checkAndClear);
        }
      }
      requestAnimationFrame(checkAndClear);
    },

    on_load: function () {
      setupButtonListeners();
    },

    on_finish: function (data) {
      if (score) {
        let resp = null;
        if (resp_mode == "button") {
          // For 2 buttons: 0 = same, 1 = similar
          if (data.response == 0) {
            resp = "s";
          } else if (data.response == 1) {
            resp = "d";
          }
        } else {
          // Add keyboard mappings if needed
          if (data.response == "s") {
            resp = "s";
          } else if (data.response == "d") {
            resp = "d";
          }
        }
        data.correct = resp == data.cresp;
        data.resp = resp;
        console.log(data.resp, data.cresp, data.correct);

        if (data.correct) {
          num_correct += 1;
          console.log("num_correct: " + num_correct);
        }
        data.resp = resp;
        console.log(data.resp, data.cresp, data.correct);
      }
      cleanupButtonListeners();
    },
    data: data,
  };
}

//----------------------- 3 ----------------------
//--------------------- CONSTANTS -------------------
let device = {};
let smallScreen = {};
let canvasWidth = {};
let canvasHeight = {};
let classicGraphics = {};

function assignVars() {
  device = getDeviceType();
  smallScreen = device[2];
  canvasWidth = window.innerWidth * 0.9;
  canvasHeight = smallScreen ? window.innerHeight * 0.75 : window.innerHeight * 0.7;
  console.log("Canvas width: " + canvasWidth + ", Canvas height: " + canvasHeight);
  console.log("Window width: " + window.innerWidth + ", Window height: " + window.innerHeight);
  classicGraphics = classic_graphics;
  if (classicGraphics) {
    document.body.classList.add("classic");
  }
  console.log("classicGraphics " + classicGraphics);
}
let num_correct = 0;
const brain = new Image();
brain.src = "./assets/brain.png";

const starImgs = Array.from({ length: 11 }, (_, i) => {
  let img = new Image();
  img.src = `./assets/star${i}.png`;
  return img;
});

//----------------------- 4 ----------------------
//-------------------- TRIALS --------------------

var pairwise_preload = {
  type: jsPsychPreload,
  auto_preload: true,
  on_load: function () {
    const container = document.querySelector(".jspsych-content");
    console.log("container in pairwise_preload on_load:", container);
    if (container) {
      container.classList.add("pcon-demos");
    }
  },
};

//initiate trials to be loaded within the refresh function
var pairwise_instr1_trial = {};
var pairwise_demo1_trial = {};
var pairwise_instr2_trial = {};
var pairwise_demo2_trial = {};
var pairwise_instr3_trial = {};
var pairwise_end = {};

// refresh function called on Login once options for resp_mode and lang are set
function refresh_pairwise_trials() {
  console.log("...refreshing pairwise trials");
  assignVars();
  pairwise_instr1_trial = {
    type: resp_mode == "button" ? jsPsychHtmlButtonResponse : jsPsychHtmlKeyboardResponse,
    choices: instr_choice(),
    button_html: classicGraphics
      ? `<div class="image-btn-wrapper">
          <input type="image" src="./assets/blank_button.png"
                class="image-btn">
          <svg class="image-btn-text" viewBox="0 0 266 160">
            <text x="50%" y="50%">%choice%</text>
          </svg>
        </div>`
      : `<div class="image-btn-wrapper">
          <input type="image" src="./assets/blank_green.png"
                class="image-btn">
          <svg class="image-btn-text" viewBox="0 0 266 160">
            <text class="text-stroke" x="50%" y="50%">%choice%</text>
            <text class="text-fill" x="50%" y="50%">%choice%</text>
          </svg>
        </div>`,
    on_load: function () {
      requestAnimationFrame(() => {
        fitIntroOutroToScreen(smallScreen);
      });

      setupButtonListeners();
    },
    on_finish: function () {
      cleanupButtonListeners();
    },

    prompt: `<p class="prompt_text">${instr1_prompt()}</p>`,
    stimulus: `<p class="prompt_text intro" >${instr1_stim()}</p>`,
  };

  pairwise_demo1_trial = {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",
        trial_duration: 1000,
        response_ends_trial: false,
        data: { task: phasename },
        stimulus: `<p class="prompt_text" >` + lang.pcon.ready + "</p>",
        on_load: function () {
          const contentDiv = document.querySelector(".jspsych-content");
          if (contentDiv) {
            contentDiv.classList.remove("start");
          }
        },
      },

      makeSideBySideChoice(
        trial_choices(),
        images["pprac1a.jpg"],
        images["pprac1a.jpg"],
        false,
        null,
        2000,
        q_prompt()
      ),
    ],
  };

  pairwise_instr2_trial = makeSideBySideTrial(
    images["pprac1a.jpg"],
    images["pprac1a.jpg"],
    lang.pcon.instr2_stim,
    instr2_prompt(),
    instr_choice()
  );

  pairwise_demo2_trial = {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",
        trial_duration: 1000,
        response_ends_trial: false,
        data: { task: phasename },
        stimulus: `<p class="prompt_text" >` + lang.pcon.ready + "</p>",
      },
      makeSideBySideChoice(
        trial_choices(),
        images["pprac2a.jpg"],
        images["pprac2b.jpg"],
        false,
        null,
        2000,
        q_prompt()
      ),
    ],
  };

  pairwise_instr3_trial = makeSideBySideTrial(
    images["pprac2a.jpg"],
    images["pprac2b.jpg"],
    lang.pcon.instr3_stim,
    instr3_prompt(),
    instr_choice()
  );

  pairwise_end = {
    type: jsPsychHtmlKeyboardResponse,
    trial_duration: 500,
    stimulus: `<p class="prompt_text">${lang.pcon.ty}</p>`,
    response_ends_trial: false,
    data: { task: phasename },
  };

  console.log("pairwise trials refreshed");
}

// pcon data summary function called on experiment end to include the summary in the data file
var pconDataCalcFunction = (data) => {
  let validtrials = data.filterCustom(function (trial) {
    return trial.resp !== null;
  });
  let targets = validtrials.filter({ cresp: "s" });
  let foils = validtrials.filter({ cresp: "d" });

  console.log("valid pcon trials: " + validtrials.count());
  console.log("targets: " + targets.count());
  console.log("foils: " + foils.count());

  let corr_targs = targets.filter({ correct: true });
  let corr_foils = foils.filter({ correct: true });

  let hits = Math.round(corr_targs.count() / targets.count());
  let crs = Math.round(corr_foils.count() / foils.count());
  let p_fa = 0.0;
  let p_hit = 0.0;
  if (corr_targs.count() == 0) {
    p_hit = 0.5 / targets.count();
  } else if (corr_targs.count() == targets.count()) {
    p_hit = (targets.count() - 0.5) / targets.count();
  } else {
    p_hit = corr_targs.count() / targets.count();
  }

  if (corr_foils.count() == foils.count()) {
    p_fa = 0.5 / foils.count();
  } else if (corr_foils.count() == 0) {
    p_fa = (foils.count() - 0.5) / foils.count();
  } else {
    p_fa = 1 - corr_foils.count() / foils.count();
  }

  console.log(corr_targs.count() + " " + targets.count() + " " + p_hit);
  console.log(corr_foils.count() + " " + foils.count() + " " + p_fa);
  console.log(invNormcdf(p_hit));
  console.log(invNormcdf(p_fa));

  let dpTF = invNormcdf(p_hit) - invNormcdf(p_fa);

  var retstr =
    "HR, " + hits.toFixed(3) + ", CR rate, " + crs.toFixed(3) + ", d'T:F, " + dpTF.toFixed(3);
  data.summary = retstr;
  console.log("retstr:" + retstr);
  return retstr;
};

//----------------------- 4 ----------------------
//--------------------- EXPORTS -------------------

export {
  pairwise_preload,
  refresh_pairwise_trials,
  pairwise_instr1_trial,
  pairwise_demo1_trial,
  pairwise_instr2_trial,
  pairwise_demo2_trial,
  pairwise_instr3_trial,
  pairwise_end,
  pconDataCalcFunction,
  makeSideBySideChoice,
};
