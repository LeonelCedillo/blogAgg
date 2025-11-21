import { readConfig } from "../config";
import { getUser } from "src/lib/db/queries/users";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feed_follows";


export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed url>`);
    }

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feedURL = args[0];
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed not found: ${feedURL}`);
    }

    const newFeedFollow = await createFeedFollow(user.id, feed.id);
    if (!newFeedFollow) {
        throw new Error(`Failed to create Feed-Follow`);
    }
    console.log("Feed follow created:");
    printFeedFollow(user.name, feed.name);
}


function printFeedFollow(username: string, feedname: string) {
    console.log(`* User:          ${username}`);
    console.log(`* Feed:          ${feedname}`);
}


export async function handlerListFeedFollows(_: string) {
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feedFollows = await getFeedFollowsForUser(user.id);
    if (feedFollows.length === 0) {
        console.log("No feed follows found for this user");
        return;
    }

    console.log(`Feed follows for user ${user.id}:`);
    for (const ff of feedFollows) {
        console.log(`Feed Name: ${ff.feedName}`); 
    }
}