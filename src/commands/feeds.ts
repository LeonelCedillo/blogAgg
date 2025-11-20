import { readConfig } from "../config";
import { createFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import type { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`usage: ${cmdName} <feed name> <feed url>`);
    }

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`Current user not found`)
    }
    const userId = user.id;
    const feedName = args[0];
    const url = args[1];
    const feed = await createFeed(feedName, url, userId);
    printFeed(feed, user);
}


export async function printFeed(feed:Feed, user:User) {
    console.log(feed);
    console.log(user);
}