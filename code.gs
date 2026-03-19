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

/* ================= MASTER ================= */

function getCustomers(){
  const sh = SpreadsheetApp.getActive().getSheetByName(CUSTOMER_SHEET);
  if(!sh) throw new Error("MASTER_CUSTOMER missing");

  if(sh.getLastRow() < 2) return [];

  return sh.getRange(2,1,sh.getLastRow()-1,3)
    .getValues()
    .filter(r => r[2] === true);
}

function getPart(part){
  const sh = SpreadsheetApp.getActive().getSheetByName(PART_SHEET);
  if(sh.getLastRow() < 2) return null;
  const data = sh.getRange(2,1,sh.getLastRow()-1,4).getValues();

  for(let r of data){
    if(r[0] == part && r[3] === true){
      return {desc:r[1],uom:r[2]};
    }
  }
  return null;
}

/* ================= MASTER CLOSE ================= */

/* ================= GET OPEN DC ================= */

function getOpenDC(){

  const sh = SpreadsheetApp.getActive()
    .getSheetByName("DC_STATUS");

  if(!sh || sh.getLastRow() < 2) return [];

  const data = sh.getRange(2,1,sh.getLastRow()-1,7).getValues();

  return data
    .filter(r => r[4] === "OPEN")
    .map(r => ({
      dc: r[1],
      part: r[2],
      qty: r[3]
    }));
}

/* ================= GET OPEN DC CLOSE ================= */
