import "./styles.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { headRows, bodyRows } from "./helpers";
import { faker } from "@faker-js/faker";

// Loaded via <script> tag, create shortcut to access PDF.js exports. (GT: pffuuj)
var pdfjsLib = window["pdfjs-dist/build/pdf"];
// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//mozilla.github.io/pdf.js/build/pdf.worker.js";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
<canvas id="the-canvas"></canvas>
`;

var doc = new jsPDF("l");

var head = headRows();
head[0]["text"] = "Text";
var body = bodyRows(4);
body.forEach(function (row) {
  row["text"] = faker.lorem.sentence(100);
});

doc.text("Overflow 'ellipsize' with one column with long content", 14, 20);
doc.autoTable({
  head: head,
  body: body,
  startY: 25,
  // Default for all columns
  styles: { overflow: "ellipsize", cellWidth: "wrap" },
  // Override the default above for the text column
  columnStyles: { text: { cellWidth: "auto" } }
});
doc.text(
  "Overflow 'linebreak' (default) with one column with long content",
  14,
  doc.lastAutoTable.finalY + 10
);
doc.autoTable({
  head: head,
  body: body,
  startY: doc.lastAutoTable.finalY + 15,
  rowPageBreak: "auto",
  bodyStyles: { valign: "top" }
});
var blob = doc.output("arraybuffer");

// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument({ data: blob });
console.log(loadingTask);
loadingTask.promise.then(
  function (pdf) {
    console.log("PDF loaded");

    // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function (page) {
      console.log("Page loaded");

      var scale = 1.5;
      var viewport = page.getViewport({ scale: scale });

      // Prepare canvas using PDF page dimensions
      var canvas = document.getElementById("the-canvas");
      var context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);
      renderTask.promise.then(function () {
        console.log("Page rendered");
      });
    });
  },
  function (reason) {
    // PDF loading error
    console.error(reason);
  }
);
