//*******************************************************************
//
//   File: pairwiseTrial.js               Folder: timelines
//
//   Author: Honeycomb, Audrey Hempel, Gavin Stark
//   --------------------
//
//   Changes:
//        2/11/26 (AGH): initial conversion from pconTrial.js
//
//   --------------------
//   This file sets up an iteration of the pairwise test timeline
//   with the appropriate stimulus and data parameters for the variable
//   elements.
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import jsPsychImageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import jsPsychImageButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config } from "../config/main";
import { images, getDeviceType } from "../lib/utils";

import { lang, resp_mode } from "../App/components/Login";

// default settings for a pcon test trial
import { keyPairwiseTrial, buttonPairwiseTrial } from "../trials/trialPairwise";

//----------------------- 2 ----------------------
//-------------------- TIMELINE ------------------
// sets up a basic trial in the pcon, gets repeated for each timeline var

// initialize timeline
var timeline = [];

const pairwiseTrial = (blockSettings, blockDetails, tlv) => {
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
      keyPairwiseTrial(config, {
        image1: function () {
          return tlv.img1;
        },
        image2: function () {
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
      buttonPairwiseTrial(config, {
        image1: function () {
          return tlv.img1;
        },
        image2: function () {
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

export default pairwiseTrial;
