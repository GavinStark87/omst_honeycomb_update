//****************************************************************************
//
//   File: instructions.js               Folder: trials
//
//   Author: Gavin Stark, Craig Stark, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/12/23 (AGH): forked honeycomb, began to transfer trials from
//                       cmst_instr_contOSN.html into template (adding imports,
//                       exports, removing JATOS code)
//        6/14/23 (AGH): loaded images into ../assets and imported { images }
//                       from ../lib/utils
//        6/16/23 (AGH): created and imported custom plugins in ./uniqueplugins
//                       adpated from Craig's create-image-buttons plugin
//        6/20/23 (AGH): created ./selectLanguage and imported { lang }
//                       created ./selectRespType and imported { resp_mode }
//        6/22/23 (AGH): converted all the trial parameters dependent on lang
//                       and resp-mode into dynamic parameters
//        7/13/23 (AGH): added task as data property to each trial
//        7/14/23 (AGH): created button and key trials for each trial to allow
//                       response selection (trial types cannot be dynamic)
//        7/26/23 (AGH): consoladated button and key versions of trials with the
//                       refresh_instr_trials function that gets called at Login
//        7/27/23 (AGH): added paragraph markers to param functions (previously
//                       within text file)
//        8/1/23  (AGH): modified side-by-side stimuli and prompts for better
//                       formatting; CategorizeMultipleImage(Keyboard/Buttons)
//                       no longer necessary
//
//   --------------------
//   These trials are the instruction trials that explain to the
//   participant how to partake in the experiment and provide user
//   feedback.
//
//*******************************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

// importing jspysch plugins
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychCanvasButtonResponse from "@jspsych/plugin-canvas-button-response";
import jsPsychCanvasKeyboardResponse from "@jspsych/plugin-canvas-keyboard-response";
//import jsPsychCategorizeImage from "@jspsych/plugin-categorize-image";
import jsPsychPreload from "@jspsych/plugin-preload";

// importing unique plugins

// importing languages, images object, and response-mode
import {
  images,
  setupButtonListeners,
  cleanupButtonListeners,
  getDeviceType,
  fitSideBySideToScreen,
  fitIntroOutroToScreen,
  fitTextToContainer,
  roundRect,
  calculateSideBySideCanvasSize,
} from "../lib/utils.js";
import { lang, resp_mode } from "../App/components/Login";
import { jsPsychCategorizeImageButtons } from "./uniquePlugins/plugin-categorize-image-buttons.js";

import "./instructions.css";

//----------------------- 2 ----------------------
//----------------- HELPER METHODS ---------------
// These methods house the dynamic parameters of the trials below. Each is a function that
// when called will determine the values of lang and resp_type to incorporate different
// languages and response types. EVERYTIME lang OR resp_type ARE USED, THEY MUST BE INSIDE
// A FUNCTION.

// var to store the task name (data property)
const phasename = "cmst_instr_contOSN";

var instr_choice = function () {
  if (resp_mode == "button") {
    return [lang.instructions.button.instr_choice];
  } else {
    return lang.instructions.key.instr_choice;
  }
};

var prompt0 = function () {
  if (resp_mode == "button") {
    return lang.instructions.button.prompt0;
  } else {
    return lang.instructions.key.prompt0;
  }
};

var prompt_new = function () {
  if (resp_mode == "button") {
    return lang.instructions.button.prompt_new;
  } else {
    return lang.instructions.key.prompt_new;
  }
};

var inc_new = function () {
  if (resp_mode == "button") {
    return lang.instructions.button.inc_new;
  } else {
    return lang.instructions.key.inc_new;
  }
};

var cor_new = function () {
  return lang.instructions.cor_new;
};

var prompt_rep = function () {
  if (resp_mode == "button") {
    return lang.instructions.button.prompt_rep;
  } else {
    return lang.instructions.key.prompt_rep;
  }
};

var inc_rep = function () {
  if (resp_mode == "button") {
    return lang.instructions.button.inc_rep;
  } else {
    return lang.instructions.key.inc_rep;
  }
};

var cor_rep = function () {
  return lang.instructions.cor_rep;
};

var prompt_lure = function () {
  if (resp_mode == "button") {
    return lang.instructions.button.prompt_lure;
  } else {
    return lang.instructions.key.prompt_lure;
  }
};

var inc_lure = function () {
  if (resp_mode == "button") {
    return lang.instructions.button.inc_lure;
  } else {
    return lang.instructions.key.inc_lure;
  }
};

