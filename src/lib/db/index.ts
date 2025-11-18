import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { readConfig } from "../../config";

// Configure a db object that will be used to run queries against the database.

const config = readConfig();
export const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema });

