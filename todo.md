# step 1

start with basic visual to match vitepress style.
no md, mdx support yet. just write react component.

- src/examples as demo. roughly corresponds to content of vitepress doc e.g.
  - https://vitepress.dev/guide/getting-started
  - (vitepress-repo)/docs/en/guide/getting-started.md
  - src/examples/getting-started.tsx
- porting
  - (vitepress-repo)/src/client/theme-default/components -> src/components
  - (vitepress-repo)/src/client/theme-default/styles -> src/styles

# step 2 

- setup mdx compiler to support mdx authoring
- custom mdx transformation https://vitepress.dev/guide/markdown
  - frontmatter
  - code-group
  - tip
  - code block with syntax highlighting
  - snippet
- we can copy rspress's plugins
  - https://github.com/web-infra-dev/rspress/tree/main/packages/core/src/node/mdx

# step 3 (MVP)

- basic routing
- ssg
- packaging

# step 4

- configuration, plugin system
- more comphrensive port
