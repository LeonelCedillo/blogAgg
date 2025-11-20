import { db } from "..";
import { feeds, feedFollows } from "../schema";
import { firstOrUndefined } from "./utils";
import { eq } from "drizzle-orm";

export async function createFeed(feedName: string, url: string, userId: string) {    
    const result = await db.insert(feeds)
        .values({ name: feedName, url, userId})
        .returning();
    return firstOrUndefined(result);
}


export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result
}


export async function createFeedFollow(userId:string, feedId: string) {
    const result = await db.insert(feedFollows)
        .values({ userId, feedId })
        .returning();
    return firstOrUndefined(result);
}


export async function getFeedByURL(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return firstOrUndefined(result);
}

export async function getFeedById(feedId: string) {
    const result = await db.select().from(feeds).where(eq(feeds.id, feedId));
    return firstOrUndefined(result);
}

export async function getFeedFollowsForUser (userId: string) {
    const result = await db.select().from(feedFollows).where(eq(feedFollows.userId, userId));
    return result;
}