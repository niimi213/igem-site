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

### Using MediaWiki Templates for partial embedding

![](/assets/software/hexo-for-igem-1.png)

If you use general SSGs, common components such as navigation bar or footer are directly embedded to each page. Thus, if you modify the content of footer just a bit, for example, **you have to upload all pages again**. This is a very troublesome situation. Even if you use an automated upload system like iGEM WikiSync developed by iGEM BITS Goa and your trouble is solved, **iGEM server still gets many rewrite requests**, which may slow iGEM server's responses.

In contrast, **Hexo for iGEM is a very iGEM server-friendly system**. It does not embed common components to each page directly. Instead, it uses **MediaWiki Templates**. For example, if you want to add footer to each page, it does not embed its HTML code, but embeds `{{ Template:UTokyo/Footer }}` to the pages. Thus, it avoids repeating the same code in all pages. If you change the content of footer, all you have to do is update the template of footer.

We have developed this by rewriting Hexo's internal function. In fact, Hexo's themes internally use `_partial()` in order to embed some common components. Thus, we have changed this function to export MediaWiki Template Code when exporting to iGEM Wiki. For example, if the theme in Hexo internally calls `_partial('something')` in order to embed some common component, the rewritten `_partial()` function returns the text `{{ Template:TeamName/template/something }}`. Moreover, the system records what component is referenced in `_partial()` function and exports each recorded component to a template file.

### Deploying the site automatically with the power of iGEM-WikiSync

iGEM-WikiSync's ability is fantastic. It can upload files by launching a virtual browser inside the system. Moreover, it makes "upload map" in the folder and manages which files have been changed since the last upload. These features are very useful in developing iGEM Wikis. By using and partially modifying iGEM-WikiSync, we have developed the automated uploading system of Hexo-generated sites.

Originally iGEM-WikiSync does not support MediaWiki Templates, so we have developed this point. When html files are provided in `template/` folder in `src_dir`, they are uploaded to the directory under `Template:Team Name/template/`, not to `Team:Team Name/`. Thus, those files can be called in `{{ Template:Team Name/template/some-file }}` from the Wiki pages. In order to achieve this, we modified iGEM-WikiSync system to replace the URL in the upload map if the file is under `template/` folder.

Moreover, we have fixed internal HTML processing system in iGEM-WikiSync. iGEM-WikiSync seems to use HTML processing system in order to replace URL paths of assets. The URL replacing system is one of the great features of iGEM-WikiSync, but the internal HTML processing system does not interpret HTML files with MediaWiki syntax correctly. We have to write MediaWiki syntax outside `<html>` element, so if we want to embed MediaWiki Templates in a `<p>` element, for example, we have to write `<p></html>{{ SomeTemplate }}<html></p>`. HTML structure is broken in this expression, so we dealt with this problem in the following way.

1. Outputs MediaWiki Syntax without `</html>` and `<html>`. In the example above, `<p>{{ SomeTemplate }}</p>`
2. Passes over the output to the internal HTML parser in iGEM-WikiSync.
3. Replaces `{{` with `</html>{{`, and `}}` with `}}<html>`.
4. Then, correct expression for iGEM Wiki is generated. In the example above, `<p></html>{{ SomeTemplate }}<html></p>`.

### Providing the environment very similar with iGEM server for local testing

Sites which use Hexo is easily tested locally by the command `hexo server`. However, the environment of iGEM server is very complex and far from local testing environment. Thus, we have simulated the iGEM server environment locally.

If we call `hexo server` command with the argument of `--wiki`, codes used in iGEM server are inserted to the `<head>` and `<body>` tag.

We have achieved this by using [Hexo Injector](https://hexo.io/api/injector).
