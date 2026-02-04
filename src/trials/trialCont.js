//*******************************************************************
//
//   File: trialCont.js               Folder: trials
//
//   Author: Craig Stark, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/28/23 (AGH): moved repeated test_trials from ./contOmst
//                       (defaults)
//        7/11/23 (AGH): added data parameter
//        7/14/23 (AGH): split conTrial into keyboard and button version
//                       to allow response selection (trial types cannot
//                       be dynamic)
//        7/14/23 (AGH): deleted margin parameters for keyboard trial, adjusted
//                       horizontal margin to 8px (same as instructions) and
//                       deleted cursor block for button trial
//        7/27/23 (AGH): added paragraph markers to param functions (previously
//                       within text file)
//
//   --------------------
//
//   This sets the basic defaults for continuous oMST trial (every
//   parameter except stimulus and data specifications that vary
//   trial to trial) keyContTrial and buttonContTrial are exported as
//   functions and looped in ../timelines/testTrial.js
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import jsPsychImageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import jsPsychImageButtonResponse from "@jspsych/plugin-image-button-response";
import jsPsychCanvasButtonResponse from "@jspsych/plugin-canvas-button-response";
import jsPsychCanvasKeyboardResponse from "@jspsych/plugin-canvas-keyboard-response";
import jsPsychPreload from "@jspsych/plugin-preload";

import $ from "jquery";

//import { resp_mode } from '../trials/selectRespType';
import { twochoice, selfpaced, lang, resp_mode} from "../App/components/Login";
import { invNormcdf, setupButtonListeners, cleanupButtonListeners, getDeviceType, drawHTMLText, roundRect } from "../lib/utils";

//----------------------- 2 ----------------------
//----------------- HELPER METHODS ---------------
// Helper methods that allow flexibilty for selection of language, resp_mode
// and twochoice

var trial_prompt = function () {
  if (resp_mode == "button") {
    if (twochoice == 0) {
      return "<p>" + lang.cont.button.threechoice.trial_prompt + "</p>";
    } else {
      return "<p>" + lang.cont.button.twochoice.trial_prompt + "</p>";
    }
  } else {
    if (twochoice == 0) {
      return "<p>" + lang.cont.key.threechoice.trial_prompt + "</p>";
    } else {
      return "<p>" + lang.cont.key.twochoice.trial_prompt + "</p>";
    }
  }
};

