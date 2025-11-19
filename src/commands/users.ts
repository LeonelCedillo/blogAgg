import { setUser } from "../config";
import { createUser, getUser, getUsers} from "../lib/db/queries/users";
import { readConfig } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const user = await getUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`)
    }
    setUser(user.name);
    console.log("User switched successfully!");
}


export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length != 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} was not created.`)
    }
    setUser(user.name)
    console.log(`The user ${user.name} was created successfully!`)
}


export async function handlerUsers() {
    const users = await getUsers();
    const config = readConfig();
    const loggedInUser = config.currentUserName;
    for (const user of users) {
        if (user.name === loggedInUser) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    }
}

