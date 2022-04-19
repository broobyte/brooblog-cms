/*---------
    MODULES
-----------*/

const { ipcRenderer } = require("electron");
const mongoose = require("mongoose");

/*--------
    IMPORTS
----------*/

const Article = require("../../model/article");

/*-----------
    SELECTORS
-------------*/

const main = document.getElementById("main");

/*---------
    GLOBALS
-----------*/

mongoose.connect(process.env.MONGOOSE_URI);

/*-----------
    FUNCTIONS
-------------*/

//* Create article elements.

ipcRenderer.on("articles", (e, data) => {
  for (let i = 0; i < data.length; i++) {
    let div = document.createElement("div");

    div.classList.add(data[i]["_doc"]["slug"]);
    div.innerText = data[i]["_doc"]["title"];

    div.addEventListener("click", async (e) => {
      await Article.findOneAndRemove({ title: e.target.innerText });
    });

    main.appendChild(div);
  }
});
