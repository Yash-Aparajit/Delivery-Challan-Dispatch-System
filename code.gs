const CONFIG_SHEET = "CONFIG";
const CUSTOMER_SHEET = "MASTER_CUSTOMER";
const PART_SHEET = "MASTER_PART";
const TEMPLATE_SHEET = "SYSTEM_LOG_TEMPLATE";

const ROOT_FOLDER_ID = "YOUR FOLDER ID HERE";


function doGet(e){
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Dispatch DC");
}

/* ================= COUNTER ================= */

function getNextDC(){
  const sh = SpreadsheetApp.getActive().getSheetByName(CONFIG_SHEET);
  if(!sh) throw new Error("CONFIG sheet missing");

  let last = Number(sh.getRange("B1").getValue());
  if(isNaN(last)) throw new Error("CONFIG counter corrupted");
  return last + 1;
}

function incrementCounter(){
  const sh = SpreadsheetApp.getActive().getSheetByName(CONFIG_SHEET);
  let last = Number(sh.getRange("B1").getValue());
  if(isNaN(last)) throw new Error("CONFIG counter corrupted");
  sh.getRange("B1").setValue(last + 1);
}

/* ================= COUNTER CLOSE ================= */

/* ================= YEAR SHEET ================= */

function getYearSheet(){
  const year = new Date().getFullYear();
  const name = "SYSTEM_LOG_" + year;

  let ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);

  if(!sh){
    const template = ss.getSheetByName(TEMPLATE_SHEET);
    if(!template) throw new Error("SYSTEM_LOG_TEMPLATE missing");

    sh = template.copyTo(ss).setName(name);
  }

  return sh;
}

/* ================= YEAR SHEET CLOSE ================= */

/* ================= DRIVE FOLDER ================= */

function getMonthFolder(){
  const root = DriveApp.getFolderById(ROOT_FOLDER_ID);

  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth()+1)).slice(-2);

  let yearFolder = getOrCreate(root, year.toString());
  let monthFolder = getOrCreate(yearFolder, month);

  return monthFolder;
}

function getOrCreate(parent, name){
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

/* ================= DRIVE FOLDER CLOSE ================= */