var cor_lure = function () {
  return lang.instructions.cor_lure;
};

var side_by_side_prompt = function () {
  if (resp_mode == "button") {
    return lang.instructions.button.continue;
  } else {
    return lang.instructions.key.continue;
  }
};

var prompt_test = function () {
  if (resp_mode == "button") {
    return lang.instructions.prompt_test + "<br>" + lang.instructions.button.trial_txt;
  } else {
    return lang.instructions.prompt_test + "<br>" + lang.instructions.key.trial_txt;
  }
};

var trial_choices = function () {
  if (resp_mode == "button") {
    return [
      `${lang.instructions.button.trial_choices.old}`,
      `${lang.instructions.button.trial_choices.sim}`,
      `${lang.instructions.button.trial_choices.new}`,
    ];
  } else {
    return [
      `${lang.instructions.key.trial_choices.old}`,
      `${lang.instructions.key.trial_choices.sim}`,
      `${lang.instructions.key.trial_choices.new}`,
    ];
  }
};

function fitTrialToScreen() {
  const container = document.querySelector(".jspsych-content");
  if (!container) return;
  console.log("container.scrollHeight:", container.scrollHeight);
  const totalHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const totalWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  console.log(
    "visualViewport.height:",
    window.visualViewport.height,
    "innerWidth:",
    window.innerWidth
  );

  const containerStyle = window.getComputedStyle(container);
  const containerPadding =
    parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
  const availableHeight = totalHeight - containerPadding;
  console.log("Available height:", availableHeight);

  // Get the three main sections
  const promptContainer = document.querySelector(".prompt-container");
  const stimulusContainer = document.querySelector(".jspsych-categorize-image-buttons-stimulus");
  const buttonContainer = document.querySelector(
    "#jspsych-categorize-image-buttons-response-btngroup"
  );

  if (!promptContainer || !stimulusContainer || !buttonContainer) return;

  console.log("Total height:", totalHeight);
  console.log(
    "Device type - isMobile:",
    isMobile,
    "isTablet:",
    isTablet,
    "smallScreen:",
    smallScreen,
    "desktop:",
    !smallScreen && !isMobile && !isTablet
  );

  // MOBILE: Buttons stacked (2 top, 1 bottom), vertical layout
  if (isMobile) {
    const buttonHeight = buttonContainer.offsetHeight;
    console.log("Button height:", buttonHeight);

    // Stimulus should be square at 90vw
    const stimulusSize = totalWidth * 0.9;
    console.log("Stimulus size:", stimulusSize);

    // Remaining space for prompt
    const margin = 40;
    const promptHeight = totalHeight - stimulusSize - buttonHeight - margin;
    console.log("Prompt height:", promptHeight);

    // Ensure prompt has minimum viable space
    if (promptHeight < 30) {
      console.warn("Prompt space too small, adjusting layout");
      const adjustedStimSize = totalHeight - buttonHeight - 60 - margin;
      stimulusContainer.style.width = adjustedStimSize + "px";
      stimulusContainer.style.height = adjustedStimSize + "px";
      promptContainer.style.height = "60px";
    } else {
      stimulusContainer.style.width = stimulusSize + "px";
      stimulusContainer.style.height = stimulusSize + "px";
      stimulusContainer.style.maxWidth = stimulusSize + "px";
      stimulusContainer.style.maxHeight = stimulusSize + "px";
      promptContainer.style.height = promptHeight + "px";
    }
  }
  // TABLET, LAPTOP, DESKTOP: Buttons in a row, horizontal layout
  else {
    const buttonHeight = buttonContainer.offsetHeight;
    console.log("Button height (horizontal):", buttonHeight);

    // For horizontal layouts, buttons take less height but more width
    // We want the image to be reasonable size, not blown out

    // Calculate available space for stimulus + prompt
    const margin = 60; // More margin for desktop
    const availableHeight = totalHeight - buttonHeight - margin;

    // Determine stimulus size based on device
    let maxStimulusPercent;
    if (smallScreen) {
      maxStimulusPercent = 0.75;
    } else if (isTablet) {
      maxStimulusPercent = 0.8;
    } else {
      maxStimulusPercent = 0.7;
    }
    console.log(availableHeight);
    const stimulusAllocation = availableHeight * maxStimulusPercent;
    const promptAllocation = availableHeight * (1 - maxStimulusPercent);

    console.log("Stimulus allocation:", stimulusAllocation);
    console.log("Prompt allocation:", promptAllocation);

    // Size stimulus as square, but constrained by both height and reasonable width
    let stimulusSize = Math.min(
      stimulusAllocation, // Don't exceed allocated height
      totalWidth * 0.8, // Don't exceed 80% of screen width
      totalHeight * 0.7 // Don't exceed 70% of screen height
    );

    console.log("Final stimulus size:", stimulusSize);

    stimulusContainer.style.width = stimulusSize + "px";
    stimulusContainer.style.height = stimulusSize + "px";
    stimulusContainer.style.maxWidth = stimulusSize + "px";
    stimulusContainer.style.maxHeight = stimulusSize + "px";
    stimulusContainer.style.margin = "40px auto"; // Center it

    // Prompt gets remaining space
    const actualPromptHeight = totalHeight - stimulusSize - buttonHeight - margin;
    promptContainer.style.height = actualPromptHeight + "px";
    console.log("Actual prompt height:", actualPromptHeight);
  }

  // Style prompt container
  promptContainer.style.display = "flex";
  promptContainer.style.alignItems = "center";
  promptContainer.style.justifyContent = "center";
  promptContainer.style.overflow = "hidden";
  promptContainer.style.padding = "10px 20px";
  promptContainer.style.margin = "10 auto";
  promptContainer.style.boxSizing = "border-box";

  // Style stimulus to maintain square aspect ratio
  const img = stimulusContainer.querySelector("img") || stimulusContainer;
  if (img) {
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
  }

  // FIT TEXT TO PROMPT CONTAINER
  const promptText = promptContainer.querySelector(".prompt_text");
  if (promptText && typeof fitTextToContainer === "function") {
    const promptHeight = promptContainer.offsetHeight;

    // Adjust font size ranges based on device
    let minFontSize, maxFontSize;
    if (isMobile) {
      minFontSize = 36;
      maxFontSize = 96;
    } else if (isTablet) {
      minFontSize = 40;
      maxFontSize = 80;
    } else if (smallScreen) {
      minFontSize = 32;
      maxFontSize = 64;
    } else {
      // desktop
      minFontSize = 32;
      maxFontSize = 64;
    }

    fitTextToContainer(promptText, promptHeight - 20, minFontSize, maxFontSize);
    container.classList.add("ready");
  }
}

