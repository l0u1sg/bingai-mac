require("update-electron-app")();
const AutoLaunch = require("auto-launch");

const { menubar } = require("menubar");
const Nucleus = require("nucleus-analytics");

const path = require("path");
const {
  app,
  nativeImage,
  Tray,
  Menu,
  globalShortcut,
  shell,
  session,
} = require("electron");
const contextMenu = require("electron-context-menu");
const filter = {
  urls: [
    "https://*.bing.com/*",
    "https://*.microsoft.com/*",
  ],
}



const image = nativeImage.createFromPath(
  path.join(__dirname, `images/icon-toolbar@2x.png`)
);

app.on("ready", () => {
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51"
    callback({ requestHeaders: details.requestHeaders })
})
  Nucleus.init("638d9ccf4a5ed2dae43ce122");

  // Launch on startup
  const autoLauncher = new AutoLaunch({
    name: "BingAI",
  });
  autoLauncher.isEnabled().then((isEnabled) => {
    if (!isEnabled) {
      autoLauncher.enable();
    }
  });
  const tray = new Tray(image);

  const mb = menubar({
    browserWindow: {
      icon: image,
      transparent: path.join(__dirname, `images/iconApp.png`),
      webPreferences: {
        webviewTag: true,
        // nativeWindowOpen: true,
      },
      width: 450,
      height: 550,
    },
    tray,
    showOnAllWorkspaces: true,
    preloadWindow: true,
    showDockIcon: false,
    icon: image,
  });

  mb.on("ready", () => {
    const { window } = mb;


    if (process.platform !== "darwin") {
      window.setSkipTaskbar(true);
    } else {
      app.dock.hide();
    }

    const contextMenuTemplate = [
      // add links to github repo and vince's twitter
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit();
        },
      },
      {
        label: "Reload",
        accelerator: "Command+R",
        click: () => {
          window.reload();
        },
      },
      {
        label: "Open in browser",
        click: () => {
          shell.openExternal("https://edgeservices.bing.com/edgesvc/chat");
        },
      },
      {
        type: "separator",
      },
      {
        label: "View on GitHub",
        click: () => {
          shell.openExternal("https://github.com/l0u1sg/bingai-mac");
        },
      },
      {
        label: "Original author on Twitter",
        click: () => {
          shell.openExternal("https://twitter.com/vincelwt");
        },
      },
      {
        type: "separator",
      },
      {
        label: "Check for updates",
        click: () => {
          require("update-electron-app")(
            {
              repo: "l0u1sg/bingai-mac",
              updateInterval: "1 hour",
            },
          );
        },

      },
      {
        // show version and app name
        label: `BingAI v${app.getVersion()}`,
        enabled: false,
      }
    ];

    tray.on("right-click", () => {
      mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate));
    });

    tray.on("click", (e) => {
      //check if ctrl or meta key is pressed while clicking
      e.ctrlKey || e.metaKey
        ? mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate))
        : null;
    });
    const menu = new Menu();

    globalShortcut.register("CommandOrControl+Shift+g", () => {
      if (window.isVisible()) {
        mb.hideWindow();
      } else {
        mb.showWindow();
        if (process.platform == "darwin") {
          mb.app.show();
        }
        mb.app.focus();
      }
    });

    Menu.setApplicationMenu(menu);

    // open devtools
    // window.webContents.openDevTools();

    console.log("Menubar app is ready.");
  });

  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      // open link with external browser in webview
      contents.on("new-window", (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      });
      // set context menu in webview
      contextMenu({
        window: contents,
      });

      // we can't set the native app menu with "menubar" so need to manually register these events
      // register cmd+c/cmd+v events
      contents.on("before-input-event", (event, input) => {
        const { control, meta, key } = input;
        if (!control && !meta) return;
        if (key === "c") contents.copy();
        if (key === "v") contents.paste();
        if (key === "a") contents.selectAll();
        if (key === "z") contents.undo();
        if (key === "y") contents.redo();
        if (key === "q") app.quit();
        if (key === "r") contents.reload();
      });
    }
  });

  if (process.platform == "darwin") {
    // restore focus to previous app on hiding
    mb.on("after-hide", () => {
      mb.app.hide();
    });
  }

  // open links in new window
  // app.on("web-contents-created", (event, contents) => {
  //   contents.on("will-navigate", (event, navigationUrl) => {
  //     event.preventDefault();
  //     shell.openExternal(navigationUrl);
  //   });
  // });

  // prevent background flickering
  app.commandLine.appendSwitch(
    "disable-backgrounding-occluded-windows",
    "true"
  );
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
