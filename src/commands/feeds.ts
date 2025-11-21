import type { Feed, User } from "src/lib/db/schema";
import { getUserById } from "src/lib/db/queries/users";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";


export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <feed url>`);
    }
    const feedName = args[0];
    const url = args[1];
    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error("Failed to create feed");
    }
    console.log("Feed created successfully:");

    const feedFollow = await createFeedFollow(user.id, feed.id);
    if (!feedFollow) {
        throw new Error("Failed to create feed follow");
    }
    printFeed(feed, user);
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