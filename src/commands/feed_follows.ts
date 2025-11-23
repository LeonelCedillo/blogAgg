import { User } from "src/lib/db/schema";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "src/lib/db/queries/feed_follows";


export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed url>`);
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


export async function handlerListFeedFollows(_: string, user: User) {
    const feedFollows = await getFeedFollowsForUser(user.id);
    if (feedFollows.length === 0) {
        console.log("No feed follows found for this user");
        return;
    }
    console.log(`Feed follows for user ${user.name}:`);
    for (const ff of feedFollows) {
        console.log(`Feed Name: ${ff.feedName}`); 
    }
}


function printFeedFollow(username: string, feedname: string) {
    console.log(`* User:          ${username}`);
    console.log(`* Feed:          ${feedname}`);
}


export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed url>`);
    }
    const feedURL = args[0];
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed not found: ${feedURL}`);
    }
    const result = await deleteFeedFollow(user.id, feed.id);
    if (!result) {
        throw new Error(`Failed to unfollow feed: ${feedURL}`);
    }
    console.log(`${feed.name} unfollowed succesfully!`);
}