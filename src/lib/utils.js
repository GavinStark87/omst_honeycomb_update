//*******************************************************************
//
//   File: utils.js               Folder: lib
//
//   Author: Honeycomb, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/28/23 (AGH): created new image objects to direct the
//                       path for different sets
//        7/24/23 (AGH): added getFormattedDate method (for adding
//                       date to beginning and end of data file)
//        8/1/23 (AGH):  moved invNormcdf from contOmst and pcon here
//
//   --------------------
//   This file holds various utility functions.
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

import requireContext from "require-context.macro";

//----------------------- 2 ----------------------
//----------------- IMAGE OBJECTS ----------------

// Discover and import images in src/assets/images.
// This produces an object that maps friendly image file names to obscure webpack path names.
// For example:
//   {
//     image1.png: '/static/media/image1.5dca7a2a50fb8b633fd5.png',
//     image2.png: '/static/media/image2.5dca7a2a50fb8b633fd5.png'
//   }
const importAll = (r) => {
  const importImageByName = (allImages, imageName) => {
    const friendlyName = imageName.replace("./", "");
    return { ...allImages, [friendlyName]: r(imageName) };
  };
  return r.keys().reduce(importImageByName, {});
};

const images = importAll(requireContext("../../public/assets/images", false, /\.(png|jpe?g|svg)$/));

// 6/28/23 (AGH): adapted images object to direct for the different order sets
const set1Images = importAll(
  requireContext("../../public/assets/images/Set1_rs", false, /\.(png|jpe?g|svg)$/)
);

const set2Images = importAll(
  requireContext("../../public/assets/images/Set2_rs", false, /\.(png|jpe?g|svg)$/)
);

const set3Images = importAll(
  requireContext("../../public/assets/images/Set3_rs", false, /\.(png|jpe?g|svg)$/)
);

const set4Images = importAll(
  requireContext("../../public/assets/images/Set4_rs", false, /\.(png|jpe?g|svg)$/)
);

const set5Images = importAll(
  requireContext("../../public/assets/images/Set5_rs", false, /\.(png|jpe?g|svg)$/)
);

const set6Images = importAll(
  requireContext("../../public/assets/images/Set6_rs", false, /\.(png|jpe?g|svg)$/)
);

//----------------------- 3 ----------------------
//------------------- FUNCTIONS ------------------

function invNormcdf(p) {
  // https://stackoverflow.com/questions/8816729/javascript-equivalent-for-inverse-normal-function-eg-excels-normsinv-or-nor
  var a1 = -39.6968302866538,
    a2 = 220.946098424521,
    a3 = -275.928510446969;
  var a4 = 138.357751867269,
    a5 = -30.6647980661472,
    a6 = 2.50662827745924;
  var b1 = -54.4760987982241,
    b2 = 161.585836858041,
    b3 = -155.698979859887;
  var b4 = 66.8013118877197,
    b5 = -13.2806815528857,
    c1 = -7.78489400243029e-3;
  var c2 = -0.322396458041136,
    c3 = -2.40075827716184,
    c4 = -2.54973253934373;
  var c5 = 4.37466414146497,
    c6 = 2.93816398269878,
    d1 = 7.78469570904146e-3;
  var d2 = 0.32246712907004,
    d3 = 2.445134137143,
    d4 = 3.75440866190742;
  var p_low = 0.02425,
    p_high = 1 - p_low;
  var q, r;
  var retVal;

  if (p < 0 || p > 1) {
    alert("NormSInv: Argument out of range. Probability must be between 0 and 1.");
    retVal = 0;
  } else if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    retVal =
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    retVal =
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    retVal =
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  return retVal;
}

function getFormattedDate(date) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = daysOfWeek[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const timezoneOffset = date.getTimezoneOffset();
  const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60));
  const timezoneOffsetMinutes = Math.abs(timezoneOffset % 60);
  const timezoneSign = timezoneOffset > 0 ? "-" : "+";
  const timezoneName = "Eastern Daylight Time"; // Replace this with the actual timezone name if needed.

  const formattedDate = `${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}:${seconds} GMT${timezoneSign}${timezoneOffsetHours
    .toString()
    .padStart(2, "0")}${timezoneOffsetMinutes.toString().padStart(2, "0")} (${timezoneName})`;
  return formattedDate;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Add a random number between 0 and offset to the base number
 * @param {number} base The starting number
 * @param {number} offset The maximum addition to base
 * @returns The base number jittered by the offset
 */
