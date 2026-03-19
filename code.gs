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

/* ================= COUNTER END ================= */

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

/* ================= YEAR SHEET END ================= */

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

/* ================= DRIVE FOLDER END ================= */

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

/* ================= MASTER END ================= */

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

/* ================= GET OPEN DC END ================= */

/* ================= CLOSE DC ================= */

function closeDC(dc, invoice){

  const sh = SpreadsheetApp.getActive()
    .getSheetByName("DC_STATUS");

  if(!sh) throw new Error("DC_STATUS missing");

  const data = sh.getRange(2,1,sh.getLastRow()-1,7).getValues();

  for(let i=0;i<data.length;i++){

    if(data[i][1] == dc && data[i][4] === "OPEN"){

      sh.getRange(i+2,5).setValue("CLOSED");
      sh.getRange(i+2,6).setValue(invoice);
      sh.getRange(i+2,7).setValue(new Date());

      return true;
    }
  }

  throw new Error("DC not found or already closed");
}

/* ================= CLOSE DC END ================= */

/* ================= SAVE DC ================= */

function saveDC(payload){

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  let dc;
  let sh;

  try{

    const ss = SpreadsheetApp.getActive();
    const config = ss.getSheetByName(CONFIG_SHEET);

    let last = Number(config.getRange("B1").getValue());
    if(isNaN(last)) throw new Error("CONFIG counter corrupted");

    dc = last + 1;

    // increment counter
    config.getRange("B1").setValue(dc);

    // timestamp
    const ts = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm"
    );

    // get log sheet
    sh = getYearSheet();

    // append INSIDE lock (atomic commit)
    sh.appendRow([
      ts,
      dc,
      payload.machine,
      payload.operator,
      payload.customer_id,
      payload.customer_name,
      payload.vehicle,
      payload.driver,
      payload.part,
      payload.desc,
      payload.qty,
      payload.uom,
      ""
    ]);

    const statusSheet = ss.getSheetByName("DC_STATUS");
    if(statusSheet){
      statusSheet.appendRow([
        ts,
        dc,
        payload.part,
        payload.qty,
        "OPEN",
        "",
        ""
      ]);
    }

  } finally {
    lock.releaseLock();
  }

  const pdf = generatePDF(payload, dc);

  updatePdfLink(dc, pdf.url);

  return {
    dc: dc,
    url: pdf.url,
    base64: pdf.base64
  };
}

/* ================= SAVE DC END ================= */

/* ================= UPDATE PDF ================= */

function updatePdfLink(dc, url){
  const sh = getYearSheet();

  const lastRow = sh.getLastRow();
  if(lastRow < 2) return;

  const data = sh.getRange(2,2,lastRow-1,1).getValues();

  for(let i=0;i<data.length;i++){
    if(data[i][0] == dc){
      sh.getRange(i+2,13).setValue(url);
      return;
    }
  }
}

/* ================= UPDATE PDF END ================= */
