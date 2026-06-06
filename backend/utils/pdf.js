const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try {
    // safety check
    if (!filePath || !fs.existsSync(filePath)) {
      return "";
    }

    const dataBuffer = fs.readFileSync(filePath);

    try {
      const data = await pdfParse(dataBuffer);
      return data.text || "";
    } catch (pdfError) {
      console.log("PDF PARSE ERROR:", pdfError.message);
      return ""; // IMPORTANT: prevent crash
    }
  } catch (error) {
    console.log("FILE READ ERROR:", error.message);
    return "";
  }
};

module.exports = { extractTextFromPDF };