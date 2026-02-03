/* eslint-disable */ 
//*******************************************************************
//
//   File: contOmstset.js               Folder: config
//
//   Author: Craig Stark, Audrey Hempel
//   --------------------
//
//   Changes:
//        6/27/23 (AGH): created config for contOmst
//                       imported jsorders files
//                       removed .js from end of orderfile 
//        7/18/23 (AGH): moved all of the variables to /components/Login
//                       to be defined on options selection at Login
//                       changed orderfile defining into a function
//                       that returns the value
//                       changed trial_stim defining into a function
//                       that returns the value
//        8/9/23  (AGH): added and incorporated new 2x3 orderfiles
//
//   --------------------
//   This file includes the return functions writeOrderfile and loadOrderfile 
//   that set up the orderfile and stimulus sets based on the options
//   selection at Login. They are exported as variables from Login to be 
//   used throughout the app.
//
//*******************************************************************

//----------------------- 1 ----------------------
//-------------------- IMPORTS -------------------

// import { orderfile } from '../components/Login';

// importing each unique trial stimulus sets
import { ts2x3_1_1_1 } from './jsOrders/cMST_Imbal2x3_orders_1_1_1';
import { ts2x3_1_1_2 } from './jsOrders/cMST_Imbal2x3_orders_1_1_2';
import { ts2x3_1_1_3 } from './jsOrders/cMST_Imbal2x3_orders_1_1_3';
import { ts2x3_2_1_1 } from './jsOrders/cMST_Imbal2x3_orders_2_1_1';
import { ts2x3_2_1_2 } from './jsOrders/cMST_Imbal2x3_orders_2_1_2';
import { ts2x3_2_1_3 } from './jsOrders/cMST_Imbal2x3_orders_2_1_3';
import { ts2x3_3_1_1 } from './jsOrders/cMST_Imbal2x3_orders_3_1_1';
import { ts2x3_3_1_2 } from './jsOrders/cMST_Imbal2x3_orders_3_1_2';
import { ts2x3_3_1_3 } from './jsOrders/cMST_Imbal2x3_orders_3_1_3';
import { ts2x3_4_1_1 } from './jsOrders/cMST_Imbal2x3_orders_4_1_1';
import { ts2x3_4_1_2 } from './jsOrders/cMST_Imbal2x3_orders_4_1_2';
import { ts2x3_4_1_3 } from './jsOrders/cMST_Imbal2x3_orders_4_1_3';
import { ts2x3_5_1_1 } from './jsOrders/cMST_Imbal2x3_orders_5_1_1';
import { ts2x3_5_1_2 } from './jsOrders/cMST_Imbal2x3_orders_5_1_2';
import { ts2x3_5_1_3 } from './jsOrders/cMST_Imbal2x3_orders_5_1_3';
import { ts2x3_6_1_1 } from './jsOrders/cMST_Imbal2x3_orders_6_1_1';
import { ts2x3_6_1_2 } from './jsOrders/cMST_Imbal2x3_orders_6_1_2';
import { ts2x3_6_1_3 } from './jsOrders/cMST_Imbal2x3_orders_6_1_3';

//----------------------- 2 ----------------------
//------------------- FUNCTIONS ------------------

// write the orderfile path depending on selected set, trialorder and run options
function writeOrderfile(stim_set, sublist) {
  var orderprefix = './jsOrders/cMST_Imbal2x3_orders_';
  var orderfile = orderprefix + stim_set + '_1_' + sublist; 
  console.log('orderfile = ' + orderfile);
  return orderfile;
}

// load trial_stim depending on selected orderfile
function loadOrderfile(orderfile) {

  var trial_stim;

  if (orderfile == './jsOrders/cMST_Imbal2x3_orders_1_1_1') {
    return trial_stim = ts2x3_1_1_1;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_1_1_2') {
    return trial_stim = ts2x3_1_1_2;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_1_1_3') {
    return trial_stim = ts2x3_1_1_3;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_2_1_1') {
    return trial_stim = ts2x3_2_1_1;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_2_1_2') {
    return trial_stim = ts2x3_2_1_2;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_2_1_3') {
    return trial_stim = ts2x3_2_1_3;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_3_1_1') {
    return trial_stim = ts2x3_3_1_1;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_3_1_2') {
    return trial_stim = ts2x3_3_1_2;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_3_1_3') {
    return trial_stim = ts2x3_3_1_3;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_4_1_1') {
    return trial_stim = ts2x3_4_1_1;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_4_1_2') {
    return trial_stim = ts2x3_4_1_2;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_4_1_3') {
    return trial_stim = ts2x3_4_1_3;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_5_1_1') {
    return trial_stim = ts2x3_5_1_1;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_5_1_2') {
    return trial_stim = ts2x3_5_1_2;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_5_1_3') {
    return trial_stim = ts2x3_5_1_3;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_6_1_1') {
    return trial_stim = ts2x3_6_1_1;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_6_1_2') {
    return trial_stim = ts2x3_6_1_2;
  } 
  else if (orderfile == './jsOrders/cMST_Imbal2x3_orders_6_1_3') {
    return trial_stim = ts2x3_6_1_3;
  }
} 

// //----------------------- 3 ----------------------
// //-------------------- EXPORTS -------------------

export { writeOrderfile, loadOrderfile };
