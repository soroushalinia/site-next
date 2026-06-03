---
title: Hello World
description: A first post that showcases everything this blog can render — headings, code blocks, blockquotes, lists, and footnotes.
date: 2026-06-02
tags: [Meta, Demo]
---

# Hello World

Welcome! This post exists to show off what the blog can do. [^1]

## Headings and Table of Contents

Every `h1`–`h3` heading on the page is collected into the table of contents
above, complete with numbering. Try clicking an entry to jump to its section.

### A Nested Heading

Third-level headings nest under their parent in the contents list.

## Code Blocks

Fenced code blocks are syntax highlighted, and the language is shown as a label
in the corner.

```bash
npm install
npm run dev
```

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

You can also drop in plain inline code like `const x = 42` mid-sentence.

## Quotes and Lists

> A blockquote is great for highlighting an idea or a quotation.

Ordered and unordered lists both work:

- Markdown formatting
- Code highlighting
- Footnotes [^2]

1. Write a post in Markdown
2. Add some frontmatter
3. Publish

## Math and LaTeX Support

Inline math uses single dollar signs: $O(n \log n)$.

$$O(n^2)$$

Big O notation is used to classify algorithms by how their run time or space
requirements grow as the input size grows.

| Complexity | Name |
|---|---|
| $O(1)$ | Constant |
| $O(\log n)$ | Logarithmic |
| $O(n)$ | Linear |
| $O(n \log n)$ | Linearithmic |
| $O(n^2)$ | Quadratic |
| $O(2^n)$ | Exponential |
| $O(n!)$ | Factorial |

## Equations Related to Software

Binary search complexity:

$$T(n) = O(\log n)$$

Merge sort recurrence:

$$T(n) = 2T\!\left(\frac{n}{2}\right) + O(n)$$

Shannon entropy — a measure of information content in data:

$$H(X) = -\sum_{i=1}^{n} P(x_i) \log_2 P(x_i)$$

Amdahl's law — the theoretical speedup of a parallel program:

$$S = \frac{1}{(1 - p) + \frac{p}{s}}$$

where $p$ is the parallelisable fraction and $s$ is the number of processors.

Euclidean distance between two feature vectors:

$$d(\mathbf{a}, \mathbf{b}) = \sqrt{\sum_{i=1}^{n} (a_i - b_i)^2}$$

Precision and recall in information retrieval:

$$P = \frac{TP}{TP + FP}, \qquad R = \frac{TP}{TP + FN}$$

## Wrapping Up

That's the tour. Replace this post with your own writing whenever you're ready.

[^1]: Footnotes are rendered at the bottom and linked both ways.
[^2]: This blog even localizes footnote numbers for right-to-left languages.