function makeCategorizeTrial(
  jsPsych,
  imgPath,
  t_choices,
  keyAnswer,
  buttonAnswer,
  promptText,
  incText,
  corText
) {
  const trial_choices = [
    `${lang.instructions.button.trial_choices.old}`,
    `${lang.instructions.button.trial_choices.sim}`,
    `${lang.instructions.button.trial_choices.new}`,
  ];
  console.log("choices:", trial_choices);

  return {
    type: jsPsychCategorizeImageButtons,
    stimulus: imgPath,
    key_answer: keyAnswer,
    button_answer: buttonAnswer,
    choices: trial_choices,
    prompt: `
      <div class="prompt-container">
        <p class="prompt prompt_text ${lang}" style="font-weight: normal;">${promptText}</p>
      </div>
    `,

    // Set feedback to empty - we'll handle it ourselves
    incorrect_text: "",
    correct_text: "",

    force_correct_button_press: true,
    button_html: classicGraphics
      ? ["1", "2", "3"].map(
          (txt, i) => `
      <div class="image-btn-wrapper">
        <input type="image" 
              src="/assets/blank_button.png"
              class="image-btn"
              data-choice="${i}"
              data-correct="${i === buttonAnswer}">
        <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
          <text x="50%" y="50%">%choice%</text>
        </svg>
      </div>
    `
        )
      : ["1", "2", "3"].map(
          (txt, i) => `
      <div class="image-btn-wrapper">
        <input type="image" 
              src="/assets/blank_${isMobile ? ["red", "blue", "green"][i] : ["red", "green", "blue"][i]}.png"
              class="image-btn"
              data-choice="${i}"
              data-correct="${i === buttonAnswer}">
        <svg class="image-btn-text ${lang}" viewBox="0 0 266 160">
          <text class="text-stroke" x="50%" y="50%">%choice%</text>
          <text class="text-fill" x="50%" y="50%">%choice%</text>
        </svg>
      </div>
    `
        ),

    on_load: function () {
      requestAnimationFrame(() => {
        fitTrialToScreen();
      });

      // Track state
      let hasRespondedIncorrectly = false;
      let isProcessingResponse = false;
      const trialStartTime = performance.now();

      const buttons = document.querySelectorAll(".image-btn");

      // Custom feedback function that doesn't redraw
      function showCustomFeedback(correct, text) {
        const promptContainer = document.querySelector(".prompt-container");
        if (!promptContainer) return;

        // FIX: Remove the newlines and indentation that cause whitespace
        promptContainer.innerHTML = `<p class="prompt prompt_text ${lang}" style="font-weight: normal; color: ${correct ? "green" : "red"};">${text}</p>`;

        // FIT THE TEXT
        requestAnimationFrame(() => {
          const promptText = promptContainer.querySelector(".prompt_text");
          console.log("Pre if");
          console.log(typeof fitTextToContainer);
          if (promptText && typeof fitTextToContainer === "function") {
            const containerHeight = promptContainer.offsetHeight;
            let minFontSize, maxFontSize;
            if (isMobile) {
              minFontSize = 36;
              maxFontSize = 96;
            } else if (isTablet) {
              minFontSize = 40;
              maxFontSize = 80;
            } else if (smallScreen) {
              minFontSize = 32;
              maxFontSize = 64;
            } else {
              // desktop
              minFontSize = 32;
              maxFontSize = 64;
            }
            console.log("Fitting prompt text");
            fitTextToContainer(promptText, containerHeight - 20, minFontSize, maxFontSize);
          }
        });
      }

      // Clone buttons to strip their event listeners
      buttons.forEach((btn) => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
      });

      // Add handlers to the clean buttons
      const cleanButtons = document.querySelectorAll(".image-btn");

      cleanButtons.forEach((btn) => {
        btn.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Prevent multiple simultaneous clicks
            if (isProcessingResponse) {
              return false;
            }

            const isCorrect = btn.dataset.correct === "true";
            const choiceIndex = parseInt(btn.dataset.choice);

            // CASE 1: First click is incorrect
            if (!hasRespondedIncorrectly && !isCorrect) {
              isProcessingResponse = true;
              hasRespondedIncorrectly = true;

              // Show incorrect feedback with proper sizing
              showCustomFeedback(false, incText);

              // Allow clicks again after feedback is shown
              setTimeout(() => {
                isProcessingResponse = false;
              }, 100);

              return false;
            }

            // CASE 2: Already responded incorrectly, clicking another incorrect button
            if (hasRespondedIncorrectly && !isCorrect) {
              return false;
            }

            // CASE 3: Clicking correct button (either first try or after incorrect)
            if (isCorrect) {
              isProcessingResponse = true;

              // Show correct feedback
              showCustomFeedback(true, corText);

              // Wait a moment, then end trial
              setTimeout(() => {
                // Clean up event listeners
                cleanupButtonListeners();

                // Finish trial with jsPsych
                const rt = performance.now() - trialStartTime;
                jsPsych.finishTrial({
                  stimulus: imgPath,
                  response: choiceIndex,
                  correct: !hasRespondedIncorrectly, // Only correct if they got it on first try
                  rt: rt,
                  button_answer: buttonAnswer,
                  got_it_wrong_first: hasRespondedIncorrectly,
                });
              }, 1500); // Show correct feedback for 1.5 seconds

              return false;
            }
          },
          true
        ); // Use capture phase
      });

      // Prevent jsPsych from interfering
      // Override innerHTML setter on the display element to block redraws
      const displayElement = document.querySelector(".jspsych-content");
      const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(
        Element.prototype,
        "innerHTML"
      );

      Object.defineProperty(displayElement, "innerHTML", {
        set: function () {
          // Block any attempts to redraw after initial load
          console.log("🛑 Blocked jsPsych redraw attempt");
          return;
        },
        get: function () {
          return originalInnerHTMLDescriptor.get.call(this);
        },
        configurable: true,
      });

      setupButtonListeners();
    },

    on_finish: function () {
      // Restore innerHTML setter
      const displayElement = document.querySelector(".jspsych-content");
      if (displayElement) {
        delete displayElement.innerHTML;
      }

      cleanupButtonListeners();
    },
  };
}

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
    prompt: `<p class="prompt_text" style="margin: 0;">${promptText}</p>`,
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
//----------------- CONSTANTS -------------------

