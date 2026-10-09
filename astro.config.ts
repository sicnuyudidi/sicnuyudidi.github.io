import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    // ⚠️ locale 大小写敏感：必须与 astro-paper.config.ts 里的 site.lang 完全一致，
    // 否则 getRelativeLocaleUrl 会抛 MissingLocale（zh-CN ≠ zh-cn）。
    // 对应翻译文件：src/i18n/lang/zh-CN.ts
    locales: ["zh-CN"],
    defaultLocale: "zh-CN",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        // 中文站用「## 目录」触发折叠目录；原模板是 "Table of contents"
        [remarkCollapse, { test: "目录" }],
      ],
      rehypePlugins: [rehypeCallouts],
      // ⚠️ 中文站必设 false。
      // Astro 7 里 smartypants 默认 true，会把中文直角引号「」、破折号 —— 等
      // 错误转换成英文花引号/短横线，导致全站标点错乱。
      // 注意 Astro 7 已弃用顶层 markdown.smartypants，必须写进 unified() 里。
      smartypants: false,
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
