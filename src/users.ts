import { setUser } from "./config";
import { getUser } from "./lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const user = await getUser(userName);
    if (!user) {
        throw new Error(`User ${userName} does not exists.`)
    }
    setUser(userName);
    console.log("User switched successfully!");
}