function jitter(base, offset) {
  return base + Math.floor(Math.random() * Math.floor(offset));
}

/**
 * Add a random number between 0 and 50 to the base number
 * @param {number} base The starting number
 * @returns The base number jittered by 50
 */
function jitter50(base) {
  return jitter(base, 50);
}

/**
 * Flips a coin
 * @returns Returns true or false randomly
 */
function randomTrue() {
  return Math.random() > 0.5;
}

/**
 * Deeply copies an object
 * @param {Object} obj The starting object
 * @returns An exact copy of obj
 */
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format a number as a US dollar amount
 * @param {number} amount Dollar amount
 * @returns The string representation of amount in USD
 */
function formatDollars(amount) {
  return "$" + parseFloat(amount).toFixed(2);
}

/**
 * Adds a wait period before a trial begins
 * @param {Object} trial The trial to add a wait period to
 * @param {number} waitTime The amount of time to wait by
 * @returns The given trial with a waiting period before it
 */
// TODO 162: This should be a trial not a utility? It"s adding a separate trial in and of itself
// TODO 162: JsPsych has a property for the wait time before moving to the next trial
function generateWaitSet(trial, waitTime) {
  const waitTrial = Object.assign({}, trial);
  waitTrial.trial_duration = waitTime;
  waitTrial.response_ends_trial = false;
  waitTrial.prompt = "-";

  return [waitTrial, trial];
}

/**
 * Starts the JsPsych keyboard response listener
 * @param  jsPsych The jsPsych instance running the task.
 */
function startKeypressListener(jsPsych) {
  const keypressResponse = (info) => {
    const data = { key_press: info.key };
    jsPsych.finishTrial(data);
  };

  const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: keypressResponse,
    valid_responses: ["ALL_KEYS"],
    persist: false,
  });

  return keyboardListener;
}

/**
 * Gets the value of a given variable from the URL search parameters
 * @param {any} variable The key of the variable in the search parameters
 * @returns The value of variable in the search parameters
 */
function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

/**
 * Gets the ID of a prolific user from the URL search parameters
 * @returns
 */
function getProlificId() {
  const prolificId = getQueryVariable("PROLIFIC_PID");
  return prolificId;
}

/**
 * Emits an audible beep
 * @param {Object} audioCodes The type/frequency of the beep
 */
function beep(audioCodes) {
  const context = new AudioContext();
  const o = context.createOscillator();
  const g = context.createGain();
  o.type = audioCodes.type;
  o.connect(g);
  o.frequency.setValueAtTime(audioCodes.frequency, 0);
  console.log(context.currentTime);
  g.connect(context.destination);
  o.start();
  o.stop(context.currentTime + 0.4);
}

/**
 * Interleave a value before/after every element in an array
 * @param {Array<any>} arr The original array
 * @param {any} val The value to interleave inside the array
 * @param {boolean} addBefore Whether to add val before or after each element in array
 * @returns The original array with val interleaved between every element
 */
function interleave(arr, val, addBefore = true) {
  return [].concat(...arr.map((n) => (addBefore ? [val, n] : [n, val])));
}

//----------- BUTTON PRESS HANDLING -------------
let activeBtn = null;
let lastTouchTime = 0;
const hasHover = window.matchMedia("(hover: hover)").matches;

function handlePress(e) {
  // First try to find wrapper from the target
  let wrapper = e.target.closest(".image-btn-wrapper");

  // If not found, check if we clicked the jsPsych button container
  if (!wrapper) {
    const jsPsychBtn = e.target.closest(".jspsych-canvas-button-response-button");
    if (jsPsychBtn) {
      wrapper = jsPsychBtn.querySelector(".image-btn-wrapper");
    }
  }

  if (!wrapper) return;

  const btn = wrapper.querySelector(".image-btn");

  // Track touch usage
  if (e.type === "touchstart") {
    lastTouchTime = Date.now();
  }

  // Block ghost mouse events on touch devices
  if (e.type === "mouseover") {
    const timeSinceTouch = Date.now() - lastTouchTime;

    if (timeSinceTouch < 500) {
      return;
    }
    if (!hasHover) {
      return;
    }
  }

  if (activeBtn === btn) {
    return;
  }

  const origSrc = btn.dataset.orig || btn.src;
  const pressedSrc = btn.dataset.pressed || origSrc.replace(".png", "_pressed.png");

  btn.dataset.orig = origSrc;
  btn.dataset.pressed = pressedSrc;

  btn.src = pressedSrc;
  wrapper.classList.add("pressed");

  activeBtn = btn;
}

