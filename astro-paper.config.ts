import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    // ⚠️ 部署后的站点地址（用户站仓库名必须正好是 <用户名>.github.io）
    url: "https://sicnuyudidi.github.io/",
    // ⚠️ 改成你想要的名字：显示在页头、浏览器标签和 SEO meta 里
    title: "技术笔记",
    description: "记录 LLM 推理引擎、源码分析与工程实践。",
    author: "sicnuyudidi",
    profile: "https://github.com/sicnuyudidi",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 8,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    // 关闭动态 OG 图：它依赖 satori + 一份字体文件。
    // Google Sans Code 没有中文字形，中文标题会渲染成空白/方块；
    // 换中文字体则要自托管 10 MB+ 的文件。改用 public/default-og.jpg 静态图。
    // 想要中文动态 OG 图 → 见 README「字体与 OG 图」。
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/sicnuyudidi/sicnuyudidi.github.io/edit/main/",
    },
    search: "pagefind",
  },
  // Giscus 评论（基于 GitHub Discussions，零后端、无需自建 OAuth App）
  // repoId / categoryId 由 `gh api` 实测取得，不是抄来的
  comments: {
    provider: "giscus",
    giscus: {
      repo: "sicnuyudidi/sicnuyudidi.github.io",
      repoId: "R_kgDOVB3Oyw",
      category: "Announcements",
      categoryId: "DIC_kwDOVB3Oy84DHYnC",
      mapping: "pathname",
      strict: false,
      reactionsEnabled: true,
      inputPosition: "top",
      loading: "lazy",
    },
  },
  socials: [{ name: "github", url: "https://github.com/sicnuyudidi" }],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});