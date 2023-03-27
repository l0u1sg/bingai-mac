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
      config: {
        repository: {
          owner: "louisgallet",
          name: "bingai-mac",
        },
        prerelease: true,
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
