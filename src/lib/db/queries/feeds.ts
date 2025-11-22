import { db } from "..";
import { eq, sql } from "drizzle-orm";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(feedName: string, url: string, userId: string) {    
    const result = await db
        .insert(feeds)
        .values({ name: feedName, url, userId})
        .returning();
    return firstOrUndefined(result);
}


export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result
}


export async function getFeedByURL(url: string) {
    const result = await db
        .select()
        .from(feeds)
        .where(
            eq(feeds.url, url)
        );
    return firstOrUndefined(result);
}


export async function markFeedFetched(feedId: string) {
    const date = new Date();
    const result = await db
        .update(feeds)
        .set({lastFetchedAt: date, updatedAt: date})
        .where(
            eq(feeds.id, feedId)
        )
        .returning();
    return firstOrUndefined(result);
}


export async function getNextFeedToFetch() {
    const result = await db
        .select()
        .from(feeds)
        .orderBy(sql` ${feeds.lastFetchedAt} ASC NULLS FIRST`)
        .limit(1)
    return firstOrUndefined(result);
}