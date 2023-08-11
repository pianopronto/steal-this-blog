import * as consts from "@/consts";

import { getCollection as get, getEntry } from "astro:content";
import { slug as slugify } from "github-slugger";

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

export const getCollectionFilter = async (
  type,
  term,
  value,
  reverse = false
) => {
  const items = await getCollection(type, true, reverse);
  const slug = slugify(value);
  return items.filter((item) => {
    const values = Array.isArray(item.data[term]) ? item.data[term] : [];
    return values.map((value) => slugify(value)).includes(slug);
  });
};

export const getTaxonomy = async (type, term) => {
  const items = await getCollection(type);
  const taxonomy = items.reduce((acc, item) => {
    const values = Array.isArray(item.data[term]) ? item.data[term] : [];
    for (let value of values) {
      const count = acc.get(value) || 0;
      acc.set(value, count + 1);
    }
    return acc;
  }, new Map());

  // On dev, make sure we have these tags even if there are no posts with them set
  if (term === "tags" && import.meta.env.MODE == "development") {
    if (!taxonomy.has("Drafts")) {
      taxonomy.set("Drafts", 0);
    }
    if (!taxonomy.has("Scheduled")) {
      taxonomy.set("Scheduled", 0);
    }
  }

  return Array.from(taxonomy, ([value, count]) => ({ value, count })).sort(
    (a, b) => b.count - a.count
  );
};

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

export async function getAuthor(name) {
  try {
    return await getEntry("authors", slugify(name));
  } catch {
    // Default author
    return await getEntry("authors", consts.DEFAULT_AUTHOR);
  }
}
