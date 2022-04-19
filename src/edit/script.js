/*---------
    MODULES
-----------*/

const { ipcRenderer } = require("electron");

/*-----------
    SELECTORS
-------------*/

const main = document.getElementById("main");

/*-----------
    FUNCTIONS
-------------*/

//* Pass selected data.

function getArticle(data) {
  ipcRenderer.invoke("article", data);
}

//* Create article elements.

ipcRenderer.on("articles", (e, data) => {
  for (let i = 0; i < data.length; i++) {
    let a = document.createElement("a");

    a.setAttribute("href", "../view-edit/index.html");
    a.classList.add(data[i]["_doc"]["slug"]);
    a.innerText = data[i]["_doc"]["title"];

    main.appendChild(a);
  }

  //* Call getArticle() with slug.

  for (let i = 0; i < main.childElementCount; i++) {
    main.children[i].addEventListener("click", (e) => {
      getArticle(e.target.classList[0]);
    });
  }
});
