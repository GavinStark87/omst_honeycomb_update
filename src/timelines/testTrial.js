//*******************************************************************
//
//   File: testTrial.js               Folder: timelines
//
//   Author: Honeycomb, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/28/23 (AGH): copied from honeycomb taskTrial
//        6/28/23 (AGH): moved repeat test_trials from ./trials/contOmst
//                       set up stimulus from tlv argument
//                       imported (new) set image objects form ../lib/utils
//        7/11/23 (AGH): added data to include condition.data (set, selfpaced,
//                       orderfile) in each repeated trial data
//        7/13/23 (AGH): added set, selfpaced, orderfile data property declaration
//                       to here instead of /components/JsPsychExperiment.jsx
//                       added task data property
//                       changed arg condition --> tlv
//        7/14/23 (AGH): created keyboard and button version of timeline
//                       to allow response selection (trial types cannot
//                       be dynamic)
//        7/18/23 (AGH): changed the image parameter (the entire image path
//                       including the directing image objects are now defined
//                       within tlv.stimulus from /config/experiment)
//
//   --------------------
//   This file sets up an iteration of the test trial (/trials/trialCont.js)
//   with the appropriate stimulus and data parameters from the passed in
//   tlv argument.
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import jsPsychImageKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychImageButtonResponse from "@jspsych/plugin-html-button-response";
import { config } from "../config/main";

import { stim_set, selfpaced, orderfile, resp_mode } from "../App/components/Login";

// default settings for a contOmst trial
import { keyContTrial, buttonContTrial, preloadContTrial } from "../trials/trialCont";

//----------------------- 2 ----------------------
//-------------------- TIMELINE ------------------

// sets up a basic trial in the contOmst, gets repeated for each element of the trial_stim array in testBlock

// initialize timeline
var timeline = [];

const testTrial = (tlv) => {
  // if keyboard response, load stimulus and data specifications for keyboard trials into timeline
  if (resp_mode == "keyboard") {
    timeline = [
      keyContTrial(config, {
        image: function () {
          return tlv.stimulus;
        },
        data: function () {
          // tlv data conditions
          let condition = tlv.data.condition;
          let correct_response = tlv.data.correct_response;
          let lbin = tlv.data.lbin;
          // return with other data properties
          return {
            condition,
            correct_response,
            lbin,
            task: "oMSTCont",
            set: stim_set,
            selfpaced: selfpaced,
            orderfile: orderfile,
          };
        },
      }),
    ];
  }
  // if button response response, load stimulus and data specifications for keyboard trials into timeline
  else {
    timeline = [
      buttonContTrial(config, {
        image: function () {
          return tlv.stimulus;
        },
        data: function () {
          // tlv data conditions
          let condition = tlv.data.condition;
          let correct_response = tlv.data.correct_response;
          let lbin = tlv.data.lbin;
          // return with other data properties
          return {
            condition,
            correct_response,
            lbin,
            task: "oMSTCont",
            set: stim_set,
            selfpaced: selfpaced,
            orderfile: orderfile,
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

//----------------------- 3 ----------------------
//--------------------- EXPORT -------------------

export default testTrial;
