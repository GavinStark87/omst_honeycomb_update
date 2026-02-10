//*******************************************************************
//
//   File: pcon_demos.js               Folder: trials
//
//   Author: Craig Stark, Audrey Hempel
//   --------------------
//
//   Changes:
//        7/31/23 (AGH): initial convert from pcon.html into honeycomb
//                       template
//        8/1/23  (AGH): added wait method to allow formatting
//                       modified side by side display stimuli
//                       (instr2_stim and instr3_stim)
//        8/11/23 (AGH): changed trial_txt to trial_text for consistency
//
//   --------------------
//   This file includes the instruction and demo trials of the perceptual
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
import jsPsychAnimation from "@jspsych/plugin-animation";
import jsPsychPreload from "@jspsych/plugin-preload";

import { lang, resp_mode } from "../App/components/Login";
import {
  images,
  invNormcdf,
  fitIntroOutroToScreen,
  setupButtonListeners,
  cleanupButtonListeners,
  fitSideBySideToScreen,
  roundRect,
  calculateSideBySideCanvasSize,
  getDeviceType,
} from "../lib/utils";

import "./css/pcon_demos.css";

//----------------------- 2 ----------------------
//----------------- HELPER METHODS ---------------
// These methods house the dynamic parameters of the trials below.

// var to store the task name (data property)
const phasename = "pcon";

var noise_sequence = [
  images["noise_1.png"],
  images["noise_2.png"],
  images["noise_3.png"],
  images["noise_4.png"],
  images["noise_5.png"],
];

var instr_choice = function () {
  if (resp_mode == "button") {
    return [lang.pcon.button.instr_choice];
  } else {
    return lang.pcon.key.instr_choice;
  }
};

var wait = function () {
  return lang.pcon.wait;
};

var instr1_prompt = function () {
  if (resp_mode == "button") {
    return lang.pcon.button.instr1_prompt;
  } else {
    return lang.pcon.key.instr1_prompt;
  }
};

