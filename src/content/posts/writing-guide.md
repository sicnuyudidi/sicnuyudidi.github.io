---
title: 怎么写一篇文章
author: sicnuyudidi
pubDatetime: 2026-10-09T09:30:00+08:00
featured: false
draft: false
tags:
  - 建站
  - 指南
description: 本站的写作速查：文件放哪、frontmatter 怎么填、支持哪些 Markdown 语法。
---

这篇是给自己看的写作速查，省得每次发文都翻配置。

## 目录

## 文件放哪

在 `src/content/posts/` 下新建 `.md` 或 `.mdx` 文件即可。**文件名就是 URL 的 slug**：

```text
src/content/posts/llm-memory-budget.md
  → https://sicnuyudidi.github.io/posts/llm-memory-budget/
```

建议文件名用**英文加连字符**——中文文件名也能用，但 URL 里会出现百分号编码，不好看也不好分享。

## frontmatter 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 文章标题 |
| `description` | ✅ | 摘要，用于列表页和 SEO meta |
| `pubDatetime` | ✅ | 发布时间，**必须带时区**，如 `2026-10-09T12:00:00+08:00` |
| `modDatetime` | | 修改时间，填了会在文章页显示「更新于」 |
| `tags` | | 标签数组，不填默认 `["others"]` |
| `featured` | | `true` 会出现在首页精选区 |
| `draft` | | `true` 则不出现在列表、标签页和 RSS |
| `author` | | 默认取站点配置里的作者名 |
| `hideEditPost` | | `true` 则隐藏「编辑此页」链接 |

一个最小可用的例子：

```yaml
---
title: 文章标题
pubDatetime: 2026-10-09T12:00:00+08:00
description: 一句话摘要
tags:
  - 标签一
  - 标签二
---
```

## 支持的语法

### 表格

就是上面那种，用管道符和短横线。

### 代码块带高亮标注

支持用注释语法标注增删和重点行：

```python{1,3-4}
# 这一行会被高亮
def f(x):
    # 这两行也会
    y = x * 2
    return y
```

### 提示块（callout）

```md
> [!NOTE]
> 这是一条普通提示。

> [!WARNING]
> 这是一条警告。
```

渲染效果：

> [!NOTE]
> 这是一条普通提示。适合放「补充说明」这类不打断阅读的内容。

> [!WARNING]
> 这是一条警告。适合放「这里很容易踩坑」这类内容。

### 引用与行内标记

> 引用块适合放原文摘录。写技术文章时，引用源码注释或官方文档原文，比转述更可靠。

行内可以用 `代码`、**加粗**、*斜体*、[链接](https://astro.build/)。

### 数学公式

Astro Paper 支持 LaTeX，用 `$...$` 写行内公式，用 `$$...$$` 写块级公式。

## 本地预览

```bash
npm run dev      # 起本地服务，保存自动刷新
npm run build    # 本地跑一次完整构建，能提前发现错误
```

## 发布

推送到 `main` 分支即可，GitHub Actions 会自动构建并部署：

```bash
git add .
git commit -m "post: 新文章"
git push
```

## 两个会「静默丢文章」的坑

### 坑一：`pubDatetime` 写在未来，文章会凭空消失

Astro Paper 有个 `scheduledPostMargin`（本站是 **15 分钟**）。规则是：

| `pubDatetime` 相对当前时间 | 结果 |
| --- | --- |
| 过去 | 正常发布 |
| 未来 15 分钟以内 | 视为已发布 |
| **未来超过 15 分钟** | **静默隐藏**——不出现在列表、标签页、RSS 和搜索结果里 |

**没有报错，没有警告，文章就是不出现。** 我搭站时就踩了：一篇文章写 `12:30`，构建时是 `11:47`，差了 43 分钟，直接被丢掉。

所以：**写发布时间时，确保它不晚于「现在 + 15 分钟」。** 如果确实想定时发布，把它当特性用——但要知道这是它生效的机制。

### 坑二：`draft: true` 是全局隐藏

`draft: true` 的文章同样不出现在列表、标签页和 RSS 里，但**本地 `npm run dev` 能看到**。所以本地预览正常不代表线上有——发布前搜一下有没有漏掉的 `draft: true`。

## 一句话总结

**写文章只有三步：建文件、填 frontmatter、push。** 其余交给 Actions。但 frontmatter 里 `pubDatetime` 和 `draft` 这两个字段会**静默**决定文章出不出现，值得多看一眼。