/*---------
    MODULES
-----------*/

const marked = require("marked");
const mongoose = require("mongoose");

/*--------
    IMPORTS
----------*/

const Article = require("../../model/article");

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

/*---------
    GLOBALS
-----------*/

mongoose.connect(process.env.MONGOOSE_URI);

/*-----------
    FUNCTIONS
-------------*/

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
  let article = new Article({
    title: inputTitle.value,
    description: inputDescription.value,
    content: inputContent.value,
  });

  try {
    article = await article.save();
  } catch (e) {
    console.log(e);
  }
});