function handleRelease(e) {
  if (!activeBtn) return;

  if (e && e.type === "touchend") {
    lastTouchTime = Date.now();
  }

  // Block ghost mouse events
  if (e && e.type.startsWith("mouse")) {
    const timeSinceTouch = Date.now() - lastTouchTime;
    if (timeSinceTouch < 500) {
      return;
    }
  }

  const wrapper = activeBtn.closest(".image-btn-wrapper");
  if (wrapper) {
    activeBtn.src = activeBtn.dataset.orig;
    wrapper.classList.remove("pressed");
  }

  activeBtn = null;
}

function forceReleaseAll() {
  if (activeBtn) {
    const wrapper = activeBtn.closest(".image-btn-wrapper");
    if (wrapper) {
      activeBtn.src = activeBtn.dataset.orig;
      wrapper.classList.remove("pressed");
    }
    activeBtn = null;
  }
}

function setupButtonListeners() {
  // Touch events
  document.addEventListener("touchstart", handlePress, { passive: true });
  document.addEventListener("touchend", handleRelease, { passive: true });
  document.addEventListener("touchcancel", forceReleaseAll, { passive: true });

  // Mouse hover
  document.addEventListener("mouseover", handlePress, true);
  document.addEventListener("mouseleave", handleRelease, true);
  document.addEventListener("mouseout", handleRelease, true);

  // Navigation cleanup
  window.addEventListener("pagehide", (e) => {
    forceReleaseAll(e);
  });

  window.addEventListener("beforeunload", (e) => {
    forceReleaseAll(e);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) forceReleaseAll();
  });
}

function cleanupButtonListeners() {
  document.removeEventListener("mouseover", handlePress, true);
  document.removeEventListener("mouseleave", handleRelease, true);
  document.removeEventListener("mouseout", handleRelease, true);
  document.removeEventListener("touchstart", handlePress);
  document.removeEventListener("touchend", handleRelease);
  document.removeEventListener("touchcancel", forceReleaseAll);
  window.removeEventListener("pagehide", forceReleaseAll);
  window.removeEventListener("beforeunload", forceReleaseAll);

  forceReleaseAll();
}

//-----------------------DEVICES----------------------
function getDeviceType() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isPortrait = height > width;

  // Calculate aspect ratio (always longer side / shorter side)
  const aspectRatio = Math.max(width, height) / Math.min(width, height);

  const screenSize = Math.max(width, height);
  const mobile = [true, false, false];
  const tablet = [false, true, false];
  const laptop = [false, false, true];
  const desktop = [false, false, false];

  console.log("width: " + width);
  console.log("height: " + height);
  console.log("aspect ratio: " + aspectRatio.toFixed(2));

  if (screenSize >= 1920) {
    if (isPortrait && aspectRatio >= 1.3 && aspectRatio <= 1.675) {
      console.log("tablet (large)");
      return tablet;
    } else if (isPortrait) {
      console.log("phone (large)");
      return mobile;
    }
    console.log("desktop");
    return desktop;
  }

  // Laptop range (typically 13-15 inch displays)
  if (screenSize >= 1366 && screenSize < 1920) {
    // Large tablets in portrait can reach this size, use aspect ratio
    if (isPortrait && aspectRatio >= 1.3 && aspectRatio <= 1.6) {
      console.log("tablet (large)");
      return tablet;
    } else if (isPortrait) {
      console.log("phone (large)");
      return mobile;
    }
    console.log("laptop");
    return laptop;
  }

  // Medium screens (tablets vs small laptops)
  if (screenSize >= 1024 && screenSize < 1366) {
    if (isPortrait && aspectRatio >= 1.3 && aspectRatio <= 1.6) {
      console.log("tablet");
      return tablet;
    } else if (isPortrait) {
      console.log("phone (large)");
      return mobile;
    } else {
      console.log("laptop");
      return laptop;
    }
  }

  // Small to medium screens - THIS IS THE KEY RANGE
  // Use aspect ratio to distinguish phones from tablets
  if (screenSize >= 768 && screenSize < 1024) {
    // Phones have more elongated screens (taller/narrower)
    // aspectRatio >= 1.7 suggests a phone
    if (aspectRatio >= 1.7) {
      console.log("mobile");
      return mobile;
    } else {
      console.log("tablet (small)");
      return tablet;
    }
  }

  // Smaller screens - but check aspect ratio still
  if (screenSize < 768) {
    // Small tablets might be here with squarer aspect ratios
    if (aspectRatio < 1.5 && screenSize >= 600) {
      console.log("tablet (very small)");
      return tablet;
    }
    console.log("mobile");
    return mobile;
  }

  // Fallback
  console.log("desktop");
  return desktop;
}