var instr1_stim = function () {
  return lang.pcon.instr1_stim;
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

function makeSideBySideTrial(imgLeft, imgRight, promptText, buttonLabel) {
  return {
    type: resp_mode == "button" ? jsPsychCanvasButtonResponse : jsPsychCanvasKeyboardResponse,
    choices: [buttonLabel],
    canvas_size: calculateSideBySideCanvasSize(isMobile, isTablet, smallScreen), // Calculate based on horizontal allocation
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
    prompt: `<p class="prompt_text" style="margin-bottom: 20;">${promptText}</p>`,
    button_html: classicGraphics
      ? `<div class="image-btn-wrapper">
        <input type="image" src="/assets/blank_button.png"
              class="image-btn">
        <svg class="image-btn-text" viewBox="0 0 266 160">
          <text x="50%" y="50%">%choice%</text>
        </svg>
      </div>`
      : `<div class="image-btn-wrapper">
        <input type="image" src="/assets/blank_green.png"
              class="image-btn">
        <svg class="image-btn-text" viewBox="0 0 266 160">
          <text class="text-stroke" x="50%" y="50%">%choice%</text>
          <text class="text-fill" x="50%" y="50%">%choice%</text>
        </svg>
      </div>`,
    on_load: function () {
      requestAnimationFrame(() => {
        fitSideBySideToScreen(isMobile, isTablet, smallScreen);
      });

      setupButtonListeners();
    },

    on_finish: function () {
      cleanupButtonListeners();
    },
  };
}

//----------------------- 3 ----------------------
//--------------------- CONSTANTS -------------------
const device = getDeviceType();
console.log("have device " + device);
const isMobile = device[0];
const isTablet = device[1];
const smallScreen = device[2];
console.log("smallScreen " + smallScreen);
const canvasWidth = isMobile
  ? stars_12
    ? window.innerWidth * 1
    : window.innerWidth * 0.9
  : isTablet
    ? stars_12
      ? window.innerWidth * 1
      : window.innerWidth * 0.9
    : window.innerWidth * 0.9;
const canvasHeight = isMobile
  ? window.innerHeight * 0.65
  : smallScreen
    ? window.innerHeight * 0.75
    : isTablet
      ? window.innerHeight * 0.8
      : window.innerHeight * 0.7;
const classicGraphics = false; // for now
const stars_12 = true; // for now

//----------------------- 4 ----------------------
//-------------------- TRIALS --------------------

var pcon_preload = {
  type: jsPsychPreload,
  auto_preload: true,
  on_load: function () {
    const container = document.querySelector(".jspsych-content");
    console.log("container in pcon_preload on_load:", container);
    if (container) {
      container.classList.add("pcon-demos");
    }
  },
};

//initiate trials to be loaded within the refresh function
var instr1_trial = {};
var demo1_trial = {};
var instr2_trial = {};
var demo2_trial = {};
var instr3_trial = {};
var pcon_end = {};

// refresh function called on Login once options for resp_mode and lang are set
function refresh_pcon_trials() {
  console.log("...refreshing pcon trials");

  instr1_trial = {
    type: resp_mode == "button" ? jsPsychHtmlButtonResponse : jsPsychHtmlKeyboardResponse,
    choices: instr_choice(),
    button_html: classicGraphics
      ? `<div class="image-btn-wrapper">
          <input type="image" src="/assets/blank_button.png"
                class="image-btn">
          <svg class="image-btn-text" viewBox="0 0 266 160">
            <text x="50%" y="50%">%choice%</text>
          </svg>
        </div>`
      : `<div class="image-btn-wrapper">
          <input type="image" src="/assets/blank_green.png"
                class="image-btn">
          <svg class="image-btn-text" viewBox="0 0 266 160">
            <text class="text-stroke" x="50%" y="50%">%choice%</text>
            <text class="text-fill" x="50%" y="50%">%choice%</text>
          </svg>
        </div>`,
    on_load: function () {
      requestAnimationFrame(() => {
        fitIntroOutroToScreen(isMobile, isTablet, smallScreen);
      });

      setupButtonListeners();
    },
    on_finish: function () {
      cleanupButtonListeners();
    },

    prompt: `<p class="prompt_text">${instr1_prompt()}</p>`,
    stimulus: `<p class="prompt_text intro" >${instr1_stim()}</p>`,
  };

  demo1_trial = {
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
      {
        //type: (resp_mode == 'button' ? jsPsychImageButtonResponse : jsPsychImageKeyboardResponse),
        //choices: (resp_mode == 'button' ? ['Same','Different'] : "NO_KEYS"),
        //button_html: '<button class="jspsych-btn dimtext">%choice%</button>',
        type: jsPsychCanvasKeyboardResponse,

        // Canvas stimulus
        stimulus: function (c) {
          const ctx = c.getContext("2d");
          const width = c.width;
          const height = c.height;
          const stimImg = new Image();
          const framePadding = 20;
          const radius = 25;

          stimImg.onload = function () {
            const imgWidth = isMobile
              ? stimImg.width * 1.5
              : isTablet
                ? stimImg.width * 1.2
                : smallScreen
                  ? canvasHeight * 0.8
                  : stimImg.width * 1.2;
            const imgHeight = isMobile
              ? stimImg.height * 1.5
              : isTablet
                ? stimImg.height * 1.2
                : smallScreen
                  ? canvasHeight * 0.8
                  : stimImg.height * 1.2;
            const x = (width - imgWidth) / 2;
            const y = (height - imgHeight) / 2 - (isMobile ? 0 : 0); // shift up slightly

            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#5d2514";
            ctx.lineWidth = 15;
            if (!classicGraphics) {
              roundRect(
                ctx,
                x - framePadding,
                y - framePadding,
                imgWidth + 2 * framePadding,
                imgHeight + 2 * framePadding,
                radius
              );
            }
            ctx.fill();
            ctx.stroke();

            ctx.drawImage(stimImg, x, y, imgWidth, imgHeight);
          };
          stimImg.src = images["pprac1a.jpg"];
        },
        choices: "NO_KEYS",
        canvas_size: [canvasHeight, canvasWidth],
        trial_duration: 2000,
        data: { task: phasename },
      },
      {
        type: jsPsychAnimation,
        stimuli: noise_sequence,
        sequence_reps: 2,
        frame_time: 200,
        render_on_canvas: true,
        prompt: `<p class="prompt_text" id="animation-prompt">${wait()}</p>`,
        on_start: function (trial) {
          // The trial won't render until this Promise resolves
          console.log("Preloading animation images before showing anything...");

          return new Promise((resolve) => {
            let loadedCount = 0;
            const totalImages = trial.stimuli.length;
            const images = [];

            trial.stimuli.forEach((src, index) => {
              const img = new Image();

              img.onload = () => {
                loadedCount++;
                console.log(`Loaded ${loadedCount}/${totalImages}`);

                if (loadedCount === totalImages) {
                  console.log("ALL IMAGES LOADED. Now showing animation trial.");
                  resolve(); // This allows the trial to render
                }
              };

              img.onerror = () => {
                console.error(`Failed to load image ${index}: ${src}`);
                loadedCount++;
                if (loadedCount === totalImages) {
                  resolve();
                }
              };

              img.src = src;
              images.push(img);
            });
          });
        },
        on_load: function () {
          // This runs AFTER on_start resolves and trial is displayed
          const canvas = document.querySelector("canvas");

          if (canvas) {
            canvas.style.width = canvasWidth;
            canvas.style.height = canvasHeight;
            canvas.style.objectFit = "contain";
            canvas.style.display = "block";
            canvas.style.margin = "0 auto";
          }

          const content = document.querySelector(".jspsych-content");
          if (content) {
            content.style.textAlign = "center";
          }

          const promptText = document.getElementById("animation-prompt");
          if (promptText) {
            promptText.style.visibility = "visible";
          }

          console.log("Animation trial is now visible and running");
        },
        data: { task: phasename },
      },
      {
        //prompt: trial_prompt(),
        type: resp_mode == "button" ? jsPsychCanvasButtonResponse : jsPsychCanvasKeyboardResponse,
        data: { task: phasename },
        // Canvas stimulus
        stimulus: function (c) {
          const ctx = c.getContext("2d");
          const width = c.width;
          const height = c.height;
          const stimImg = new Image();
          const stimPath = images["pprac1a.jpg"];
          const framePadding = 20;
          const radius = 25;

          stimImg.onload = function () {
            const imgWidth = isMobile
              ? stimImg.width * 1.5
              : isTablet
                ? stimImg.width * 1.2
                : smallScreen
                  ? canvasHeight * 0.8
                  : stimImg.width * 1.2;
            const imgHeight = isMobile
              ? stimImg.height * 1.5
              : isTablet
                ? stimImg.height * 1.2
                : smallScreen
                  ? canvasHeight * 0.8
                  : stimImg.height * 1.2;
            const x = (width - imgWidth) / 2;
            const y = (height - imgHeight) / 2 - (isMobile ? 0 : 0); // shift up slightly

            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#5d2514";
            ctx.lineWidth = 15;
            if (!classicGraphics) {
              roundRect(
                ctx,
                x - framePadding,
                y - framePadding,
                imgWidth + 2 * framePadding,
                imgHeight + 2 * framePadding,
                radius
              );
            }
            ctx.fill();
            ctx.stroke();

            ctx.drawImage(stimImg, x, y, imgWidth, imgHeight);
          };
          stimImg.src = stimPath;
        },
        choices: trial_choices(),
        //stimulus_duration: 2000,
        canvas_size: [canvasHeight * 0.95, canvasWidth],
        trial_duration: null,
        response_ends_trial: true,
        margin_horizontal: "40px",
        button_html: classicGraphics
          ? [
              `<div class="image-btn-wrapper">
            <input type="image" src="/assets/blank_button.png"
                  class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
              <text x="50%" y="50%">%choice%</text>
            </svg>
          </div>`,

              `<div class="image-btn-wrapper">
            <input type="image" src="/assets/blank_button.png"
                  class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
              <text x="50%" y="50%">%choice%</text>
            </svg>
          </div>`,
            ]
          : [
              `<div class="image-btn-wrapper">
            <input type="image" src="/assets/blank_green.png"
                  class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
              <text class="text-stroke" x="50%" y="50%">%choice%</text>
              <text class="text-fill" x="50%" y="50%">%choice%</text>
            </svg>
          </div>`,

              `<div class="image-btn-wrapper">
            <input type="image" src="/assets/blank_blue.png"
                  class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
              <text class="text-stroke" x="50%" y="50%">%choice%</text>
              <text class="text-fill" x="50%" y="50%">%choice%</text>
            </svg>
          </div>`,
            ],
        on_load: function () {
          setupButtonListeners();
        },

        on_finish: function () {
          cleanupButtonListeners();
        },
      },
    ],
  };

  instr2_trial = makeSideBySideTrial(
    images["pprac1a.jpg"],
    images["pprac1a.jpg"],
    `<p class="prompt_text">${lang.pcon.instr2_stim + "<br><br>" + instr2_prompt()}</p>`,
    instr_choice()
  );

  demo2_trial = {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",
        trial_duration: 1000,
        response_ends_trial: false,
        data: { task: phasename },
        stimulus: `<p class="prompt_text" >` + lang.pcon.ready + "</p>",
      },
      {
        //type: (resp_mode == 'button' ? jsPsychImageButtonResponse : jsPsychImageKeyboardResponse),
        //choices: (resp_mode == 'button' ? ['Same','Different'] : "NO_KEYS"),
        //button_html: '<button class="jspsych-btn dimtext">%choice%</button>',
        type: jsPsychCanvasKeyboardResponse,

        // Canvas stimulus
        stimulus: function (c) {
          const ctx = c.getContext("2d");
          const width = c.width;
          const height = c.height;
          const stimImg = new Image();
          const framePadding = 20;
          const radius = 25;

          stimImg.onload = function () {
            const imgWidth = isMobile
              ? stimImg.width * 1.5
              : isTablet
                ? stimImg.width * 1.2
                : smallScreen
                  ? canvasHeight * 0.8
                  : stimImg.width * 1.2;
            const imgHeight = isMobile
              ? stimImg.height * 1.5
              : isTablet
                ? stimImg.height * 1.2
                : smallScreen
                  ? canvasHeight * 0.8
                  : stimImg.height * 1.2;
            const x = (width - imgWidth) / 2;
            const y = (height - imgHeight) / 2 - (isMobile ? 0 : 0); // shift up slightly

            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#5d2514";
            ctx.lineWidth = 15;
            if (!classicGraphics) {
              roundRect(
                ctx,
                x - framePadding,
                y - framePadding,
                imgWidth + 2 * framePadding,
                imgHeight + 2 * framePadding,
                radius
              );
            }
            ctx.fill();
            ctx.stroke();

            ctx.drawImage(stimImg, x, y, imgWidth, imgHeight);
          };
          stimImg.src = images["pprac2a.jpg"];
        },
        choices: "NO_KEYS",
        canvas_size: [canvasHeight, canvasWidth],
        trial_duration: 2000,
        data: { task: phasename },
      },
      {
        type: jsPsychAnimation,
        stimuli: noise_sequence,
        sequence_reps: 2,
        frame_time: 200,
        render_on_canvas: true,
        prompt: `<p class="prompt_text" id="animation-prompt">${wait()}</p>`,
        on_start: function (trial) {
          // The trial won't render until this Promise resolves
          console.log("Preloading animation images before showing anything...");

          return new Promise((resolve) => {
            let loadedCount = 0;
            const totalImages = trial.stimuli.length;
            const images = [];

            trial.stimuli.forEach((src, index) => {
              const img = new Image();

              img.onload = () => {
                loadedCount++;
                console.log(`Loaded ${loadedCount}/${totalImages}`);

                if (loadedCount === totalImages) {
                  console.log("ALL IMAGES LOADED. Now showing animation trial.");
                  resolve(); // This allows the trial to render
                }
              };

              img.onerror = () => {
                console.error(`Failed to load image ${index}: ${src}`);
                loadedCount++;
                if (loadedCount === totalImages) {
                  resolve();
                }
              };

              img.src = src;
              images.push(img);
            });
          });
        },
        on_load: function () {
          // This runs AFTER on_start resolves and trial is displayed
          const canvas = document.querySelector("canvas");

          if (canvas) {
            canvas.style.width = canvasWidth;
            canvas.style.height = canvasHeight;
            canvas.style.objectFit = "contain";
            canvas.style.display = "block";
            canvas.style.margin = "0 auto";
          }

          const content = document.querySelector(".jspsych-content");
          if (content) {
            content.style.textAlign = "center";
          }

          const promptText = document.getElementById("animation-prompt");
          if (promptText) {
            promptText.style.visibility = "visible";
          }

          console.log("Animation trial is now visible and running");
        },
        data: { task: phasename },
      },
      {
        type: resp_mode == "button" ? jsPsychCanvasButtonResponse : jsPsychCanvasKeyboardResponse,
        data: { task: phasename },
        // Canvas stimulus
        stimulus: function (c) {
          const ctx = c.getContext("2d");
          const width = c.width;
          const height = c.height;
          const stimImg = new Image();
          const stimPath = images["pprac2b.jpg"];
          const framePadding = 20;
          const radius = 25;

          stimImg.onload = function () {
            const imgWidth = isMobile
              ? stimImg.width * 1.5
              : isTablet
                ? stimImg.width * 1.2
                : smallScreen
                  ? canvasHeight * 0.8
                  : stimImg.width * 1.2;
            const imgHeight = isMobile
              ? stimImg.height * 1.5
              : isTablet
                ? stimImg.height * 1.2
                : smallScreen
                  ? canvasHeight * 0.8
                  : stimImg.height * 1.2;
            const x = (width - imgWidth) / 2;
            const y = (height - imgHeight) / 2 - (isMobile ? 0 : 0); // shift up slightly

            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#5d2514";
            ctx.lineWidth = 15;
            if (!classicGraphics) {
              console.log("drawing rounded rectangle with params:", {
                x: x - framePadding,
                y: y - framePadding,
                width: imgWidth + 2 * framePadding,
                height: imgHeight + 2 * framePadding,
                radius: radius,
              });
              roundRect(
                ctx,
                x - framePadding,
                y - framePadding,
                imgWidth + 2 * framePadding,
                imgHeight + 2 * framePadding,
                radius
              );
            }
            ctx.fill();
            ctx.stroke();

            ctx.drawImage(stimImg, x, y, imgWidth, imgHeight);
          };
          stimImg.src = stimPath;
        },
        choices: trial_choices(),
        //stimulus_duration: 2000,
        canvas_size: [canvasHeight * 0.95, canvasWidth],
        trial_duration: null,
        response_ends_trial: true,
        margin_horizontal: "40px",
        button_html: classicGraphics
          ? [
              `<div class="image-btn-wrapper">
            <input type="image" src="/assets/blank_button.png"
                  class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
              <text x="50%" y="50%">%choice%</text>
            </svg>
          </div>`,

              `<div class="image-btn-wrapper">
            <input type="image" src="/assets/blank_button.png"
                  class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
              <text x="50%" y="50%">%choice%</text>
            </svg>
          </div>`,
            ]
          : [
              `<div class="image-btn-wrapper">
            <input type="image" src="/assets/blank_green.png"
                  class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
              <text class="text-stroke" x="50%" y="50%">%choice%</text>
              <text class="text-fill" x="50%" y="50%">%choice%</text>
            </svg>
          </div>`,

              `<div class="image-btn-wrapper">
            <input type="image" src="/assets/blank_blue.png"
                  class="image-btn">
            <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
              <text class="text-stroke" x="50%" y="50%">%choice%</text>
              <text class="text-fill" x="50%" y="50%">%choice%</text>
            </svg>
          </div>`,
            ],
        on_load: function () {
          setupButtonListeners();
        },

        on_finish: function () {
          cleanupButtonListeners();
        },
      },
    ],
  };

  instr3_trial = makeSideBySideTrial(
    images["pprac2a.jpg"],
    images["pprac2b.jpg"],
    `<p class="prompt_text">${lang.pcon.instr3_stim + "<br><br>" + instr3_prompt()}</p>`,
    instr_choice()
  );

  pcon_end = {
    type: jsPsychHtmlKeyboardResponse,
    trial_duration: 500,
    stimulus: `<p class="prompt_text">${lang.pcon.ty}</p>`,
    response_ends_trial: false,
    data: { task: phasename },
  };

  console.log("pcon trials refreshed");
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
  pcon_preload,
  refresh_pcon_trials,
  instr1_trial,
  demo1_trial,
  instr2_trial,
  demo2_trial,
  instr3_trial,
  pcon_end,
  pconDataCalcFunction,
};
