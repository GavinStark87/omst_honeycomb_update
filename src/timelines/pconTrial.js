//*******************************************************************
//
//   File: pconTrial.js               Folder: timelines
//
//   Author: Honeycomb, Audrey Hempel
//   --------------------
//
//   Changes:
//        7/31/23 (AGH): initial conversion from pcon.html
//        8/1/23  (AGH): added wait method to allow formatting
//
//   --------------------
//   This file sets up an iteration of the pcon test timeline
//   with the appropriate stimulus and data parameters for the variable
//   elements.
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import jsPsychImageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import jsPsychImageButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychAnimation from "@jspsych/plugin-animation";

import { config } from "../config/main";
import { images } from "../lib/utils";

import { lang, resp_mode } from "../App/components/Login";

// default settings for a pcon test trial
import { trialPcon, keyPconTrial, buttonPconTrial } from "../trials/trialPcon";

//----------------------- 2 ----------------------
//---------------- HELPER METHODS ----------------

var wait = function () {
  return "<p>" + lang.pcon.wait;
};

// noise animation sequence
var noise_sequence = [
  images["noise_1.png"],
  images["noise_2.png"],
  images["noise_3.png"],
  images["noise_4.png"],
  images["noise_5.png"],
];

//----------------------- 3 ----------------------
//-------------------- TIMELINE ------------------
// sets up a basic trial in the pcon, gets repeated for each timeline var

// initialize timeline
var timeline = [];

const pconTrial = (blockSettings, blockDetails, tlv) => {
  // if keyboard response, load stimulus and data specifications for keyboard trials into timeline
  if (resp_mode == "keyboard") {
    timeline = [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",
        trial_duration: 1000,
        response_ends_trial: false,
        stimulus: `<p class="prompt_text" >` + lang.pcon.ready + "</p>",
      },
      trialPcon(config, {
        image: function () {
          return tlv.img1;
        },
      }),
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
            //canvas.style.width = canvasWidth;
            //canvas.style.height = canvasHeight;
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
      },
      keyPconTrial(config, {
        image: function () {
          return tlv.img2;
        },
        data: function () {
          let cresp = tlv.cresp;
          //return with other data properties
          return {
            cresp,
            task: "pcon",
          };
        },
      }),
    ];
  }
  // if button response, load stimulus and data specifications for button trials into timeline
  else {
    timeline = [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",
        trial_duration: 1000,
        response_ends_trial: false,
        stimulus: `<p class="prompt_text" >` + lang.pcon.ready + "</p>",
      },
      trialPcon(config, {
        image: function () {
          return tlv.img1;
        },
      }),
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
            //canvas.style.width = canvasWidth;
            //canvas.style.height = canvasHeight;
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
      },
      buttonPconTrial(config, {
        image: function () {
          return tlv.img2;
        },
        data: function () {
          let cresp = tlv.cresp;
          //return with other data properties
          return {
            cresp,
            task: "pcon",
          };
        },
      }),
    ];
  }

  // if keyboard response, return keyboard type and timeline
  if (resp_mode == "keyboard") {
    return {
      type: jsPsychImageKeyboardResponse,
      timeline,
    };
  }
  // if button response, return button type and timeline
  else if (resp_mode == "button") {
    return {
      type: jsPsychImageButtonResponse,
      timeline,
    };
  }
};

//----------------------- 4 ----------------------
//--------------------- EXPORT -------------------

export default pconTrial;
