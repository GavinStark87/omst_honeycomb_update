//*******************************************************************
//
//   File: demographics.js               Folder: trials
//
//   Author: Craig Stark, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/22/23 (AGH): adapted demogrpahics.html into honeycomb template
//                       (adding imports, exports, removing JATOS code)
//        6/23/23 (AGH): made dynamic for { lang }
//        6/30/23 (AGH): added selector ids and custom formatting
//                       in App.css
//        7/13/23 (AGH): added task data property to include task name
//
//   --------------------
//   This trial displays the demographics survey
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import jsPsychSurveyHtmlForm from "@jspsych/plugin-survey-html-form";
import { lang } from "../App/components/Login";

import { setupButtonListeners, cleanupButtonListeners } from "../lib/utils";
//----------------------- 2 ----------------------
//----------------- CONSTANTS ------------------
const classicGraphics = false;

//----------------------- 3 ----------------------
//--------------------- TRIAL --------------------

// demographics survey trial
//lang.demog.name +
//      '</b> <input name="fullname" type="text" required /></p> \
//      <p> <b>' +
var demogform = {
  type: jsPsychSurveyHtmlForm,
  preamble: function () {
    return (
      '<div id ="demogpramble"> <p class="prompt_text ${lang}">' +
      lang.demog.preamble +
      "</p></div>"
    );
  },
  css_classes: ["no-default-btn"],
  html: function () {
    return (
      `<div id="demogform"> \
      <p class="prompt_text ${lang}"><b>` +
      lang.demog.age +
      `</b> <input name="dob" type="text" required /></p> \
      
      <p class="prompt_text ${lang}"> <b>` +
      lang.demog.gender.prompt +
      `</b></p>\
      <div style="margin-left: 50px">\
         <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="male" name="gender" value="male" required>\
         </div>\
         <label for="male" style="display: inline-block; vertical-align: middle; margin-right: 20px;" class="prompt_text ${lang}">` +
      lang.demog.gender.m +
      `</label><br>\
         <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="female" name="gender" value="female">\
         </div>\
         <label for="female" style="display: inline-block; vertical-align: middle;" class="prompt_text ${lang}">` +
      lang.demog.gender.f +
      `</label>\
      </div>\
      
      <p class="prompt_text ${lang}"> <b>` +
      lang.demog.ethnicity.prompt +
      `</b></p>\
      <div style="margin-left: 50px">\
         <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="hispanic" name="ethnicity" value="hispanic" class="prompt_text ${lang}" required>\
         </div>\
         <label for="hispanic" style="display: inline-block; vertical-align: middle; margin-right: 20px;" class="prompt_text ${lang}">` +
      lang.demog.ethnicity.h +
      `</label><br>\
         <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="nonhispanic" name="ethnicity" value="nonhispanic">\
         </div>\
         <label for="nonhispanic" style="display: inline-block; vertical-align: middle;" class="prompt_text ${lang}">` +
      lang.demog.ethnicity.nh +
      `</label>\
      </div>\
      
      <p class="prompt_text ${lang}"> <b>` +
      lang.demog.race.prompt +
      `</b></p>\
      <div style="margin-left: 50px">\
         <div>\
            <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="nativeamerican" name="race" value="nativeamerican" required>\
            </div>\
            <label for="nativeamerican" style="display: inline-block; vertical-align: middle;" class="prompt_text ${lang}">` +
      lang.demog.race.ai +
      `</label>\
         </div>\
         <div>\
            <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="asian" name="race" value="asian">\
            </div>\
            <label for="asian" style="display: inline-block; vertical-align: middle;" class="prompt_text ${lang}">` +
      lang.demog.race.a +
      `</label>\
         </div>\
         <div>\
            <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="black" name="race" value="black">\
            </div>\
            <label for="black" style="display: inline-block; vertical-align: middle;" class="prompt_text ${lang}">` +
      lang.demog.race.b +
      `</label>\
         </div>\
         <div>\
            <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="nativehawaiian" name="race" value="nativehawaiian">\
            </div>\
            <label for="nativehawaiian" style="display: inline-block; vertical-align: middle;" class="prompt_text ${lang}">` +
      lang.demog.race.nh +
      `</label>\
         </div>\
         <div>\
            <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="white" name="race" value="white">\
            </div>\
            <label for="white" style="display: inline-block; vertical-align: middle;" class="prompt_text ${lang}">` +
      lang.demog.race.w +
      `</label>\
         </div>\
         <div>\
            <div class="radio-wrapper" style="display: inline-block; margin-right: 10px; vertical-align: middle;">\
            <input type="radio" id="more" name="race" value="more">\
            </div>\
            <label for="more" style="display: inline-block; vertical-align: middle;" class="prompt_text ${lang}">` +
      lang.demog.race.m +
      `</label>\
         </div>\
      </div>\
      </div>` +
      `<div class="image-btn-wrapper">
         <input type="image" src="/assets/blank_${classicGraphics ? "button" : "green"}.png"
               class="image-btn" id="id_continue_btn">
         <svg class="image-btn-text demo" viewBox="0 0 266 160">
            <text class="text-stroke" x="50%" y="50%">Continue</text>
            <text class="text-fill" x="50%" y="50%">Continue</text>
         </svg>
      </div>`
    );
  },
  on_load: function () {
    // grab the form element
    const form = document.querySelector("form");
    // grab the custom button input
    const btn = form.querySelector(".image-btn-wrapper input");

    btn.addEventListener("click", (e) => {
      e.preventDefault(); // prevent weird image input default
      form.requestSubmit(); // properly submit the form
    });

    setupButtonListeners();
  },

  on_finish: function (data) {
    cleanupButtonListeners();
    console.log(data.response);
  },
  // add task name to data collection
  data: { task: "demographics" },
};

//----------------------- 3 ----------------------
//--------------------- EXPORT -------------------

export { demogform };
