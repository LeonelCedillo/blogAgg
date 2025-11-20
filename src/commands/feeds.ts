import { log } from "console";
import { readConfig } from "../config";
import { getUser, getUserById } from "src/lib/db/queries/users";
import type { Feed, User } from "src/lib/db/schema";
import { 
    createFeed, 
    createFeedFollow, 
    getFeeds, 
    getFeedByURL, 
    getFeedById,
    getFeedFollowsForUser,
} from "src/lib/db/queries/feeds";


export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <feed url>`);
    }

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error("Failed to create feed");
    }

    console.log("Feed created successfully:");
    printFeed(feed, user);

    const newFeedFollow = await createFeedFollow(user.id, feed.id);
    if (!newFeedFollow) {
        throw new Error(`newFeedFollow not found`);
    }
    console.log(`Feed Name: ${feed.name}`);
    console.log(`User Name: ${user.name}`);
    console.log("Feed-Follow:");
    console.log(newFeedFollow);
}


function printFeed(feed:Feed, user:User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}


export async function handlerListFeeds(_: string) {
    const feeds = await getFeeds();
    if (feeds.length === 0) {
        console.log(`No feeds found.`);
        return;
    }
    console.log(`Found %d feeds:\n`, feeds.length);
    for (const feed of feeds) {
        const user = await getUserById(feed.userId);
        if (!user) {
            throw new Error(`Failed to find user for feed ${feed.id}`);
        }
        printFeed(feed, user);
        console.log(`=====================================`);
    }
}


export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed url>`);
    }
    const url = args[0];

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feed = await getFeedByURL(url);
    if (!feed) {
        throw new Error(`Feed not found`);
    }

    const newFeedFollow = await createFeedFollow(user.id, feed.id);
    if (!newFeedFollow) {
        throw new Error(`newFeedFollow not found`);
    }
    console.log(`Feed Name: ${feed.name}`);
    console.log(`User Name: ${user.name}`);
    console.log("Feed-Follow:");
    console.log(newFeedFollow);

}


export async function handlerFeedFollowsForUser(_: string) {
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }
    console.log(`User Name: ${user.name}`);

    const feedFollows = await getFeedFollowsForUser(user.id);
    if (feedFollows.length === 0) {
        console.log(`No feeds found.`);
        return;
    }

    for (const feedFollow of feedFollows) {
        const feed = await getFeedById(feedFollow.feedId);
        console.log(`Feed Name: ${feed?.name}`); 
    }
}