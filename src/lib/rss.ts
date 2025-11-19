import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};


export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    // The response object only contains the headers and metadata
    const res = await fetch(feedURL, {
        method: "GET",
        mode: "cors",
        headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml",
        },
    });
    if (!res.ok) {
        throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`)
    }

    // Parse the XML
    const xml = await res.text();
    const parser = new XMLParser();
    const jObj = parser.parse(xml);

    // Extract metadata
    const channel = jObj.rss?.channel;
    if (!channel || !channel.title || !channel.link 
        || !channel.description || !channel.item) {
        throw new Error("Failed to parse channel");
    }

    // Extract feed items
    const items: any[] = Array.isArray(channel.item) 
        ? channel.item 
        : [channel.item];

    const rssItems: RSSItem[] = [];

    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }
        rssItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        });        
    }

    const rss: RSSFeed = {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: rssItems,
        },
    };
    
    return rss;
}


