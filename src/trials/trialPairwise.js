//*******************************************************************
//
//   File: trialPairwise.js               Folder: trials
//
//   Author: Craig Stark, Audrey Hempel, Gavin Stark
//   --------------------
//
//   Changes:
//        7/31/23 (AGH): Converted from trialPcon.js
//
//   --------------------
//   This file contains the default options for the two variable
//   portions of the pairwise test trials (the INITIAL display of the image
//   and the SECOND image with user response). trialPairwise, keyPairwiseTrial
//   and buttonPairwiseTrial are exported as functions and looped in
//   ../timelines/pairwiseTrial
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import jsPsychCanvasButtonResponse from "@jspsych/plugin-canvas-button-response";
import jsPsychCanvasKeyboardResponse from "@jspsych/plugin-canvas-keyboard-response";

//import { resp_mode } from '../trials/selectRespType';
import { lang, resp_mode } from "../App/components/Login";
import { getDeviceType } from "../lib/utils";

import { makeSideBySideChoice } from "./pairwise_demos";

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

var q_prompt = function () {
  if (resp_mode == "button") {
    return lang.pcon.button.trial_txt;
  } else {
    return lang.pcon.key.trial_txt;
  }
};

//----------------------- 3 ----------------------
//-------------------- TRIALS --------------------

// Keyboard and button versions of image display
// image and data change between iterations

// Keyboard version
export function keyPairwiseTrial(config, options) {
  // set default trial parameters for keyboard response
  const defaults = {
    type: jsPsychCanvasKeyboardResponse,
    stimulusHeight: 400,
    stimulusWidth: 400,
    choices: trial_choices,
    prompt: trial_prompt,
    stimulusDuration: 2000,
    trialDuration: null,
    responseEndsTrial: true,
    name: "keyPairwise",
    image1: "", // image and data will be different for each
    image2: "",
    data: "", // image and data will be different for each
  };

  // Merge defaults, config, and options (later values override earlier ones)
  const trial = {
    ...defaults,
    ...config,
    ...options,
  };

  // Extract the values we need for makeSideBySideChoice
  const { image1, image2, data, stimulusDuration } = trial;

  // Call makeSideBySideChoice with the merged values and return the result
  return makeSideBySideChoice(
    trial_choices(),
    image1(),
    image2(),
    true, // score
    data,
    stimulusDuration, // Pass the duration from merged options
    q_prompt()
  );
}

// Button version
export function buttonPairwiseTrial(config, options) {
  // set default trial parameters for keyboard response
  const defaults = {
    type: jsPsychCanvasButtonResponse,
    stimulusHeight: 400,
    stimulusWidth: 400,
    choices: trial_choices,
    prompt: trial_prompt,
    stimulusDuration: 2000,
    trialDuration: null,
    responseEndsTrial: true,
    name: "buttonPairwise",
    image1: "", // image and data will be different for each
    image2: "",
    data: "", // image and data will be different for each
  };

  // Merge defaults, config, and options (later values override earlier ones)
  const trial = {
    ...defaults,
    ...config,
    ...options,
  };

  // Extract the values we need for makeSideBySideChoice
  const { image1, image2, data, stimulusDuration } = trial;
  // Call makeSideBySideChoice with the merged values and return the result
  return makeSideBySideChoice(
    trial_choices(),
    image1(),
    image2(),
    true, // score
    data,
    stimulusDuration,
    q_prompt() // Pass the duration from merged options
  );
}
