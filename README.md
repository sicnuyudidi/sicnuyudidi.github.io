# sicnuyudidi.github.io

个人技术博客源码。基于 [Astro](https://astro.build/) + [Astro Paper](https://github.com/satnaing/astro-paper) 主题，部署在 GitHub Pages，评论用 [Giscus](https://giscus.app/)（GitHub Discussions）。

- 线上地址：<https://sicnuyudidi.github.io/>
- 本仓库既是源码仓也是部署仓（用户站仓库名必须是 `<用户名>.github.io`，这是 GitHub 的保留规则）

## 写一篇文章

1. 在 `src/content/posts/` 下新建 `.md` 文件，**文件名就是 URL 的 slug**（建议英文加连字符）
2. 填 frontmatter，然后 push

```yaml
---
title: 文章标题
pubDatetime: 2026-10-09T09:00:00+08:00   # 必须带时区
description: 一句话摘要
tags:
  - 标签一
featured: false   # true 会出现在首页精选区
draft: false      # true 则全局隐藏
---
```

推送到 `main` 后，GitHub Actions 自动构建并部署，约 1-2 分钟上线。

### ⚠️ 两个会静默丢文章的字段

| 字段 | 陷阱 |
| --- | --- |
| `pubDatetime` | 未来超过 `scheduledPostMargin`（本站 15 分钟）会被**静默隐藏**，无报错。确保它不晚于「现在 + 15 分钟」 |
| `draft` | `true` 时本地 `npm run dev` 看得到，但线上、标签页、RSS、搜索里都没有 |

## 本地开发

```bash
npm install
npm run dev      # 本地预览，保存自动刷新
npm run build    # 完整构建（含 astro check + pagefind 索引），能提前发现错误
npm run preview  # 预览构建产物
```

需要 Node >= 22.12.0。

## 评论（Giscus）

评论数据存在本仓库的 **GitHub Discussions** 里，零后端。

当前配置（`astro-paper.config.ts`）：

| 字段 | 值 | 来源 |
| --- | --- | --- |
| `repo` | `sicnuyudidi/sicnuyudidi.github.io` | — |
| `repoId` | `R_kgDOVB3Oyw` | `gh api repos/sicnuyudidi/sicnuyudidi.github.io --jq .node_id` |
| `category` | `Announcements` | 必须是 Announcements 类型 |
| `categoryId` | `DIC_kwDOVB3Oy84DHYnC` | GraphQL `discussionCategories` 查询 |

### ⚠️ 还需要做一步：安装 giscus App

**配置已经写好，但评论区要真正能用，必须把 giscus App 装到这个仓库上**（GitHub App 授权只能人工点一次）：

👉 <https://github.com/apps/giscus/installations/new>

在那页面选 **Only select repositories → sicnuyudidi.github.io**，点 Install。

**没装之前的表现**：评论区位置是空白的，浏览器控制台会报错。装上之后无需改代码，刷新即可。

### 评论框语言

已在组件里写死 `data-lang="zh-CN"`（`src/components/Comments.astro`）。

## 字体与 OG 图（为什么关掉了动态 OG 图）

Astro Paper 原模板用 Google Fonts 的 **Google Sans Code**，本站已移除，改为**纯系统字体栈**：

```css
/* src/styles/theme.css */
--font-app-stack:
  -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
  "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC",
  "Source Han Sans SC", sans-serif;
```

三个理由：

1. **Google Fonts 在中国大陆不可达**——站点字体加载会失败，读者只能看回退字体；
2. **Google Sans Code 没有中文字形**——中文站用它必然回退，等于白加载；
3. **中文字体文件动辄 10 MB+**——自托管的加载成本远高于收益。

同时 `features.dynamicOgImage` 设为 `false`，社交分享图改用静态的 `public/default-og.jpg`。

**为什么关动态 OG 图**：它用 satori 把标题渲染成 PNG，需要一份字体文件。用 Google Sans Code → 中文标题渲染成方块；换中文字体 → 要么自托管 10 MB+ 文件，要么构建时下载。对个人博客来说不值得。

**如果你想要中文动态 OG 图**：把 `dynamicOgImage` 改回 `true`，在 `astro.config.ts` 用 `fontProviders.local()` 指向仓库内的一份中文字体文件，并同步改 `src/pages/og.png.ts` 与 `src/pages/posts/[...slug]/index.png.ts` 里的 `fontData` 键名。

## 目录结构（改动过的地方）

```text
astro-paper.config.ts         # 站点配置：标题/作者/时区/评论/社交链接
astro.config.ts               # Astro 配置：i18n locale、smartypants、markdown 插件
src/i18n/lang/zh-CN.ts        # 中文 UI 文案（自动被 import.meta.glob 加载）
src/components/Comments.astro # Giscus 评论组件（原模板没有，新增）
src/styles/theme.css          # 字体栈 + 配色 token
src/content/posts/            # 文章
src/content/pages/about.md    # 关于页
.github/workflows/deploy.yml  # Pages 部署流水线
```

## 三个踩过的坑（供以后参考）

### 1. `smartypants` 会把中文标点吃掉

Astro 7 里 `smartypants` **默认 `true`**，会把中文的直角引号「」和破折号 —— 转成英文花引号/短横线。而且 Astro 7 **已弃用顶层的 `markdown.smartypants`**，必须写进 `markdown.processor` 的 `unified()` 里：

```ts
markdown: {
  processor: unified({
    remarkPlugins: [remarkToc],
    smartypants: false,   // ← 中文站必设
  }),
}
```

### 2. i18n locale 大小写敏感

`site.lang` 是 `zh-CN`，`i18n.locales` 就必须是 `["zh-CN"]`。写成 `zh-cn` 会在构建 RSS 时抛 `MissingLocale`。翻译文件名也要匹配：`src/i18n/lang/zh-CN.ts`。

### 3. GitHub Pages 免费版只能用公开仓库

免费账号的 Pages 只能从 **public** 仓库发布；私有仓库要发 Pages 需要 Pro。仓库名也必须恰好是 `<用户名>.github.io`。

## 许可

文章内容版权归作者所有。主题 [Astro Paper](https://github.com/satnaing/astro-paper) 按 MIT 协议使用。