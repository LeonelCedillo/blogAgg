import { setUser, readConfig } from "./config";

function main() {
  setUser("Jeff");
  const cfg = readConfig();
  console.log(cfg);
}

main();