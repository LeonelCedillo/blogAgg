import { User } from "src/lib/db/schema";
import { getPostsForUser } from "src/lib/db/queries/posts";


export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    if (args.length > 1) {
        throw new Error(`usage: ${cmdName} <limit>`);
    }
    const input = parseInt(args[0], 10);
    const limit = Number.isNaN(input) ? 2 : input;
    const result = await getPostsForUser(user.id, limit);
    console.log(`Found ${result.length} posts for user ${user.name}:`);
    console.log();
    for (let post of result) {
        console.log(`${post.publishedAt} from ${post.feedName}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`=====================================`);
    }
    console.log()
}