import * as consts from "@/consts";

import { getCollection } from "@/content/utils";

import rss from "@astrojs/rss";

export async function get(context) {
  const posts = await getCollection("blog");
  return rss({
    title: consts.SITE_TITLE,
    description: consts.SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${post.slug}/`,
    })),
  });
}
