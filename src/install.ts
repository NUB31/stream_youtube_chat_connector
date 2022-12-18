import defaultSettings from "./bundledAssets/settings.json";
import download from "download";
import fs from "fs-extra";

async function setup() {
  try {
    await resetSettings();
    await resetServer();
  } catch (err) {
    console.error("Something went wrong installing the application. ERROR:");
    throw err;
  }
}

async function resetSettings() {
  try {
    console.log("Resetting settings");
    await fs.remove("settings.json");
    await fs.writeFile(
      "settings.json",
      JSON.stringify(defaultSettings, null, 2)
    );
  } catch (err) {
    console.error("Something went wrong resetting the settings. ERROR:");
    throw err;
  }
}

async function resetServer() {
  try {
    console.log("Downloading main server file");
    await fs.remove("server.exe");
    // Install server.exe
  } catch (err) {
    console.error("Something went wrong the server file. ERROR:");
    throw err;
  }
}

setup();
