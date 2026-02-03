/* eslint-disable */ 
//*******************************************************************
//
//   File: experiment.js               Folder: config
//
//   Author: Honeycomb, Craig Stark, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/28/23 (AGH): moved the timeline variables for contOMST
//                       test_trials from ./trials
//                       set up tlv as exptBlock1 conditions
//        7/18/23 (AGH): encapsulated everthing into the function 
//                       loadExptBlock1 (allows trial_stim and stim_set
//                       options chosen on Login)
//                       added var exptImage to include the set#Image
//                       objects (previously in /trials/testTrial) and
//                       edit image name for each set (now tlv.stimulus)
//
//   --------------------
//   This file contains a function that defines the experiment's changing 
//   conditions in repeated trials (stimulus and data).
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils';
import { twochoice } from '../App/components/Login';
// image objects that allow image path of each set (based on stim_set)
import {
  set1Images,
  set2Images,
  set3Images,
  set4Images,
  set5Images,
  set6Images,
} from '../lib/utils';

//----------------------- 2 ----------------------
//---------- TIMELINE VARIABLE FUNCTION-----------

//  sets up the tlv array to include the appropriate info from the seleced jsOrders file

function loadExptBlock1 (trial_stim, stim_set) {
  var tlv = [];
  var ntrials = trial_stim.length;
  let DEBUGMODE = 0;
  if (DEBUGMODE == 1) {
    ntrials = 20;
  }
  console.log('Building up the ' + ntrials + ' trials');
  for (var i = 0; i < ntrials; i++) {
    // in corr_resp: 0=old, 1=sim, 2=new
    let trial_info = trial_stim[i]; // added "let"
    let tr_type = 'foil';
    let cresp = 'n';
    if (trial_info.correct_resp == 0) {
      tr_type = 'target';
      cresp = 'o';
    } else if (trial_info.correct_resp == 1) {
      tr_type = 'lure';
      if (twochoice == 1) {
        cresp = 'n';
      } else {
        cresp = 's';
      }
    }
    let lure_bin = 0; // We may or may not have this in the order file
    if (trial_info.lbin && trial_info.lbin !== 'undefined') {
      lure_bin = trial_info.lbin;
    }
    // keycode 'n' (for 1 and 2) = 78, 'y' (for 0)=89
    // keycode 'n' (for 1 and 2) = 78, 'y' (for 0)=89, i=73, o=79
    //let obj={stimulus: trial_info.image, data: {condition: tr_type, correct_response: cresp, lbin:lure_bin}}

    // initialize exptImage var
    var exptImage;
    // Keep the original image path from trial_stim
    exptImage = `/assets/images/Set${stim_set}_rs/${trial_info.image.split('/').pop()}`;
    
    // create the timeline variable object
    let obj = {
      stimulus: exptImage,
      data: { condition: tr_type, correct_response: cresp, lbin: lure_bin },
    };
    //console.log(i + '  bin: ' + lure_bin)
    tlv.push(obj); // add it to the array of timeline variables
  }

  //----------------------- 3 ----------------------
  //-------------- EXPERIMENT BLOCK ----------------

  // create copy of default settings
  var exptBlock1 = deepCopy(defaultBlockSettings);

  exptBlock1.conditions = tlv; //set the conditions of the trials to the array

return exptBlock1;
}

//----------------------- 4 ----------------------
//--------------------- EXPORT -------------------

export { loadExptBlock1 };
