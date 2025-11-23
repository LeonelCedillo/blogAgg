import { fetchFeed } from "src/lib/rss";
import { markFeedFetched, getNextFeedToFetch } from "src/lib/db/queries/feeds";
import { parseDuration } from "src/lib/time";
import { createPost, getPostByURL } from "src/lib/db/queries/posts";
import { NewPost } from "src/lib/db/schema";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>`);
    }
    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg); // ms
    if (!timeBetweenRequests) {
        throw new Error(`invalid duration: ${timeArg} — use format 1h 30m 15s or 3500ms`);
    }
    console.log(`Collecting feeds every ${timeArg}...`);
    console.log();
    scrapeFeeds().catch(handleError);
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    // Use promise to keep the function from returning and index.ts calling process.exit(0)
    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => { // listen for the Ctrl+C signal
            console.log(" Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}


function handleError(err: unknown) {
    console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}


export async function scrapeFeeds(): Promise<void> {
    const feedToFetch = await getNextFeedToFetch();
    if (!feedToFetch) {
        console.log(`No feeds to fetch.`);
        return;
    }
    console.log(`Found a feed to fetch!`);
    await markFeedFetched(feedToFetch.id);
    const feedData = await fetchFeed(feedToFetch.url);
    console.log(`Feed ${feedToFetch.name} collected, ${feedData.channel.item.length} posts found:`);
    console.log();
    for (const item of feedData.channel.item) {
        const post = await getPostByURL(item.link)
        if (!post){
            const now = new Date();
            await createPost({
                url: item.link, 
                title: item.title, 
                feedId: feedToFetch.id,
                createdAt: now,
                updatedAt: now,
                description: item.description,
                publishedAt: new Date(item.pubDate),
            } satisfies NewPost);
        }
        // console.log(item.title);
    }
    console.log();
    console.log();
}