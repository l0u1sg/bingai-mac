const { parsed } = require("dotenv").config();
module.exports = {
  packagerConfig: {
    name: "BingAI",
    executableName: "BingAI",
    icon: "images/icon",
    appBundleId: "fr.louisgallet.bingaimac",
    extendInfo: {
      LSUIElement: "true",
    },
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      platforms: ["darwin", "win32", "linux"],
      config: {
        repository: {
          owner: "l0u1sg",
          name: "bingai-mac",
        },
        prerelease: false,
      },
    },
  ],

  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
