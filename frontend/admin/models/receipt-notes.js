import { fetchData } from "../../utils.js";
import { RECEIPT_NOTES_API_URL } from "../../settings.js";


let isFetch = false;
let receiptNotesList = [];

async function fetchReceiptNotes(limit=null, offset=null) {
  const res = await fetchData(RECEIPT_NOTES_API_URL, limit, offset);
  receiptNotesList = res.data;
  isFetch = true;
}

export async function getReceiptNotesList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    await fetchReceiptNotes();
    console.log("fetch goods receipt notes API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : receiptNotesList.length;
  return JSON.parse(JSON.stringify(receiptNotesList.slice(start, end)));
}

export async function getReceiptNote(id) {
  if(!id) return undefined;

  const receiptNotesList = await getReceiptNotesList();
  return receiptNotesList.find(receipt => receipt.id == id) || undefined;
}
