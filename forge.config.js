const { app } = require("firebase-admin");
const { format } = require("prettier");

/**
 * Configuration file for Electron Forge
 */
module.exports = {
  packagerConfig: {
    asar: true,
    icon: "assets/icons/icon",
    name: "omst_honeycomb_update",
    appBundleId: "com.uci.omst_honeycomb_update",
  },
  makers: [
    {
      // zip files
      name: "@electron-forge/maker-zip",
    },
    {
      // Linux Distribution
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "assets/icons/icon.png",
        },
      },
    },
    {
      // Mac Distribution
      name: "@electron-forge/maker-dmg",
      config: {
        options: {
          icon: "assets/icons/icon.icns",
        },
      },
    },
    {
      // Windows Distribution
      name: "@electron-forge/maker-squirrel",
      config: {
        iconUrl: "https://raw.githubusercontent.com/brown-ccv/honeycomb/main/assets/icons/icon.ico",
        setupIcon: "assets/icons/icon.ico",
      },
    },
  ],
  plugins: [{ name: "@electron-forge/plugin-auto-unpack-natives", config: {} }],
};
