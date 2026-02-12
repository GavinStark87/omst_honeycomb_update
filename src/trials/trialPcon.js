//*******************************************************************
//
//   File: trialPcon.js               Folder: trials
//
//   Author: Craig Stark, Audrey Hempel, Gavin Stark
//   --------------------
//
//   Changes:
//        7/31/23 (AGH): initial convert from pcon.html into honeycomb
//                       template
//        8/11/23 (AGH): changed trial_txt to trial_text for consistency
//        2/11/26 (GES): Modernized assets
//
//   --------------------
//   This file contains the default options for the two variable
//   portions of the pcon test trials (the INITIAL display of the image
//   and the SECOND image with user response). trialPcon, keyPconTrial
//   and buttonPconTrial are exported as functions and looped in
//   ../timelines/pconTrial
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import jsPsychImageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import jsPsychCanvasButtonResponse from "@jspsych/plugin-canvas-button-response";
import jsPsychCanvasKeyboardResponse from "@jspsych/plugin-canvas-keyboard-response";

import $ from "jquery";

//import { resp_mode } from '../trials/selectRespType';
import { lang, resp_mode } from "../App/components/Login";
import {
  getDeviceType,
  roundRect,
  setupButtonListeners,
  cleanupButtonListeners,
} from "../lib/utils";

//----------------------- 2 ----------------------
//----------------- HELPER METHODS ---------------
// Helper methods that allow flexibilty for selection of language, resp_mode
// and twochoice

var trial_prompt = function () {
  if (resp_mode == "button") {
    return lang.pcon.button.trial_txt;
  } else {
    return lang.pcon.key.trial_txt;
  }
};

var trial_choices = function () {
  if (resp_mode == "button") {
    return [`${lang.pcon.button.trial_choices.same}`, `${lang.pcon.button.trial_choices.dif}`];
  } else {
    return [`${lang.pcon.key.trial_choices.same}`, `${lang.pcon.key.trial_choices.dif}`];
  }
};
//----------------------- 3 ----------------------
//-------------------- CONSTANTS ------------------
const device = getDeviceType();
console.log("have device " + device);
const isMobile = device[0];
const isTablet = device[1];
const smallScreen = device[2];
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

//-------------------- INITIAL -------------------
// Initial image display (does not illicit user response):
// image is the only param that changes

export function trialPcon(config, options) {
  // set default trial parameters for keyboard response
  const defaults = {
    responseType: jsPsychCanvasKeyboardResponse,
    choices: "NO_KEYS",
    trialDuration: 2000,
    responseEndsTrial: false,
    image: "", // image will be different for each
  };
  const {
    //choices,
    trialDuration,
    responseEndsTrial,
    image,
  } = { ...defaults, ...options };

  // return defaults
  return {
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
          ctx.fill();
          ctx.stroke();
        }

        ctx.drawImage(stimImg, x, y, imgWidth, imgHeight);
      };
      stimImg.src = image();
      console.log("stimulus function ran, image src set to:", image());
    },
    choices: "NO_KEYS",
    canvas_size: [canvasHeight, canvasWidth],
    trial_duration: trialDuration,
    response_ends_trial: responseEndsTrial,
  };
}

//-------------------- SECOND --------------------
// Keyboard and button versions of second image display
// image and data change between iterations

// Keyboard version
export function keyPconTrial(config, options) {
  // set default trial parameters for keyboard response
  const defaults = {
    type: jsPsychImageKeyboardResponse,
    stimulusHeight: 400,
    stimulusWidth: 400,
    choices: trial_choices,
    prompt: trial_prompt,
    stimulusDuration: 2000,
    trialDuration: null,
    responseEndsTrial: true,
    name: "keyPcon",
    image: "", // image and data will be different for each
    data: "", // image and data will be different for each
  };
  const {
    //choices,
    prompt,
    stimulusDuration,
    trialDuration,
    responseEndsTrial,
    name,
    image,
    data,
  } = { ...defaults, ...options };

  // return defaults
  return {
    type: jsPsychImageKeyboardResponse,
    stimulus: image,
    choices: trial_choices,
    prompt: prompt,
    stimulus_duration: stimulusDuration,
    trial_duration: trialDuration,
    response_ends_trial: responseEndsTrial,
    name: name,
    on_finish: function (data) {
      // same = button 0 = 's'
      // different = button 1 = 'd'
      let resp = null;
      if (data.response == "s") {
        resp = "s";
      } else if (data.response == "d") {
        resp = "d";
      }
      //console.log(data.cresp, jsPsych.timelineVariable('cresp'))
      data.correct = resp == data.cresp;
      data.resp = resp;
      console.log(data.resp, data.cresp, data.correct);
    },
    data: data,
  };
}

// Button version
export function buttonPconTrial(config, options) {
  // set default trial parameters for button response
  const defaults = {
    responseType: jsPsychCanvasButtonResponse,
    choices: trial_choices,
    prompt: trial_prompt(),
    stimulusDuration: 2000,
    trialDuration: null,
    responseEndsTrial: true,
    name: "buttonPcon",
    image: "", // image and data will be different for each
    data: "", // image and data will be different for each
  };
  const {
    //choices,
    prompt,
    stimulusDuration,
    trialDuration,
    responseEndsTrial,
    name,
    image,
    data,
  } = { ...defaults, ...options };

  // return defaults
  return {
    type: jsPsychCanvasButtonResponse,
    stimulus: function (c) {
      const ctx = c.getContext("2d");
      const width = c.width;
      const height = c.height;
      const stimImg = new Image();
      const stimPath = image();
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
          ctx.fill();
          ctx.stroke();
        }

        ctx.drawImage(stimImg, x, y, imgWidth, imgHeight);
      };
      stimImg.src = stimPath;
    },
    choices: trial_choices,
    prompt: `<p class="prompt_text">${prompt}</p>`,
    stimulus_duration: stimulusDuration,
    canvas_size: [canvasHeight * 0.95, canvasWidth],
    trial_duration: trialDuration,
    response_ends_trial: responseEndsTrial,
    name: name,
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

    on_finish: function (data) {
      cleanupButtonListeners();
      // same = button 0 = 's'
      // different = button 1 = 'd'
      let resp = null;
      if (data.response == 0) {
        resp = "s";
      } else if (data.response == 1) {
        resp = "d";
      }
      //console.log(data.cresp, jsPsych.timelineVariable('cresp'))
      data.correct = resp == data.cresp;
      data.resp = resp;
      console.log(data.resp, data.cresp, data.correct);
    },
    data: data,
  };
}
