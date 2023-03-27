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
    osxSign: {
      hardenedRuntime: false,
      gatekeeperAssess: false,
      identity: "Developer ID Application: me@louisgallet.fr (7629P8M3HR)",
    },
    osxNotarize: {
      appBundleId: "fr.louisgallet.bingaimac",

      tool: "notarytool",
      appleId: parsed.APPLE_ID,
      appleIdPassword: parsed.APPLE_PASSWORD,
      teamId: parsed.APPLE_TEAM_ID,
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