var trial_choices = function () {
  if (resp_mode == "button") {
    if (twochoice == 0) {
      return [
        `${lang.cont.button.threechoice.trial_choices.old}`,
        `${lang.cont.button.threechoice.trial_choices.sim}`,
        `${lang.cont.button.threechoice.trial_choices.new}`,
      ];
    } else {
      return [
        `${lang.cont.button.twochoice.trial_choices.old}`,
        `${lang.cont.button.twochoice.trial_choices.new}`,
      ];
    }
  } else {
    if (twochoice == 0) {
      return [
        `${lang.cont.key.threechoice.trial_choices.old}`,
        `${lang.cont.key.threechoice.trial_choices.sim}`,
        `${lang.cont.key.threechoice.trial_choices.new}`,
      ];
    } else {
      return [
        `${lang.cont.key.twochoice.trial_choices.old}`,
        `${lang.cont.key.twochoice.trial_choices.new}`,
      ];
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
const stars_12 = true; // for now
let num_correct = 0;

const brain = new Image();
brain.src = "/assets/brain.png";

const starImgs = Array.from({length: 11}, (_, i) => {
  let img = new Image();
  img.src = `/assets/star${i}.png`;
  return img;
});

//----------------------- 3 ----------------------
//-------------------- TRIALS --------------------

const preload_fnames = [];

preload_fnames.push(
  "/assets/blank_blue.png",
  "/assets/blank_blue_pressed.png",
  "/assets/blank_green.png",
  "/assets/blank_green_pressed.png",
  "/assets/blank_red.png",
  "/assets/blank_red_pressed.png",
  "/assets/brain.png",
  "/assets/images/Set1_rs/080a.jpg",
  ...Array.from({length: 11}, (_, i) => `/assets/star${i}.png`)
);

var preload = {
  type: jsPsychPreload,
  images: preload_fnames, // since we use a timeline variable, we can't use the simple "trials"
  show_progress_bar: true,
  show_detailed_erros: true,
  continue_after_error: true,
  on_error: function(fname) {
    console.log('FAILED  '+fname)
  },
  on_finish: function(data) {    
    console.log('Preload success? ' + data.success)
    console.log('Failed on ' + data.failed_images.length)
  }
}

export function preloadContTrial() {
  return preload;
}

// Keyboard version and button version

// Keyboard version
export function keyContTrial(config, options) {
  // set default trial parameters for keyboard response
  const defaults = {
    responseType: jsPsychCanvasKeyboardResponse,
    stimulusDuration: 2000,
    trialDuration: selfpaced == 1 ? null : 2500,
    postTrialGap: 500,
    stimulusHeight: 400,
    stimulusWidth: 400,
    trialChoices: trial_choices(),
    prompt: trial_prompt(),
    responseEndsTrial: true,

    image: "", // image and data will be different for each
    data: "", // iteration of the trial so their default is blank
  };
  const {
    stimulusDuration,
    trialDuration,
    postTrialGap,
    stimulusHeight,
    stimulusWidth,
    trialChoices,
    prompt,
    responseEndsTrial,
    image,
    data,
  } = { ...defaults, ...options };

  // return defaults
  return {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: function(c) {
      const ctx = c.getContext('2d');
      const width = c.width;
      const height = c.height;
      const stimImg = new Image();
      const stimPath = image;
      const totalStars = stars_12 ? 12 : 6;
      const maxFill = 10; // star1–star10
      const starSize = isMobile ? stars_12 ?  Math.min(width, height) * 0.12 : Math.min(width, height) * 0.15 :
                      isTablet && stars_12 ? Math.min(width, height) * 0.055 : 
                      isTablet ?  Math.min(width, height) * 0.12 :
                      Math.min(width, height) * 0.15;
      const spacing = isMobile ?  starSize * 0.15 :
                      isTablet &&  stars_12 ? starSize * 0.1 :
                      isTablet ? starSize * 0.2 :
                      starSize * 0.25;
      const framePadding = 20;
      const radius = 25;
      const brainScale = isTablet ? 0.15 : smallScreen ? 0.15 : 0.2;

      function drawScene() {
        
        // === Progress info (stars/brain) ===
        const progress = num_correct;
        let textBounds;
        let promptFontSize;
        
        if (isMobile) {
          if (lang == 'kr') promptFontSize = 52;
          else if (lang == 'ru' || lang == 'nl') promptFontSize = 58;
          else if (lang == 'cn') promptFontSize = 70;
          else promptFontSize = 70;
        } else if (smallScreen) {
          if (lang == 'nl' || lang == 'ru') promptFontSize = 36;
          else if (lang == 'kr') promptFontSize = 28;
          else promptFontSize = 40;
        } else if (isTablet) {
          if (lang == 'kr') promptFontSize = 38;
          else promptFontSize = 48;
        } else {
          promptFontSize = 42;
        }

        const textStartY = isMobile ? (classicGraphics ? height * 0.1 : stars_12 ? height * 0.05 : height * 0.2) : isTablet ? height * 0.08 : smallScreen ? height * 0.08 : height * 0.08;
        textBounds = drawHTMLText(
          ctx, 
          prompt, 
          canvasWidth / 2, 
          textStartY, 
          promptFontSize,
          device,
          classicGraphics
        );

        
        return textBounds;
      }

      stimImg.onload = function() {
        const textBounds = drawScene();
        
        // *** CALCULATE AVAILABLE SPACE ***
        const topMargin = isTablet ? 30 : 15; // Space below text (reduced for desktop/laptop)
        const bottomMargin = 30; // Space above buttons
        const imageTopY = textBounds.endY + topMargin;
        const availableHeight = height - imageTopY - bottomMargin;
        const progress = num_correct;
        
        // For tablet: leave space for stars on left and brain on right
        const leftReserved = isTablet && !classicGraphics ? starSize + 60 : 0;
        const rightReserved = isTablet && !classicGraphics ? (brain.width * brainScale) + 60 : 0;
        const availableWidth = isTablet && !classicGraphics ? width - leftReserved - rightReserved : isMobile ? width * 0.7 : width * 0.8; // Increased from 0.8 to 0.85

        // *** SCALE IMAGE TO FIT AVAILABLE SPACE ***
        const imgAspectRatio = stimImg.width / stimImg.height;
        let scaledWidth, scaledHeight;

        // Try fitting by height first
        scaledHeight = availableHeight - (2 * framePadding);

        scaledWidth = scaledHeight * imgAspectRatio;
        //console.log("scaled height", scaledHeight);
        //console.log("scaled width", scaledWidth);

        // If too wide, fit by width instead
        if (scaledWidth > availableWidth - (2 * framePadding)) {
          scaledWidth = availableWidth - (2 * framePadding);
          scaledHeight = scaledWidth / imgAspectRatio;
        }

        // *** POSITION IMAGE CENTERED IN AVAILABLE SPACE ***
        const x = isTablet && !classicGraphics ? leftReserved + (availableWidth - scaledWidth) / 2 : (width - scaledWidth) / 2;
        const y = imageTopY + (availableHeight - scaledHeight - 2 * framePadding) / 2;
        console.log("Image position x:", x, "y:", y);
        console.log("canvas height: ", canvasHeight)
        // Draw frame and image
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#5d2514";
        ctx.lineWidth = 15;
        if (!classicGraphics) {roundRect(ctx, x - framePadding, y - framePadding, scaledWidth + 2*framePadding, scaledHeight + 2*framePadding, radius);}
        ctx.fill();
        ctx.stroke();
        ctx.drawImage(stimImg, x, y, scaledWidth, scaledHeight);

        // Store for setTimeout clear
        stimImg._renderInfo = { x, y, scaledWidth, scaledHeight };

        // Draw stars and brain
        const step = Math.floor((progress % (maxFill*(stars_12 ? 1 : 2)) + (stars_12 ? 0 : 1)) / (stars_12 ? 1 : 2)) || 0;
        const fullStars = Math.floor((progress/(stars_12 ? 1 : 2)) / maxFill);
        const fillLevel = step;
        const currentLevel = Math.min(fillLevel, 10);

        if (!isMobile && !classicGraphics && !(isTablet && stars_12)){
          console.log("Drawing stars and brain for desktop");
          const leftX = isTablet ? 20 : smallScreen ? 10 : 40;
          const leftStartY = isTablet ? textBounds.endY + 25 : height * 0.25;
          
          // draw full stars
          for (let i = 0; i < fullStars; i++) {
            const star = starImgs[10];
            const posY = isTablet ? leftStartY + i * (starSize + spacing) : leftStartY + (i%(stars_12 ? 3 : 2)) * (starSize + spacing);
            star.onload = function() {
              if (isTablet) ctx.drawImage(star, leftX, posY, starSize, starSize);
              else ctx.drawImage(star, leftX + (Math.floor(i/(stars_12 ? 3 : 2)) * (starSize + spacing)), posY, starSize, starSize);
            };
            if (star.complete) {
              if (isTablet) ctx.drawImage(star, leftX, posY, starSize, starSize);
              else ctx.drawImage(star, leftX + (Math.floor(i/(stars_12 ? 3 : 2)) * (starSize + spacing)), posY, starSize, starSize);
            }
          }

          // draw current star
          const currentStar = starImgs[currentLevel];
          const activeStarScale = 1.75;
          const activeStarSize = starSize * activeStarScale;
          const brainW = brain.width * brainScale;
          const brainH = brain.height * brainScale;
          const brainX = width - brainW - (isTablet ? 20 : 60);
          const brainY = isTablet ? textBounds.endY + 2*activeStarSize : height * 0.55;
          
          const starX = brainX + brainW / 2 - activeStarSize / 2;
          const starY = brainY - activeStarSize * 1.2;

          ctx.drawImage(brain, brainX, brainY, brainW, brainH);
          currentStar.onload = function() { ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize); };
          if (currentStar.complete) ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize);
        
        } else if (isMobile && !classicGraphics && !stars_12){
          const leftX = 0;
          const leftStartY = 20;
          const currentStar = starImgs[currentLevel];
          for (let i = 0; i < fullStars + 1 && i < totalStars; i++) {
            const star = starImgs[10];
            const posX = leftX + i * (starSize + spacing);
            if (i < fullStars){
              star.onload = function() { ctx.drawImage(star, posX, leftStartY, starSize, starSize); };
              if (star.complete) ctx.drawImage(star, posX, leftStartY, starSize, starSize);
            } else {
              currentStar.onload = function() { ctx.drawImage(currentStar, posX, leftStartY, starSize, starSize); };
              if (currentStar.complete) ctx.drawImage(currentStar, posX, leftStartY, starSize, starSize);
            }
          }
        } else if ((isMobile || isTablet) && stars_12 && !classicGraphics){
          const leftX = isTablet ? canvasWidth * 0.03 :  canvasWidth *0.02;           // X position for left column
          const rightX = isTablet ? starSize + canvasWidth *0.15 : canvasWidth - starSize - canvasWidth *0.02;         // X position for right column (adjust as needed)
          const startY = y - (starSize / 2) - framePadding;          // Top Y position
          const currentStar = starImgs[currentLevel];
          const starsPerColumn = isTablet ? 12 : 6;

          for (let i = 0; i < fullStars + 1 && i < totalStars; i++) {
            const star = starImgs[10];
            
            // Determine which column (0 = left, 1 = right, etc.)
            const column = Math.floor(i / starsPerColumn);
            
            // Determine position within the column (0-5)
            const rowInColumn = i % starsPerColumn;
            
            // Set X position based on column
            const posX = column === 0 ? leftX : rightX;
            
            // Set Y position based on row in column (vertical spacing)
            const posY = startY + rowInColumn * (starSize + spacing);
            
            if (i < fullStars) {
              star.onload = function() { ctx.drawImage(star, posX, posY, starSize, starSize); };
              if (star.complete) ctx.drawImage(star, posX, posY, starSize, starSize);
            } else if (isMobile){
              currentStar.onload = function() { ctx.drawImage(currentStar, posX, posY, starSize, starSize); };
              if (currentStar.complete) ctx.drawImage(currentStar, posX, posY, starSize, starSize);
            }
          }

          // Draw brain and active star on tablet
          if (isTablet) {
            const currentStar = starImgs[currentLevel];
            const activeStarScale = 3;
            const activeStarSize = starSize * activeStarScale;
            const brainW = brain.width * brainScale;
            const brainH = brain.height * brainScale;
            const brainX = width - brainW - (isTablet ? 20 : 60);
            const brainY = isTablet ? textBounds.endY + 2*activeStarSize : height * 0.55;
            
            const starX = brainX + brainW / 2 - activeStarSize / 2;
            const starY = brainY - activeStarSize * 1.2;

            ctx.drawImage(brain, brainX, brainY, brainW, brainH);
            currentStar.onload = function() { ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize); };
            if (currentStar.complete) ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize);
          }
        }
      };
      stimImg.src = stimPath;

      // After stimulus duration, remove only the image + its frame
      const startTime = performance.now();
      function checkAndClear() {
        if (performance.now() - startTime >= stimulusDuration) {
          if (stimImg._renderInfo) {
            const { x, y, scaledWidth, scaledHeight } = stimImg._renderInfo;
            const ctx2 = c.getContext('2d');
            ctx2.clearRect(
              x - framePadding - ctx2.lineWidth,
              y - framePadding - ctx2.lineWidth,
              scaledWidth + 2 * framePadding + ctx2.lineWidth * 2,
              scaledHeight + 2 * framePadding + ctx2.lineWidth * 2
            );
          }
        } else {
          requestAnimationFrame(checkAndClear);
        }
      }
      requestAnimationFrame(checkAndClear);
    },
    choices: trialChoices,
    stimulus_duration: stimulusDuration,
    trial_duration: trialDuration,
    post_trial_gap: postTrialGap,
    response_ends_trial: responseEndsTrial,
    button_html: classicGraphics ? 
      trialChoices.map((txt, i) => `
        <div class="image-btn-wrapper">
          <input type="image" src="/assets/blank_button.png"
                class="image-btn">
          <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
            <text x="50%" y="50%">${txt}</text>
          </svg>
        </div>
      `)
      :
      trialChoices.map((txt, i) => `
        <div class="image-btn-wrapper">
          <input type="image" src="/assets/blank_${isMobile ? ['red','blue','green'][i] : ['red','green','blue'][i]}.png"
                class="image-btn" style="${isMobile ? 'mix-blend-mode: multiply;' : ''}">
          <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
            <text class="text-stroke" x="50%" y="50%">${txt}</text>
            <text class="text-fill" x="50%" y="50%">${txt}</text>
          </svg>
        </div>
      `),
    canvas_size: [canvasHeight, canvasWidth],
    on_load: () => {
      setupButtonListeners();
      $("#jspsych-image-keyboard-response-stimulus").addClass("image");
      $("#jspsych-image-keyboard-response-stimulus").height(stimulusHeight);
      $("#jspsych-image-keyboard-response-stimulus").width(stimulusWidth);
      $("html").css("cursor", "none");
    },
    on_finish: function (data) {
      // set up data collection properties
      // yes = button 0 = 'y' = keycode 89
      // no = button 1 = 'n' = keycode 78
      // let resp = 'n';
      // if (resp_mode == 'button' && data.button_pressed == 0) { resp = 'y' }
      // if (resp_mode == 'keyboard' && data.key_press == 89 ) { resp = 'y' }
      let resp = null;
      if (data.response == "v") {
        resp = "o";
      } else if (data.response == "b") {
        resp = "s";
      } else if (data.response == "n") {
        resp = "n";
      }
      data.correct = resp == data.correct_response;
      data.resp = resp;

      cleanupButtonListeners();
    },
    data: data,
  };
}

