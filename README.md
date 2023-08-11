# Astro Starter Kit: Steal This Blog!

Files from the [Steal This Blog](https://blog.pianopronto.com/steal-this-blog-part-1) series of articles.

![screenshot](https://raw.githubusercontent.com/pianopronto/steal-this-blog/master/src/assets/demo/screenshot.png)

## Getting Started

```
git clone https://github.com/pianopronto/steal-this-blog
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/pianopronto/steal-this-blog)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/pianopronto/steal-this-blog)

Features:

- ✅ Based on the Casper theme for Ghost
- ✅ Browse by tags, author, and any other attributes you define
- ✅ Support for drafts and scheduled posts
- ✅ Helpful content collection functions and prebuild components
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── css/
│   ├── js/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `src/assets/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out the [official documentation](https://docs.astro.build) or jump into the [Discord server](https://astro.build/chat).

## Credit

This project is based off of the [official blog starter kit](https://github.com/withastro/astro/tree/main/examples/blog).
