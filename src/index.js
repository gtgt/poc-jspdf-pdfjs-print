import "./styles.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { headRows, bodyRows } from "./helpers";

var handlePages = (page, iframe, button) => {
  var pdf = page._transport,
    currPage = page._pageIndex + 1;
  console.info("Page ", currPage, "loaded.", pdf);

  //This gives us the page's dimensions at 150% scale
  var viewport = page.getViewport({ scale: 1.5 });

  //We'll create a canvas for each page to draw it on
  var canvas = iframe.contentDocument.createElement("canvas");
  iframe.contentDocument.body.appendChild(canvas);
  canvas.style.display = "block";
  var context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  //Draw it on the canvas
  var renderTask = page.render({ canvasContext: context, viewport: viewport });
  renderTask.promise.then(() => {
    console.info("Page rendered");
    //Move to next page
    if (currPage < pdf._numPages) {
      pdf.getPage(currPage + 1).then((page) => {
        handlePages(page, iframe, button);
      });
    } else {
      console.info("All pages rendered, printing...");
      iframe.contentWindow.print();
      console.info("Printing done, cleaning up...");
      // cleanup iframe
      iframe.remove();
      button.disabled = false;
    }
  });
};

document.getElementById("print").addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  var button = e.target,
    iframe = document.createElement("iframe"),
    orientation = document.forms.print.elements.orientation.value;

  console.info("Orientation is:", orientation, "Building pdf...");
  button.disabled = true;
  // can't use display = none, it won't render...
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.position = "absolute";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  iframe.contentDocument.head.insertAdjacentHTML('beforeend', '<style type="text/css" media="print">@page { size: A4 ' + orientation + '; margin: 50mm 0mm;} body { writing-mode: tb-rl; } canvas { page-orientation: ' + orientation + '; }</style>');
  iframe.contentWindow.addEventListener("afterprint", (e) => {
    console.log("After print", e);
    return true;
  });

  // Loaded via <script> tag, create shortcut to access PDF.js exports. (GT: pffuuj)
  var pdfjsLib = window["pdfjs-dist/build/pdf"];
  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "//mozilla.github.io/pdf.js/build/pdf.worker.js";

  var doc = new jsPDF({orientation: orientation.substring(0, 1), format: "a4"});

  doc.text("Overflow 'ellipsize' with one column with long content", 14, 10);
  doc.autoTable({
    head: headRows(),
    body: bodyRows(10),
    startY: 15,
    // Default for all columns
    styles: { overflow: "ellipsize", cellWidth: "wrap" },
    // Override the default above for the text column
    columnStyles: { notes: { cellWidth: "auto" } },
  });
  doc.text(
    "Overflow 'linebreak' (default) with one column with long content",
    14,
    doc.lastAutoTable.finalY + 10
  );
  doc.autoTable({
    head: headRows(),
    body: bodyRows(4),
    startY: doc.lastAutoTable.finalY + 15,
    rowPageBreak: "avoid",
    bodyStyles: { valign: "top" },
  });
  doc.addPage();
  doc.text("Split columns across pages if not fit in a single page.", 14, 10);
  doc.autoTable({
    head: headRows(),
    body: bodyRows(15),
    startY: 15,
    cellWidth: "auto",
    // split overflowing columns into pages
    horizontalPageBreak: true,
  });
  var blob = doc.output("arraybuffer");

  // Asynchronous download of PDF
  var loadingTask = pdfjsLib.getDocument({ data: blob });

  loadingTask.promise.then(
    function (pdf) {
      console.info("PDF loaded");
      // Start rendering...
      pdf.getPage(1).then((page) => {
        handlePages(page, iframe, button);
      });
    },
    function (reason) {
      // PDF loading error
      console.error(reason);
    }
  );
});