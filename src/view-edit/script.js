/*---------
    MODULES
-----------*/

const { ipcRenderer } = require("electron");
const marked = require("marked");
const mongoose = require("mongoose");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

/*--------
    IMPORTS
----------*/

const Article = require("../../model/article");

/*---------
    GLOBALS
-----------*/

mongoose.connect(process.env.MONGOOSE_URI);
let prevTitle;

/*-----------
    SELECTORS
-------------*/

const tbTitle = document.getElementById("tbTitle");
const inputTitle = document.getElementById("inputTitle");
const inputDescription = document.getElementById("inputDescription");
const inputContent = document.getElementById("inputContent");
const inputSave = document.getElementById("inputSave");
const outputTitle = document.getElementById("outputTitle");
const outputDescription = document.getElementById("outputDescription");
const outputContent = document.getElementById("outputContent");

/*-----------
    FUNCTIONS
-------------*/

//* Fetched data. --(line 64, main.js)--

ipcRenderer.on("selArticle", (e, data) => {
  prevTitle = data["_doc"]["title"];
  document.title = `${data["_doc"]["title"]} | Brooblog CMS`;
  tbTitle.innerText = `${data["_doc"]["title"]} | Brooblog CMS`;
  inputTitle.value = data["_doc"]["title"];
  inputDescription.value = data["_doc"]["description"];
  inputContent.innerHTML = data["_doc"]["content"];
  outputTitle.innerText = inputTitle.value;
  outputDescription.innerText = inputDescription.value;
  outputContent.innerHTML = marked.parse(inputContent.value);
});

//* Live markdown parse.

function update() {
  document.title = `${inputTitle.value} | Brooblog CMS`;
  tbTitle.innerText = `${inputTitle.value} | Brooblog CMS`;
  outputTitle.innerText = inputTitle.value;
  outputDescription.innerText = inputDescription.value;
  outputContent.innerHTML = marked.parse(inputContent.value);
}

//* Save article.

inputSave.addEventListener("click", async () => {
  const article = {
    $set: {
      title: inputTitle.value,
      description: inputDescription.value,
      content: inputContent.value,
      slug: slugify(inputTitle.value, { lower: true, strict: true }),
      sanitisedHTML: dompurify.sanitize(marked.parse(inputContent.value)),
    },
  };

  try {
    await Article.updateOne({ title: prevTitle }, article);
  } catch (e) {
    console.log(e);
  }
});
