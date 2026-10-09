---
title: 开站：这个博客是怎么搭起来的
author: sicnuyudidi
pubDatetime: 2026-10-09T09:00:00+08:00
featured: true
draft: false
tags:
  - 建站
  - astro
  - github-pages
description: 从零搭一个支持评论的中文技术博客——技术选型、为什么是这套组合、以及踩过的坑。
---

这是本站的第一篇文章，顺手把「这个博客是怎么搭的」记下来，也当作一次 Markdown 排版自检。

## 目录

## 为什么自己搭

放在别人的平台上，内容和读者都不属于你。自建博客的核心价值不是「显得专业」，而是**你拥有内容和数据**——想导出、想迁移、想改样式，都不用求人。

## 技术选型

本站用的是 **Astro + Astro Paper + Giscus**，托管在 GitHub Pages 上。三件套各自的理由：

| 组件 | 选择 | 理由 |
| --- | --- | --- |
| 静态生成器 | Astro 7 | 默认零 JS，Lighthouse 分高，能直接写 React 组件 |
| 主题 | Astro Paper | 极简、SEO 友好、自带深色模式和静态搜索 |
| 评论 | Giscus | 零后端、不需要自建 OAuth App、数据存在自己的仓库里 |
| 托管 | GitHub Pages | 免费、自带 HTTPS、推送即部署 |

### 为什么评论不用 Gitalk

Gitalk 并没有停止维护，但它有两个真实的摩擦点：

1. 需要你自己去 GitHub 建一个 OAuth App，并把 `clientSecret` 写进**前端 JS**——虽然 GitHub 的隐式流设计让这不算严重漏洞，但这是多余且反直觉的配置面；
2. 它用 Issues 存评论。Issue 的语义是「待办/缺陷」，评论区该用 Discussions。

Giscus 用的是 Discussions，天生支持楼中楼和反应表情，而且**不需要你建任何 OAuth App**——它用的是官方托管的 giscus App。

代价是：评论者需要有 GitHub 账号。对技术博客来说，这通常不是问题。

## 踩过的坑

### 中文标点被吃掉

Astro 7 里 `smartypants` **默认是 `true`**，它会把中文的直角引号「」和破折号 —— 错误转换成英文花引号。而且 Astro 7 已经弃用了顶层的 `markdown.smartypants`，必须写进 `markdown.processor` 的 `unified()` 里才生效：

```ts
// astro.config.ts
markdown: {
  processor: unified({
    remarkPlugins: [remarkToc],
    // ⚠️ 中文站必设 false
    smartypants: false,
  }),
}
```

**你现在看到的这句话里的「直角引号」和 —— 破折号，就是修复生效的证据。** 如果没修，它们会变成英文引号和短横线。

### 仓库名不能随便取

GitHub Pages 的**用户站**要求仓库名**必须恰好是 `<用户名>.github.io`**，这是保留规则，改不了。项目站（`<用户名>.github.io/项目名`）才能随便命名。

### 免费账号只能用公开仓库

免费版的 Pages 只能从 **public** 仓库发布；私有仓库要发 Pages 得升级 Pro。

## 代码块长什么样

```python
def profile_run(self) -> None:
    """跑一次最大 batch 的假前向，实测激活峰值。"""
    hidden_states, last_hidden_states = self._dummy_run(
        self.max_num_tokens, is_profile=True
    )
    # max_num_tokens == scheduler_config.max_num_batched_tokens
```

## 接下来写什么

计划是 LLM 推理引擎相关的源码拆解和工程实践——显存预算、KV cache、调度、性能调优这些。

## 一句话总结

自建博客的技术门槛已经很低了：**Astro Paper 负责好看，GitHub Actions 负责部署，Giscus 负责评论**，你只需要负责写。