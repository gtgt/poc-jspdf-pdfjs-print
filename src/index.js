import "./styles.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { headRows, bodyRows } from "./helpers";

function handlePages(page, iframe) {
  var pdf = page._transport, currPage = page._pageIndex + 1;
  console.info("Page ", currPage, "loaded.", pdf);

  //This gives us the page's dimensions at 150% scale
  var viewport = page.getViewport({scale: 1.5});

  //We'll create a canvas for each page to draw it on
  var canvas = iframe.contentDocument.createElement("canvas");
  iframe.contentDocument.body.appendChild(canvas);
  canvas.style.display = "block";
  var context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  //Draw it on the canvas
  var renderTask = page.render({canvasContext: context, viewport: viewport});
  renderTask.promise.then(function () {
    console.info("Page rendered");
    //Move to next page
    if (currPage < pdf._numPages) {
      pdf.getPage(currPage + 1).then(function(page) {
        handlePages(page, iframe);
      });
    } else {
      console.info("All pages rendered, printing...");
      iframe.contentWindow.print();
    }
  });
}

document.getElementById('btn-start').addEventListener('click', function() {
  var iframe = document.createElement('iframe');
  // can't use display = none, it won't render...
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.position = "absolute";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  // Loaded via <script> tag, create shortcut to access PDF.js exports. (GT: pffuuj)
  var pdfjsLib = window["pdfjs-dist/build/pdf"];
  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "//mozilla.github.io/pdf.js/build/pdf.worker.js";

  var doc = new jsPDF("p");

  doc.text("Overflow 'ellipsize' with one column with long content", 14, 20);
  doc.autoTable({
    head: headRows(),
    body: bodyRows(10),
    startY: 25,
    // Default for all columns
    styles: {overflow: "ellipsize", cellWidth: "wrap"},
    // Override the default above for the text column
    columnStyles: {text: {cellWidth: "auto"}}
  });
  doc.text("Overflow 'linebreak' (default) with one column with long content", 14, doc.lastAutoTable.finalY + 10);
  doc.autoTable({
    head: headRows(),
    body: bodyRows(4),
    startY: doc.lastAutoTable.finalY + 15,
    rowPageBreak: "auto",
    bodyStyles: {valign: "top"}
  });
  var blob = doc.output("arraybuffer");

  // Asynchronous download of PDF
  var loadingTask = pdfjsLib.getDocument({data: blob});

  loadingTask.promise.then(
    function(pdf) {
      console.info("PDF loaded");
      // Start rendering...
      pdf.getPage(1).then(function(page) {
        handlePages(page, iframe);
      });
    },
    function(reason) {
      // PDF loading error
      console.error(reason);
    }
  );
});
