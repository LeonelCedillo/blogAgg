import { error } from "console";
import { createUser } from "./lib/db/queries/users";
import { setUser } from "./config";


export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} was not created.`)
    }
    setUser(user.name)
    console.log(`The user ${user.name} was created successfully!`)
    console.log(`${user}`)
}