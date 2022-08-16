# poc-jspdf-pdfjs-print

A Proof of Concept for printing table from data available on client side by a button click. First, a pdf is getting created using 
[pdfjs](http://raw.githack.com/MrRio/jsPDF/master/index.html) + [jspdf-autotable](https://simonbengtsson.github.io/jsPDF-AutoTable/), then
[pdf.js](https://mozilla.github.io/pdf.js/examples/) will render each pdf page into a HTML canvas. These canvas elements placed into a hidden iframe,
which will finally be printed. All of this is triggered by a single button.

## Online

[CodeSandbox project](https://codesandbox.io/p/github/gtgt/poc-jspdf-pdfjs-print/master)

## Local
### To run
1. Clone the project: `git clone https://github.com/gtgt/poc-jspdf-pdfjs-print.git`
2. Enter into working copy, then: `npm install`
3. Compile / run / watch the project by: `npm start`

### To build
1. Same as run, but
2. Build with: `npm build`. The result will be in `dist` folder.
