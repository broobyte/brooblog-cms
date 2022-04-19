/*---------
    MODULES
-----------*/

const { app, BrowserWindow, ipcMain } = require("electron");
const mongoose = require("mongoose");

require("dotenv").config();

/*---------
    IMPORTS
-----------*/

const Article = require("./model/article");

/*---------
    GLOBALS
-----------*/

mongoose.connect(process.env.MONGOOSE_URI);

/*-----------
    FUNCTIONS
-------------*/

async function createWindow() {
  const articles = await Article.find();

  const win = new BrowserWindow({
    show: false,
    width: 1200,
    height: 900,
    minWidth: 1200,
    minHeight: 900,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#1f1f1f",
      symbolColor: "#cd5c5c",
    },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("./public/index.html");

  /*---------
    PROCESSES
  -----------*/

  //* Allow access to all articles across all webpages.

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("articles", articles);
  });

  //* Allow access to a specific article across all webpages.

  ipcMain.handle("article", async (e, data) => {
    const article = await Article.findOne({ slug: data });
    win.webContents.on("did-finish-load", () => {
      win.webContents.send("selArticle", article);
    });
    return article;
  });

  win.once("ready-to-show", () => {
    win.center();
    win.show();
  });
}

/*------------
    LIFECYCLES
--------------*/

//* Launch.

app.whenReady().then(() => {
  createWindow();
});

//* Quit.

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
