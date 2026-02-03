//*******************************************************************
//
//   File: testBlock.js               Folder: timelines
//
//   Author: Honeycomb, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/28/23 (AGH): copied from honeycomb taskBlock
//                       imported copied testTrial
//        7/13/23 (AGH): changed arg condition --> tlv
//
//   --------------------
//   This file loops through testTrial (/timelines/testTrial.js) using
//   the conditions (trial variables) passed into it (exptBlock1) in
//   /timelines/main.js.
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import testTrial from "./testTrial";
import { generateStartingOpts } from "../lib/taskUtils";

//----------------------- 2 ----------------------
//-------------------- TIMELINE ------------------

// testBlock

const testBlock = (blockSettings, jsPsych) => {
  // initialize block with starting options that set up looped trials
  const startingOpts = generateStartingOpts(blockSettings);

  // const blockDetails = {
  //   block_earnings: 0.0,
  //   optimal_earnings: 0.0,
  //   continue_block: true,
  // };

  // timeline = loop through trials
  console.dir(jsPsych); // remove
  const timeline = startingOpts.map((tlv) => testTrial(tlv));

  const blockStart = {
    type: htmlKeyboardResponse,
    stimulus: "",
    trial_duration: 1,
    on_finish: (data) => {
      data.block_settings = blockSettings;
    },
  };

  timeline.unshift(blockStart);

  return {
    type: htmlKeyboardResponse,
    on_finish: function (data) {
      console.log("testBlock finished");
      console.log(data);
    },
    timeline,
  };
};

//----------------------- 3 ----------------------
//--------------------- EXPORT -------------------

export default testBlock;
