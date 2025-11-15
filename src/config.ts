import fs from "fs"; // fs is the file system module, which allows you to read and write files.
import os from "os"; // os provides operating system-related utility methods.
import path from "path"; // path provides utilities for working with file and directory paths.

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(userName: string) {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
}

function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    rawConfig.current_user_name &&
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }
  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name || "",
  };
  return config;
}

export function readConfig() {
  const fullPath = getConfigFilePath();
  const data = fs.readFileSync(fullPath, "utf-8");
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

function getConfigFilePath() {
  const configFileName = ".gatorconfig.json";
  const homeDir = os.homedir();
  return path.join(homeDir, configFileName);
}

function writeConfig(config: Config) {
  const fullPath = getConfigFilePath();
  const rawConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };
  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
}