// Button version
export function buttonContTrial(config, options) {
  const defaults = {
    // set default trial parameters for button response
    responseType: jsPsychCanvasButtonResponse,
    STIMULUS_DURATION: 2000,
    trialDuration: selfpaced == 1 ? null : 2500,
    postTrialGap: 500,
    marginHorizontal: "8px",
    marginVertical: "20px",
    stimulusHeight: 400,
    stimulusWidth: 400,
    trialChoices: trial_choices,
    prompt: trial_prompt(),
    responseEndsTrial: true,
    image: "", // image and data will be different for each
    data: "", // iteration of the trial so their default is blank
  };
  const {
    STIMULUS_DURATION,
    trialDuration,
    postTrialGap,
    marginHorizontal,
    marginVertical,
    stimulusHeight,
    stimulusWidth,
    trialChoices,
    prompt,
    responseEndsTrial,
    image,
    data,
  } = { ...defaults, ...options };

  // return defaults
  return {
    type: jsPsychCanvasButtonResponse,
    stimulus: function(c) {
      const ctx = c.getContext('2d');
      const width = c.width;
      const height = c.height;
      const stimImg = new Image();
      const stimPath = image();
      console.log("Loading image from path:", stimPath);
      console.log("Image value:", image);
      const totalStars = stars_12 ? 12 : 6;
      const maxFill = 10; // star1–star10
      const starSize = isMobile ? stars_12 ?  Math.min(width, height) * 0.12 : Math.min(width, height) * 0.15 :
                      isTablet && stars_12 ? Math.min(width, height) * 0.055 : 
                      isTablet ?  Math.min(width, height) * 0.12 :
                      Math.min(width, height) * 0.15;
      const spacing = isMobile ?  starSize * 0.15 :
                      isTablet &&  stars_12 ? starSize * 0.1 :
                      isTablet ? starSize * 0.2 :
                      starSize * 0.25;
      const framePadding = 20;
      const radius = 25;
      const brainScale = isTablet ? 0.15 : smallScreen ? 0.15 : 0.2;

      function drawScene() {

        // === Progress info (stars/brain) ===
        const progress = num_correct;
        let textBounds;
        let promptFontSize;
        
        if (isMobile) {
          if (lang == 'kr') promptFontSize = 52;
          else if (lang == 'ru' || lang == 'nl') promptFontSize = 58;
          else if (lang == 'cn') promptFontSize = 70;
          else promptFontSize = 70;
        } else if (smallScreen) {
          if (lang == 'nl' || lang == 'ru') promptFontSize = 36;
          else if (lang == 'kr') promptFontSize = 28;
          else promptFontSize = 40;
        } else if (isTablet) {
          if (lang == 'kr') promptFontSize = 38;
          else promptFontSize = 48;
        } else {
          promptFontSize = 42;
        }

        const textStartY = isMobile ? (classicGraphics ? height * 0.1 : stars_12 ? height * 0.05 : height * 0.2) : isTablet ? height * 0.08 : smallScreen ? height * 0.08 : height * 0.08;
        textBounds = drawHTMLText(
          ctx, 
          prompt, 
          canvasWidth / 2, 
          textStartY, 
          promptFontSize,
          device,
          classicGraphics
        );

        
        return textBounds;
      }

      stimImg.onload = async function() {
        console.log("✅ Image loaded!");
        console.log("naturalWidth:", stimImg.naturalWidth);
        console.log("naturalHeight:", stimImg.naturalHeight);
        console.log("width:", stimImg.width);
        console.log("height:", stimImg.height);
        console.log("complete:", stimImg.complete);
        const textBounds = await drawScene();
        console.log("textBounds:", textBounds);

        // *** CALCULATE AVAILABLE SPACE ***
        const topMargin = isTablet ? 30 : 15; // Space below text (reduced for desktop/laptop)
        const bottomMargin = 30; // Space above buttons
        const imageTopY = textBounds.endY + topMargin;
        const availableHeight = height - imageTopY - bottomMargin;
        const progress = num_correct;
        console.log("textBounds.endY:", textBounds.endY);
        console.log("imageTopY:", imageTopY);
        console.log("availableHeight:", availableHeight);

        // For tablet: leave space for stars on left and brain on right
        const leftReserved = isTablet && !classicGraphics ? starSize + 60 : 0;
        const rightReserved = isTablet && !classicGraphics ? (brain.width * brainScale) + 60 : 0;
        const availableWidth = isTablet && !classicGraphics ? width - leftReserved - rightReserved : isMobile ? width * 0.7 : width * 0.8; // Increased from 0.8 to 0.85

        // *** SCALE IMAGE TO FIT AVAILABLE SPACE ***
        const imgAspectRatio = stimImg.naturalWidth / stimImg.naturalHeight;
        console.log("Image aspect ratio:", imgAspectRatio);
        let scaledWidth, scaledHeight;

        // Try fitting by height first
        scaledHeight = availableHeight - (2 * framePadding);

        scaledWidth = scaledHeight * imgAspectRatio;
        console.log("scaled height", scaledHeight);
        console.log("scaled width", scaledWidth);

        // If too wide, fit by width instead
        if (scaledWidth > availableWidth - (2 * framePadding)) {
          scaledWidth = availableWidth - (2 * framePadding);
          scaledHeight = scaledWidth / imgAspectRatio;
        }

        // *** POSITION IMAGE CENTERED IN AVAILABLE SPACE ***
        const x = isTablet && !classicGraphics ? leftReserved + (availableWidth - scaledWidth) / 2 : (width - scaledWidth) / 2;
        const y = imageTopY + (availableHeight - scaledHeight - 2 * framePadding) / 2;
        console.log("Image position x:", x, "y:", y);
        console.log("canvas height: ", canvasHeight)

        // Draw frame and image
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#5d2514";
        ctx.lineWidth = 15;
        if (!classicGraphics) {roundRect(ctx, x - framePadding, y - framePadding, scaledWidth + 2*framePadding, scaledHeight + 2*framePadding, radius);}
        ctx.fill();
        ctx.stroke();
        console.log("stim Image", stimImg);
        ctx.drawImage(stimImg, x, y, scaledWidth, scaledHeight);

        // Store for setTimeout clear
        stimImg._renderInfo = { x, y, scaledWidth, scaledHeight };
        console.log("stimImg render info", stimImg._renderInfo);

        // After stimulus duration, remove only the image + its frame
        const startTime = performance.now();
        function checkAndClear() {
          if (performance.now() - startTime >= STIMULUS_DURATION) {
            
            const { x, y, scaledWidth, scaledHeight } = stimImg._renderInfo;
            console.log("clearRect values:");
            console.log("  x:", x, "minus padding/lineWidth:", x - framePadding - ctx.lineWidth);
            console.log("  y:", y, "minus padding/lineWidth:", y - framePadding - ctx.lineWidth);
            console.log("  width:", scaledWidth + 2 * framePadding + ctx.lineWidth * 2);
            console.log("  height:", scaledHeight + 2 * framePadding + ctx.lineWidth * 2);
            console.log("  framePadding:", framePadding);
            console.log("  ctx.lineWidth:", ctx.lineWidth);
            const ctx2 = c.getContext('2d');
            ctx2.clearRect(
              x - framePadding - ctx2.lineWidth,
              y - framePadding - ctx2.lineWidth,
              scaledWidth + 2 * framePadding + ctx2.lineWidth * 2,
              scaledHeight + 2 * framePadding + ctx2.lineWidth * 2
            );
            console.log("Cleared rectangle");
          } else {
            requestAnimationFrame(checkAndClear);
          }
        }
        requestAnimationFrame(checkAndClear);

        // Draw stars and brain
        const step = Math.floor((progress % (maxFill*(stars_12 ? 1 : 2)) + (stars_12 ? 0 : 1)) / (stars_12 ? 1 : 2)) || 0;
        const fullStars = Math.floor((progress/(stars_12 ? 1 : 2)) / maxFill);
        const fillLevel = step;
        const currentLevel = Math.min(fillLevel, 10);

        if (!isMobile && !classicGraphics && !(isTablet && stars_12)){
          console.log("Drawing stars and brain for desktop");
          const leftX = isTablet ? 20 : smallScreen ? 10 : 40;
          const leftStartY = isTablet ? textBounds.endY + 25 : height * 0.25;
          
          // draw full stars
          for (let i = 0; i < fullStars; i++) {
            const star = starImgs[10];
            const posY = isTablet ? leftStartY + i * (starSize + spacing) : leftStartY + (i%(stars_12 ? 3 : 2)) * (starSize + spacing);
            star.onload = function() {
              if (isTablet) ctx.drawImage(star, leftX, posY, starSize, starSize);
              else ctx.drawImage(star, leftX + (Math.floor(i/(stars_12 ? 3 : 2)) * (starSize + spacing)), posY, starSize, starSize);
            };
            if (star.complete) {
              if (isTablet) ctx.drawImage(star, leftX, posY, starSize, starSize);
              else ctx.drawImage(star, leftX + (Math.floor(i/(stars_12 ? 3 : 2)) * (starSize + spacing)), posY, starSize, starSize);
            }
          }

          // draw current star
          const currentStar = starImgs[currentLevel];
          const activeStarScale = 1.75;
          const activeStarSize = starSize * activeStarScale;
          const brainW = brain.width * brainScale;
          const brainH = brain.height * brainScale;
          const brainX = width - brainW - (isTablet ? 20 : 60);
          const brainY = isTablet ? textBounds.endY + 2*activeStarSize : height * 0.55;
          
          const starX = brainX + brainW / 2 - activeStarSize / 2;
          const starY = brainY - activeStarSize * 1.2;
          
          ctx.drawImage(brain, brainX, brainY, brainW, brainH);
          currentStar.onload = function() { ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize); };
          if (currentStar.complete) ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize);
        
        } else if (isMobile && !classicGraphics && !stars_12){
          const leftX = 0;
          const leftStartY = 20;
          const currentStar = starImgs[currentLevel];
          for (let i = 0; i < fullStars + 1 && i < totalStars; i++) {
            const star = starImgs[10];
            const posX = leftX + i * (starSize + spacing);
            if (i < fullStars){
              star.onload = function() { ctx.drawImage(star, posX, leftStartY, starSize, starSize); };
              if (star.complete) ctx.drawImage(star, posX, leftStartY, starSize, starSize);
            } else {
              currentStar.onload = function() { ctx.drawImage(currentStar, posX, leftStartY, starSize, starSize); };
              if (currentStar.complete) ctx.drawImage(currentStar, posX, leftStartY, starSize, starSize);
            }
          }
        } else if ((isMobile || isTablet) && stars_12 && !classicGraphics){
          const leftX = isTablet ? canvasWidth * 0.03 :  canvasWidth *0.02;           // X position for left column
          const rightX = isTablet ? starSize + canvasWidth *0.15 : canvasWidth - starSize - canvasWidth *0.02;         // X position for right column (adjust as needed)
          const startY = y - (starSize / 2) - framePadding;          // Top Y position
          const currentStar = starImgs[currentLevel];
          const starsPerColumn = isTablet ? 12 : 6;

          for (let i = 0; i < fullStars + 1 && i < totalStars; i++) {
            const star = starImgs[10];
            
            // Determine which column (0 = left, 1 = right, etc.)
            const column = Math.floor(i / starsPerColumn);
            
            // Determine position within the column (0-5)
            const rowInColumn = i % starsPerColumn;
            
            // Set X position based on column
            const posX = column === 0 ? leftX : rightX;
            
            // Set Y position based on row in column (vertical spacing)
            const posY = startY + rowInColumn * (starSize + spacing);
            
            if (i < fullStars) {
              star.onload = function() { ctx.drawImage(star, posX, posY, starSize, starSize); };
              if (star.complete) ctx.drawImage(star, posX, posY, starSize, starSize);
            } else if (isMobile){
              currentStar.onload = function() { ctx.drawImage(currentStar, posX, posY, starSize, starSize); };
              if (currentStar.complete) ctx.drawImage(currentStar, posX, posY, starSize, starSize);
            }
          }

          // Draw brain and active star on tablet
          if (isTablet) {
            const currentStar = starImgs[currentLevel];
            const activeStarScale = 3;
            const activeStarSize = starSize * activeStarScale;
            const brainW = brain.width * brainScale;
            const brainH = brain.height * brainScale;
            const brainX = width - brainW - (isTablet ? 20 : 60);
            const brainY = isTablet ? textBounds.endY + 2*activeStarSize : height * 0.55;
            
            const starX = brainX + brainW / 2 - activeStarSize / 2;
            const starY = brainY - activeStarSize * 1.2;

            ctx.drawImage(brain, brainX, brainY, brainW, brainH);
            currentStar.onload = function() { ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize); };
            if (currentStar.complete) ctx.drawImage(currentStar, starX, starY, activeStarSize, activeStarSize);
          }
        }
      };
      stimImg.src = stimPath;
    

      
    },
    choices: trialChoices,
    trial_duration: trialDuration,
    post_trial_gap: postTrialGap,
    response_ends_trial: responseEndsTrial,
    button_html: classicGraphics ? 
      trialChoices.map((txt, i) => `
        <div class="image-btn-wrapper">
          <input type="image" src="/assets/blank_button.png"
                class="image-btn">
          <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
            <text x="50%" y="50%">${txt}</text>
          </svg>
        </div>
      `)
      :
      trialChoices().map((txt, i) => `
        <div class="image-btn-wrapper">
          <input type="image" src="/assets/blank_${isMobile ? ['red','blue','green'][i] : ['red','green','blue'][i]}.png"
                class="image-btn" style="${isMobile ? 'mix-blend-mode: multiply;' : ''}">
          <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
            <text class="text-stroke" x="50%" y="50%">${txt}</text>
            <text class="text-fill" x="50%" y="50%">${txt}</text>
          </svg>
        </div>
      `),
    canvas_size: [canvasHeight, canvasWidth],
    on_load: () => {
      console.log("trial choices:", trialChoices);
      setupButtonListeners();
      $("#jspsych-image-button-response-stimulus").addClass("image");
      $("#jspsych-image-button-response-stimulus").height(stimulusHeight);
      $("#jspsych-image-button-response-stimulus").width(stimulusWidth);
    },
    on_finish: function (data) {
      // set up data collection properties
      // yes = button 0 = 'y' = keycode 89
      // no = button 1 = 'n' = keycode 78
      // let resp = 'n';
      // if (resp_mode == 'button' && data.button_pressed == 0) { resp = 'y' }
      // if (resp_mode == 'keyboard' && data.key_press == 89 ) { resp = 'y' }
      let resp = null;
      if (data.response == 0) {
        resp = "o";
      } else if (data.response == 2) {
        resp = "n";
      } else if (data.response == 1) {
        resp = twochoice == 1 ? "n" : "s";
      }
      data.correct = resp == data.correct_response;
      data.resp = resp;
      if (data.correct) {
        num_correct++;
      }

      cleanupButtonListeners();
    },
    data: data,
  };
}
