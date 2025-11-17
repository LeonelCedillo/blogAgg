import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const config = readConfig()

export default defineConfig({
  schema: "./src/lib/db/schema.ts", // path to schema
  out: "./src/lib/db/migrations", // path to generated files
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl, // the connection string
  },
});