//----------------------- TEXT ----------------------
async function drawHTMLText(ctx, html, x, y, fontSize, device, classicGraphics = false) {
  const smallScreen = device[2];
  const parts = html.split(/(<[^>]+>)/).filter((p) => p.trim() !== "");
  let fontStyle = "";
  const letterSpacing = fontSize * 0.08; // change multiplier to change kerning
  const italicCorrection = classicGraphics ? fontSize * 0.08 : fontSize * 0.12; // Extra spacing after italic-to-roman transition
  const maxWidth = 1.5 * x;

  // Classic vs Modern styling
  const fontFamily = classicGraphics ? `"Open Sans", "Arial", sans-serif` : `"Comic Relief"`;
  const useOutline = !classicGraphics;

  if (!classicGraphics && "fonts" in document) {
    try {
      await document.fonts.load(`bold ${fontSize}px "Comic Relief"`);
      await document.fonts.load(`italic bold ${fontSize}px "Comic Relief"`);
      console.log("✓ Comic Relief font loaded for canvas");
    } catch (error) {
      console.warn("⚠ Failed to load Comic Relief font:", error);
    }
  }

  console.log("fontFamily: " + fontFamily);

  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Split into words, keeping HTML tags
  let words = [];
  for (let part of parts) {
    if (part.startsWith("<")) {
      words.push(part);
    } else {
      part.split(" ").forEach((word, i, arr) => {
        words.push(word + (i < arr.length - 1 ? " " : ""));
      });
    }
  }

  let lines = [];
  let currentLine = [];
  let currentLineWidth = 0;
  for (let word of words) {
    if (word === "<p>") {
      fontStyle = "";
      continue;
    }
    if (word === "</p>") {
      fontStyle = "";
      continue;
    }
    if (word === "<i>") {
      fontStyle = "italic ";
      continue;
    }
    if (word === "</i>") {
      fontStyle = "";
      continue;
    }
    if (word === "<b>") {
      fontStyle = "bold ";
      continue;
    }
    if (word === "</b>") {
      fontStyle = "";
      continue;
    }

    ctx.font = `${fontStyle}bold ${fontSize}px ${fontFamily}`;
    const wordWidth = ctx.measureText(word).width;

    const wordObj = {
      text: word,
      font: ctx.font,
      width: wordWidth,
      isItalic: fontStyle.includes("italic"),
    };
    if (currentLineWidth + wordWidth > maxWidth) {
      if (currentLine[0]) {
        if (currentLine[currentLine.length - 1].text == "") {
          currentLine.pop();
        }
      }
      // Trim trailing space
      if (currentLine.length && currentLine[currentLine.length - 1].text.endsWith(" ")) {
        currentLine[currentLine.length - 1].text =
          currentLine[currentLine.length - 1].text.trimEnd();
        currentLine[currentLine.length - 1].width = ctx.measureText(
          currentLine[currentLine.length - 1].text
        ).width;
      }

      lines.push(currentLine);

      // Start new line
      const trimmedWord = word.trimStart();
      currentLine = trimmedWord
        ? [
            {
              text: trimmedWord,
              font: ctx.font,
              width: ctx.measureText(trimmedWord).width,
              isItalic: fontStyle.includes("italic"),
            },
          ]
        : [];
      currentLineWidth = trimmedWord ? ctx.measureText(trimmedWord).width : 0;
    } else {
      currentLine.push(wordObj);

      currentLineWidth += wordWidth;
    }
  }
  if (currentLine.length) lines.push(currentLine);

  // Draw each line with kerning
  const lineHeight = fontSize * 1.2;
  const startY = y;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const lineCharCount = line.reduce((sum, w) => sum + w.text.length, 0);
    const lineWidth = line.reduce((sum, w) => sum + w.width, 0) + letterSpacing * lineCharCount;
    let startX = x - lineWidth / 2;

    for (let wordIdx = 0; wordIdx < line.length; wordIdx++) {
      let word = line[wordIdx];
      ctx.font = word.font;

      // Determine word color
      let fillColor = classicGraphics ? "black" : "#fff8d6";

      if (!classicGraphics) {
        if (
          word.text.includes("Old") ||
          word.text.includes("Viejo") ||
          word.text.includes("旧") ||
          word.text.includes("이전") ||
          word.text.includes("Oud") ||
          word.text.includes("Старое")
        )
          fillColor = "#f9b8d0";
        else if (
          word.text.includes("Similar") ||
          word.text.includes("相近") ||
          word.text.includes("비슷한") ||
          word.text.includes("Gelijkaardig") ||
          word.text.includes("Похожее")
        )
          fillColor = "#d3f5a6";
        else if (
          word.text.includes("New") ||
          word.text.includes("Nuevo") ||
          word.text.includes("新") ||
          word.text.includes("새로운") ||
          word.text.includes("Nieuw") ||
          word.text.includes("Новое")
        )
          fillColor = "#b4d8ff";
      }

      ctx.fillStyle = fillColor;

      if (useOutline) {
        ctx.lineWidth = smallScreen ? 8 : 12;
        ctx.strokeStyle = "#5d2b12";
      }

      // Draw word character by character with spacing
      let charX = startX;
      for (let charIdx = 0; charIdx < word.text.length; charIdx++) {
        let char = word.text[charIdx];
        if (useOutline) {
          ctx.strokeText(char, charX, startY + i * lineHeight);
        }
        ctx.fillText(char, charX, startY + i * lineHeight);
        charX += ctx.measureText(char).width + letterSpacing;

        // Add italic correction if transitioning from italic to non-italic
        const isLastCharInWord = charIdx === word.text.length - 1;
        const nextWord = line[wordIdx + 1];
        if (word.isItalic && isLastCharInWord && nextWord && !nextWord.isItalic) {
          charX += italicCorrection;
        }
      }

      startX += word.width + letterSpacing * word.text.length;

      // Add correction to startX as well for proper alignment
      const nextWord = line[wordIdx + 1];
      if (word.isItalic && nextWord && !nextWord.isItalic) {
        startX += italicCorrection;
      }
    }
  }

  const textEndY = startY + lines.length * lineHeight;
  return {
    startY: startY - lineHeight / 2, // Account for middle baseline
    endY: textEndY + lineHeight / 2,
    lineHeight: lineHeight,
    numLines: lines.length,
  };
}