const device = getDeviceType();
console.log("have device " + device);
const isMobile = device[0];
const isTablet = device[1];
const smallScreen = device[2];
console.log("smallScreen " + smallScreen);
/*const canvasWidth = isMobile ? stars_12 ? window.innerWidth * 1 : window.innerWidth * .9 
                    : isTablet ? stars_12 ? window.innerWidth * 1 : window.innerWidth * .9
                    : window.innerWidth * .9;
const canvasHeight = isMobile ? window.innerHeight * 0.65 
                    : smallScreen ? window.innerHeight * 0.75 
                    : isTablet ? window.innerHeight * 0.8 
                    : window.innerHeight * .70;
const fontScale = isMobile ? 1.5 : 1.0;
const stimScale = isMobile ? 2 : smallScreen ? 0.85: isTablet ? 1.2 : 1.0;*/
const classicGraphics = false; // for now
const stars_12 = true; // for now

const preload_fnames = [];

preload_fnames.push(
  "/assets/blank_blue.png",
  "/assets/blank_blue_pressed.png",
  "/assets/blank_green.png",
  "/assets/blank_green_pressed.png",
  "/assets/blank_red.png",
  "/assets/blank_red_pressed.png",
  "/assets/brain.png",
  images["pcon028a.jpg"],
  images["pcon028b.jpg"],
  "assets/pcon028b_border.png",
  "assets/pcon026a_border.png",
  "assets/pcon026b_border.png",
  "assets/pcon028a_border.png",
  "assets/foil_1035_border.png",
  images["pcon026a.jpg"],
  images["pcon026b.jpg"],
  "assets/foil_1033_border.png",
  "assets/foil_1032_border.png",
  ...Array.from({ length: 11 }, (_, i) => `/assets/star${i}.png`)
);

