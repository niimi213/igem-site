---
title: Software
date: 2021-09-06 11:34:24
tags:
---

We have developed our original deployment system for iGEM Wiki, called **Hexo for iGEM**.

## What is Hexo?

[Hexo](https://hexo.io/) is one of famous static site generator(SSG)s. It allows us to write posts in Markdown format, choose cool themes and generate a site in one command `hexo generate`. There are some similar frameworks like Hexo, some of which you may know: Nuxt.js, Gatsby, Hugo, Pelican, and so on.

## The powerful features of Hexo for iGEM

Hexo for iGEM is a plugin for Hexo. It revises the generating system of Hexo in order to adjust the exported site to iGEM-server environment.

### Using MediaWiki Templates for partial embedding(ちょっと怪しい)

If you use general SSGs, common components such as navigation bar or footer are directly embedded to each page. Thus, if you modify the content of footer just a bit, for example, **you have to upload all pages again**. This is a very troublesome situation. Even if you use an automated upload system like iGEM WikiSync developed by iGEM BITS Goa and your trouble is solved, **iGEM server still gets many rewrite requests**, which may slow iGEM server's responses.

In contrast, **Hexo for iGEM is a very iGEM server-friendly system**. It does not embed common components to each page directly. Instead, it uses **MediaWiki Templates**. For example, if you want to add footer to each page, it does not embed its HTML code, but embeds `{{ Template:UTokyo/Footer }}` to the pages. Thus, it avoids repeating the same code in all pages. If you change the content of footer, all you have to do is update the template of footer.

In fact, Hexo's themes internally uses `_partial()` in order to embed some common components. Thus, we can easily adjust the exported site to iGEM server by replacing `_partial('something')` with `{{ something }}`.

### Providing the environment very similar with iGEM server for local testing. (まだ怪しい)

Sites which use Hexo is easily tested locally by the command `hexo server`. However, the environment of iGEM server is very complex and far from local testing environment. Thus, we have simulated the iGEM server environment locally. (Todo)

### Changing generated file structure to the one suitable for iGEM server

When you type `hexo generate`, Hexo exports the site. The exported file structure is convenient if you deploy the site to standard hosts like Netlify or GitHub Pages, but the file structure in iGEM server is different from them. Thus, Hexo for iGEM modifies the file structure after generating.

### Deploying the site automatically (powered by iGEM WikiSync)

```python
def hoge():
  print("hoge")
```
