# Test

## Component

<components.TestBuiltin test="ok" />

<components.CodeGroup blocks={{ npm: "foo", pnpm: "bar" }}>

```sh [npm]
$ npm add -D vitepress
```

```sh [pnpm]
$ pnpm add -D vitepress
```

</components.CodeGroup>

## Code group

:::code-group

```sh [npm]
$ npm add -D vitepress
```

```sh [pnpm]
$ pnpm add -D vitepress
```

```sh [yarn]
$ yarn add -D vitepress
```

:::

## Snippet

::snippet[/snippets/test.ts]

## Custom container

:::tip
This is a tip.
:::

:::tip[Custom title]
This is a tip with a custom title.
:::

:::danger
This is a danger.
:::

## GitHub-flavored Alerts

> [!IMPORTANT]
> This is a note.