//----------------------- 4 ----------------------
//-------------------- TRIALS --------------------
// All the instructions trials.
// These trials call the functions housing the parameter information.

// trials declaration
var preload = {};
var intro = {};
var new1 = {};
var new2 = {};
var new3 = {};
var repeat1 = {};
var lure1 = {};
var side_by_side1 = {};
var new4 = {};
var new5 = {};
var repeat2 = {};
var lure2 = {};
var side_by_side2 = {};
var outro = {};

// function to refresh trials, called when Login options are set

function refresh_instr_trials(jsPsych) {
  console.log("...refreshing instr trial");

  preload = {
    type: jsPsychPreload,
    images: preload_fnames, // since we use a timeline variable, we can't use the simple "trials"
    show_progress_bar: true,
    show_detailed_erros: true,
    continue_after_error: true,
    on_error: function (fname) {
      console.log("FAILED  " + fname);
    },
    on_finish: function (data) {
      console.log("Preload success? " + data.success);
      console.log("Failed on " + data.failed_images.length);
    },
  };

  intro = {
    type: resp_mode == "button" ? jsPsychHtmlButtonResponse : jsPsychHtmlKeyboardResponse,
    choices: instr_choice,
    prompt: `<p class="prompt_text">${prompt0()}</p>`,
    stimulus: function () {
      return `<p class="prompt_text intro ${lang}">` + lang.instructions.txt0 + "</p>";
    },
    data: { task: phasename },
    button_html: classicGraphics
      ? `<div class="image-btn-wrapper">
        <input type="image" src="/assets/blank_button.png"
              class="image-btn">
        <svg class="image-btn-text" viewBox="0 0 266 160">
          <text x="50%" y="50%">${instr_choice()}</text>
        </svg>
      </div>`
      : `<div class="image-btn-wrapper">
        <input type="image" src="/assets/blank_green.png"
              class="image-btn">
        <svg class="image-btn-text" viewBox="0 0 266 160">
          <text class="text-stroke" x="50%" y="50%">${instr_choice()}</text>
          <text class="text-fill" x="50%" y="50%">${instr_choice()}</text>
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
  };

  new1 = makeCategorizeTrial(
    jsPsych,
    "assets/foil_1032_border.png",
    lang.instructions.key.trial_choices.new,
    trial_choices(),
    2,
    prompt_new(),
    inc_new(),
    cor_new()
  );

  /*new1 = {
    type: resp_mode == "button" ? jsPsychCategorizeImageButtons : jsPsychCategorizeImage,
    stimulus: images["foil_1032.jpg"],
    key_answer: function () {
      return lang.instructions.key.trial_choices.new;
    },
    button_answer: 2,
    choices: trial_choices,
    prompt: prompt_new,
    force_correct_button_press: true,
    incorrect_text: inc_new,
    correct_text: cor_new,
    data: { task: phasename },
  };*/

  new2 = makeCategorizeTrial(
    jsPsych,
    "assets/foil_1033_border.png",
    lang.instructions.key.trial_choices.new,
    trial_choices(),
    2,
    prompt_new(),
    inc_new(),
    cor_new()
  );

  new3 = makeCategorizeTrial(
    jsPsych,
    "assets/pcon026a_border.png",
    lang.instructions.key.trial_choices.new,
    trial_choices(),
    2,
    prompt_new(),
    inc_new(),
    cor_new()
  );

  repeat1 = makeCategorizeTrial(
    jsPsych,
    "assets/foil_1033_border.png",
    lang.instructions.key.trial_choices.old,
    trial_choices(),
    0,
    prompt_rep(),
    inc_rep(),
    cor_rep()
  );

  lure1 = makeCategorizeTrial(
    jsPsych,
    "assets/pcon026b_border.png",
    lang.instructions.key.trial_choices.sim,
    trial_choices(),
    1,
    prompt_lure(),
    inc_lure(),
    cor_lure()
  );

  side_by_side1 = makeSideBySideTrial(
    images["pcon026a.jpg"],
    images["pcon026b.jpg"],
    lang.instructions.side_by_side + "<br><br>" + side_by_side_prompt(),
    instr_choice()
  );

  /*side_by_side1 = {
    type: resp_mode == "button" ? jsPsychHtmlButtonResponse : jsPsychHtmlKeyboardResponse,
    stimulus: side_by_side1_stim,
    choices: instr_choice,
    prompt: side_by_side_prompt,
    data: { task: phasename },
  };*/

  new4 = makeCategorizeTrial(
    jsPsych,
    "assets/foil_1035_border.png",
    lang.instructions.key.trial_choices.new,
    trial_choices(),
    2,
    prompt_test(),
    inc_new(),
    cor_new()
  );

  new5 = makeCategorizeTrial(
    jsPsych,
    "assets/pcon028a_border.png",
    lang.instructions.key.trial_choices.new,
    trial_choices(),
    2,
    prompt_test(),
    inc_new(),
    cor_new()
  );

  repeat2 = makeCategorizeTrial(
    jsPsych,
    "assets/pcon026a_border.png",
    lang.instructions.key.trial_choices.old,
    trial_choices(),
    0,
    prompt_test(),
    inc_rep(),
    cor_rep()
  );

  lure2 = makeCategorizeTrial(
    jsPsych,
    "assets/pcon028b_border.png",
    lang.instructions.key.trial_choices.sim,
    trial_choices(),
    1,
    prompt_test(),
    inc_lure(),
    cor_lure()
  );

  side_by_side2 = makeSideBySideTrial(
    images["pcon028a.jpg"],
    images["pcon028b.jpg"],
    lang.instructions.side_by_side + "<br><br>" + side_by_side_prompt(),
    instr_choice()
  );

  outro = {
    type: resp_mode == "button" ? jsPsychHtmlButtonResponse : jsPsychHtmlKeyboardResponse,
    choices: instr_choice,
    prompt: `<p class="prompt_text">${prompt0()}</p>`,
    stimulus: function () {
      return `<p class="prompt_text intro ${lang}">` + lang.instructions.end + "</p>";
    },
    data: { task: phasename },
    button_html: classicGraphics
      ? `<div class="image-btn-wrapper">
        <input type="image" src="/assets/blank_button.png"
              class="image-btn">
        <svg class="image-btn-text" viewBox="0 0 266 160">
          <text x="50%" y="50%">${instr_choice()}</text>
        </svg>
      </div>`
      : `<div class="image-btn-wrapper">
        <input type="image" src="/assets/blank_green.png"
              class="image-btn">
        <svg class="image-btn-text" viewBox="0 0 266 160">
          <text class="text-stroke" x="50%" y="50%">${instr_choice()}</text>
          <text class="text-fill" x="50%" y="50%">${instr_choice()}</text>
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
  };

  console.log("refreshed instr trials");
}

//----------------------- 4 ----------------------
//-------------------- EXPORTS -------------------
// export the trials to be imported to the main timeline

export {
  refresh_instr_trials,
  preload,
  intro,
  new1,
  new2,
  new3,
  repeat1,
  lure1,
  side_by_side1,
  new4,
  new5,
  repeat2,
  lure2,
  side_by_side2,
  outro,
};
