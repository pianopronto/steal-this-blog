import * as consts from "@/consts";

import { getCollection as get, getEntry } from "astro:content";
import { slug as slugify } from "github-slugger";

/**
 * Returns collection entries for a given type
 * @param {string} type - The type of collection such as "blog"
 * @param {boolean} all - Include all posts including drafts and scheduled
 * @param {boolean} reverse - Sort with oldest posts first
 * @returns {Array<Object>}
 */
export const getCollection = async (type, all = true, reverse = false) => {
  const items = await get(type, (item) => {
    if (all && import.meta.env.MODE == "development") {
      return true; // Show all in dev mode
    }
    if (item.data.draft) {
      return false; // Draft post
    }
    if (item.data.pubDate && item.data.pubDate > new Date()) {
      return false; // Future post
    }
    return true;
  });
  if (type === "blog") {
    items.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    if (reverse) {
      items.reverse();
    }
    items.sort((a, b) => b.data.featured - a.data.featured);
  }
  return items;
};

/**
 * Returns collection entries matching a value for a given field
 * @param {string} type - The type of collection such as "blog"
 * @param {string} term - The field to search on such as "tags" or "author"
 * @param {string} value - The value to match such as "Popular"
 * @param {boolean} reverse - Sort with oldest posts first
 * @returns {Array<Object>}
 */
export const getCollectionFilter = async (
  type,
  term,
  value,
  reverse = false
) => {
  // Call our custom getCollection() function from src/content/utils.js
  const items = await getCollection(type, true, reverse);

  // Since value might be the human label, or from a URL, we will normalize it to a slug
  const slug = slugify(value);

  // Start filtering the content collection
  return items.filter((item) => {
    // See the comments in the getTaxonomy() function
    const values = [];
    if (Array.isArray(item.data[term])) {
      values.push(...item.data[term]);
    } else if (item.data[term]?.slug) {
      values.push(item.data[term].slug);
    }

    // Does this collection entry contain the value we're looking for?
    return values.map((value) => slugify(value)).includes(slug);
  });
};

/**
 * Returns all unique values from a collection for a given field
 * @param {string} type - The type of collection such as "blog"
 * @param {string} term - The field to get such as "tags" or "author"
 * @returns {Array<Object>}
 */
export const getTaxonomy = async (type, term) => {
  // Call our custom getCollection() function from src/content/utils.js
  const items = await getCollection(type);

  // Start reducing the array of blog posts into a Map where the value is the count
  const taxonomy = items.reduce((acc, item) => {
    // We want to support both array and reference fields, i.e. both:
    // tags: ["tag 1", "tag 2"]
    // author: "houston"
    // So we're going to convert either of those into an array of values
    const values = [];
    if (Array.isArray(item.data[term])) {
      values.push(...item.data[term]);
    } else if (item.data[term]?.slug) {
      values.push(item.data[term].slug);
    }

    // Loop through each value and increment the count by one
    for (let value of values) {
      const count = acc.get(value) || 0;
      acc.set(value, count + 1);
    }

    // Return our accumulator
    return acc;
  }, new Map());

  // On dev, make sure we have these tags even if there are no posts with them set
  // This is so if we go to /tags/drafts/ when there are no draft posts, we won't 404
  if (term === "tags" && import.meta.env.MODE == "development") {
    if (!taxonomy.has("Drafts")) {
      taxonomy.set("Drafts", 0);
    }
    if (!taxonomy.has("Scheduled")) {
      taxonomy.set("Scheduled", 0);
    }
  }

  // Convert the Map to an array of object and sort by count
  return Array.from(taxonomy, ([value, count]) => ({ value, count })).sort(
    (a, b) => b.count - a.count
  );
};

/**
 * Returns blog entries with similar tags to the given post
 * @param {Object} current - The blog entry we want to get similar posts to
 * @returns {Array<Object>}
 */
export const similarPosts = async (current) => {
  const posts = await getCollection("blog");
  const tags = current.data.tags ?? [];

  const { related, other } = posts.reduce(
    (acc, item) => {
      const isRelated =
        item.slug !== current.slug &&
        (item.data.tags ?? []).find((tag) => tags.includes(tag));

      acc[isRelated ? "related" : "other"].push(item);
      return acc;
    },
    {
      related: [],
      other: [],
    }
  );

  return [
    ...related
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value),
    ...other
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value),
  ].slice(0, 3);
};

export async function getAuthor(slug) {
  return getEntry("authors", slug);
}