//----------------------- STYLING ----------------------
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

//----------------------- SCALING ----------------------
function fitTextToContainer(element, maxHeight, minSize = 12, maxSize = 48) {
  if (document.fonts) {
    const computedFont = window.getComputedStyle(element).fontFamily;
    const fontName = computedFont.split(",")[0].replace(/['"]/g, "").trim();
    console.log(fontName);
    // make sure font is loaded
    if (!document.fonts.check(`12px "${fontName}"`)) {
      console.log(`Waiting for font ${fontName} to load...`);
      // Schedule retry after fonts load
      if (!element.dataset.fontWaitScheduled) {
        element.dataset.fontWaitScheduled = "true";
        document.fonts.ready.then(() => {
          delete element.dataset.fontWaitScheduled;
          fitTextToContainer(element, maxHeight, minSize, maxSize);
        });
      }
      return minSize; // Return minimum safe size temporarily
    }
  } else {
    console.log("no fonts", document.fonts);
  }

  console.log(`Fitting to ${maxHeight}px, range ${minSize}-${maxSize}`);

  // DISABLE iOS text size adjustment
  element.style.webkitTextSizeAdjust = "none";
  element.style.textSizeAdjust = "none";

  const originalStyles = {
    height: element.style.height,
    overflow: element.style.overflow,
    lineHeight: element.style.lineHeight,
    transition: element.style.transition,
    visibility: element.style.visibility,
  };

  element.style.height = "auto";
  element.style.overflow = "visible";
  element.style.lineHeight = "1.2";
  element.style.transition = "none";

  // Better reflow forcing
  const getMeasurement = () => {
    // Force layout by reading multiple properties
    void element.offsetTop;
    void element.offsetLeft;
    void element.offsetWidth;
    const h1 = element.offsetHeight;
    void element.scrollHeight;
    const h2 = element.offsetHeight;
    const h3 = element.getBoundingClientRect().height;

    // Use the maximum of all measurements, rounded up
    return Math.ceil(Math.max(h1, h2, h3));
  };

  let low = minSize;
  let high = maxSize;
  let bestFit = minSize;
  let iterations = 0;
  const maxIterations = 20; // Prevent infinite loops

  while (low <= high && iterations < maxIterations) {
    iterations++;
    const fontSize = Math.floor((low + high) / 2);
    element.style.fontSize = fontSize + "px";

    // Wait for next frame (forces browser to complete layout)
    const startTime = performance.now();
    while (performance.now() - startTime < 1) {
      void element.offsetHeight;
    }

    const naturalHeight = getMeasurement();

    console.log(
      `  Testing ${fontSize}px: natural height = ${naturalHeight}px (max: ${maxHeight}px)`
    );

    // Add a small tolerance (1-2px) to account for subpixel rounding
    if (naturalHeight <= maxHeight + 1) {
      bestFit = fontSize;
      low = fontSize + 1;
    } else {
      high = fontSize - 1;
    }
  }

  element.style.fontSize = bestFit + "px";
  console.log(`  Final: ${bestFit}px after ${iterations} iterations`);

  element.style.height = originalStyles.height;
  element.style.overflow = originalStyles.overflow;
  element.style.transition = originalStyles.transition;
  element.style.visibility = originalStyles.visibility;
  console.log(`Shrinked best fit to ${bestFit}`);
  return bestFit;
}

function calculateSideBySideCanvasSize(smallScreen, stimText = false, pairwise = false) {
  const totalWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const totalHeight = window.offsetHeight ? window.offsetHeight : window.innerHeight;
  // Define horizontal space allocation for each device type
  let widthPercent;
  if (smallScreen) {
    widthPercent = totalHeight < 700 && pairwise ? 0.4 : 0.5; // Shorter screens need smaller images
  } else {
    // desktop
    widthPercent = 0.4; // 40% of screen width
  }

  // Calculate canvas width
  const canvasWidth = totalWidth * widthPercent;

  // Calculate canvas height (2:1 ratio - width:height)
  // Since we have 2 square images side by side, the canvas is 2x wider than tall
  // So height = width / 2
  const canvasHeight = stimText ? canvasWidth / 1.8 : canvasWidth / 1.8;

  // jsPsych canvas_size is [height, width]
  return [Math.floor(canvasHeight), Math.floor(canvasWidth)];
}

function fitSideBySideToScreen(smallScreen, pairwise = false) {
  const container = document.querySelector(".jspsych-content");
  if (!container) return;

  const totalHeight = window.offsetHeight ? window.offsetHeight : window.innerHeight;

  // grab 3 sections
  const canvasStimulusContainer = pairwise
    ? document.querySelector("#jspsych-canvas-stimulus")
    : document.querySelector("#jspsych-canvas-button-response-stimulus") ||
      document.querySelector("#jspsych-canvas-keyboard-response-stimulus");
  const buttonContainer = document.querySelector("#jspsych-canvas-button-response-btngroup");
  const promptContainer = document.querySelector(".prompt_text");

  if (!canvasStimulusContainer) {
    console.warn("Side-by-side elements not found");
    return;
  }

  console.log("Fitting side-by-side prompt text");
  console.log("starting prompt height", promptContainer.offsetHeight);

  // Measure actual heights
  const canvasHeight = canvasStimulusContainer.offsetHeight;
  const buttonHeight = !buttonContainer ? 0 : buttonContainer.offsetHeight;
  const margin = pairwise && smallScreen ? 120 : 20;

  // Calculate remaining space for prompt
  const promptHeight = totalHeight - canvasHeight - buttonHeight - margin;

  console.log("Space allocation:", {
    totalHeight,
    canvasHeight,
    buttonHeight,
    promptHeight,
    margin,
  });

  // Style and fit prompt text
  if (promptContainer && promptHeight > 20) {
    const finalHeight = Math.max(promptHeight, 40) + "px";

    promptContainer.style.height = finalHeight + "px";
    promptContainer.style.overflow = "hidden";
    promptContainer.style.boxSizing = "border-box";
    promptContainer.style.margin = "10 auto";
    promptContainer.style.textAlign = "center";
    promptContainer.style.justifyContent = "space-between";
    promptContainer.style.padding = "10px 20px";

    // Fit text to available space
    if (typeof fitTextToContainer === "function") {
      let minFontSize, maxFontSize;
      if (smallScreen) {
        minFontSize = 24;
        maxFontSize = 64;
      } else {
        // desktop
        minFontSize = 32;
        maxFontSize = 96;
      }
      fitTextToContainer(promptContainer, promptHeight * 0.95, minFontSize, maxFontSize);
      container.classList.add("ready");
    }
  }
}

function fitSideBySideTrialToScreen(smallScreen, pairwise = false) {
  const container = document.querySelector(".jspsych-content");
  if (!container) return;

  const totalHeight = window.innerHeight;

  // Find the elements in the new structure
  const stimulusTextContainer = document.querySelector(".stimulus_div"); // Top stimulus text
  const canvasElement = document.querySelector(".jspsych-content canvas");
  const buttonContainer =
    document.querySelector("#jspsych-canvas-button-response-btngroup") ||
    document.querySelector("#jspsych-canvas-keyboard-response-btngroup");
  const promptContainer =
    document.querySelector(".prompt") ||
    document.querySelector(".jspsych-canvas-keyboard-response-prompt"); // Bottom prompt

  console.log("Fitting side-by-side layout");

  // Measure actual heights
  const stimulusTextHeight = stimulusTextContainer ? stimulusTextContainer.offsetHeight : 0;
  const canvasHeight = canvasElement.offsetHeight;
  const buttonHeight = !buttonContainer ? 0 : buttonContainer.offsetHeight;
  const promptHeight = promptContainer ? promptContainer.offsetHeight : 0;
  const margin = pairwise && smallScreen ? 120 : 60;

  console.log("Current space allocation:", {
    totalHeight,
    stimulusTextHeight,
    canvasHeight,
    buttonHeight,
    promptHeight,
    margin,
    totalUsed: stimulusTextHeight + canvasHeight + buttonHeight + promptHeight + margin,
  });

  // Calculate remaining space for stimulus text
  const availableHeight = totalHeight - canvasHeight - buttonHeight - (promptHeight || 0) - margin;
  let targetStimulusHeight = Math.max(availableHeight, 40);
  targetStimulusHeight = Math.min(targetStimulusHeight, totalHeight * 0.3); // Cap at 30% of screen height
  console.log("Target stimulus text height:", targetStimulusHeight);

  // Style and fit stimulus text container
  if (stimulusTextContainer && availableHeight > 20) {
    stimulusTextContainer.style.height = targetStimulusHeight + "px";
    stimulusTextContainer.style.overflow = "hidden";
    stimulusTextContainer.style.boxSizing = "border-box";
    stimulusTextContainer.style.margin = "10px auto";
    stimulusTextContainer.style.textAlign = "center";
    stimulusTextContainer.style.display = "flex";
    stimulusTextContainer.style.alignItems = "center";
    stimulusTextContainer.style.justifyContent = "center";
    stimulusTextContainer.style.padding = "10px 20px";

    // Fit text to available space
    if (typeof fitTextToContainer === "function") {
      let minFontSize, maxFontSize;
      if (smallScreen) {
        minFontSize = 24;
        maxFontSize = 64;
      } else {
        // desktop
        minFontSize = 32;
        maxFontSize = 96;
      }
      fitTextToContainer(
        stimulusTextContainer,
        targetStimulusHeight * 0.95,
        minFontSize,
        maxFontSize
      );
    }
  }

  // Also handle bottom prompt if it exists
  if (promptContainer) {
    promptContainer.style.boxSizing = "border-box";
    promptContainer.style.textAlign = "center";
    promptContainer.style.padding = "5px 20px";
  }

  container.classList.add("ready");
}

function fitIntroOutroToScreen(smallScreen) {
  const container = document.querySelector(".jspsych-content");
  if (!container) return;
  container.classList.remove("ready");
  const totalHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  // grab 3 sections
  const stimulusContainer =
    document.querySelector(".intro") ||
    document.querySelector("#jspsych-html-button-response-stimulus .prompt_text");
  const buttonContainer =
    document.querySelector("#jspsych-html-button-response-btngroup") ||
    document.querySelector(".jspsych-btn");
  const promptContainer = document.querySelector(".jspsych-content > p.prompt_text:not(.intro)");

  if (!stimulusContainer) {
    console.warn("Intro/outro elements not found");
    return;
  }

  const buttonHeight = !buttonContainer ? 0 : buttonContainer.offsetHeight;
  const margin = 80;
  const availableHeight = totalHeight - buttonHeight - margin;
  const stimulusAllocation = availableHeight * 0.9;
  const promptAllocation = availableHeight * 0.1;

  console.log("Available space:", {
    totalHeight,
    buttonHeight,
    margin,
    availableHeight,
    stimulusAllocation,
  });

  // Style STIMULUS - but don't set fixed height yet
  if (stimulusContainer) {
    stimulusContainer.style.overflow = "visible"; // Critical for measurement
    stimulusContainer.style.height = "auto"; // Let it size naturally
    stimulusContainer.style.boxSizing = "border-box";
    stimulusContainer.style.margin = "0 auto";
    stimulusContainer.style.textAlign = "center";
    stimulusContainer.style.padding = "20px";
    stimulusContainer.style.maxWidth = "70%";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let minFontSize, maxFontSize;
        if (smallScreen) {
          minFontSize = 24;
          maxFontSize = 56;
        } else {
          minFontSize = 32;
          maxFontSize = 88;
        }

        const finalSize = fitTextToContainer(
          stimulusContainer,
          stimulusAllocation - 40,
          minFontSize,
          maxFontSize
        );

        console.log("Stimulus fitted to:", finalSize);

        // Now apply final styling
        stimulusContainer.style.height = stimulusAllocation + "px";
        stimulusContainer.style.overflow = "hidden";
      });
    });
  }

  // Similar for prompt
  if (promptContainer && promptAllocation > 20) {
    promptContainer.style.overflow = "visible";
    promptContainer.style.height = "auto";
    promptContainer.style.boxSizing = "border-box";
    promptContainer.style.margin = "0 auto";
    promptContainer.style.textAlign = "center";
    promptContainer.style.padding = "10px 20px";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let minFontSize, maxFontSize;
        if (smallScreen) {
          minFontSize = 20;
          maxFontSize = 56;
        } else {
          minFontSize = 32;
          maxFontSize = 64;
        }

        fitTextToContainer(promptContainer, promptAllocation, minFontSize, maxFontSize);
        container.classList.add("ready");
        promptContainer.style.height = promptAllocation + "px";
        promptContainer.style.overflow = "hidden";
      });
    });
  }
}

//----------------------- EXPORTS ----------------------
export {
  beep,
  deepCopy,
  formatDollars,
  generateWaitSet,
  getProlificId,
  interleave,
  jitter,
  jitter50,
  randomTrue,
  sleep,
  startKeypressListener,
  images,
  set1Images,
  set2Images,
  set3Images,
  set4Images,
  set5Images,
  set6Images,
  getFormattedDate,
  invNormcdf,
  setupButtonListeners,
  cleanupButtonListeners,
  getDeviceType,
  drawHTMLText,
  calculateSideBySideCanvasSize,
  fitSideBySideToScreen,
  fitSideBySideTrialToScreen,
  fitTextToContainer,
  fitIntroOutroToScreen,
  roundRect,
};
