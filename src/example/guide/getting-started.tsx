export default function Page() {
	return (
		<div>
			<h1>Getting Started</h1>
			
			<p>VitePress is a <a href="https://vitejs.dev/">Vite</a> & <a href="https://vuejs.org/">Vue</a> powered static site generator.</p>

			<h2>Try It Online</h2>
			<p>You can try VitePress directly in your browser on <a href="https://stackblitz.com/fork/vitepress">StackBlitz</a>.</p>

			<h2>Installation</h2>

			<h3>Prerequisites</h3>
			<ul>
				<li><a href="https://nodejs.org/">Node.js</a> version 18 or higher.</li>
				<li>Terminal for accessing VitePress via its command line interface (CLI).</li>
				<li>Text Editor with <a href="https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin">Volar extension</a> support.</li>
			</ul>

			<p>VitePress can be used on its own, or be installed into an existing project. In both cases, you can install it with:</p>

			<div className="language-sh">
				<pre>
					<code>
						npm add -D vitepress
					</code>
				</pre>
			</div>

			<div className="language-sh">
				<pre>
					<code>
						pnpm add -D vitepress
					</code>
				</pre>
			</div>

			<div className="language-sh">
				<pre>
					<code>
						yarn add -D vitepress
					</code>
				</pre>
			</div>

			<div className="language-sh">
				<pre>
					<code>
						bun add -D vitepress
					</code>
				</pre>
			</div>

			<h3>Setup Wizard</h3>
			<p>VitePress ships with a command line setup wizard that will help you scaffold a basic project. After installation, start the wizard by running:</p>

			<div className="language-sh">
				<pre>
					<code>
						npx vitepress init
					</code>
				</pre>
			</div>

			<p>You will be greeted with a few simple questions:</p>

			<div className="language-text">
				<pre>
					<code>
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◆  Theme:
│  ● Default Theme (Out of the box, good-looking docs)
│  ○ Default Theme + Customization
│  ○ Custom Theme
└
					</code>
				</pre>
			</div>

			<h2>File Structure</h2>
			<p>If you chose to scaffold the VitePress project in the current directory, the file structure should look like this:</p>

			<div className="language-text">
				<pre>
					<code>
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
					</code>
				</pre>
			</div>

			<p>The <code>docs</code> directory is considered the <strong>project root</strong> of the VitePress site. The <code>.vitepress</code> directory is a reserved location for VitePress' config file, dev server cache, build output, and optional theme customization code.</p>

			<h3>The Config File</h3>
			<p>The config file (<code>.vitepress/config.js</code>) allows you to customize various aspects of your VitePress site, with the most basic options being the site title and description:</p>

			<div className="language-javascript">
				<pre>
					<code>
export default {`{
  title: 'VitePress',
  description: 'Just playing around.'
}`}
					</code>
				</pre>
			</div>

			<h2>Up and Running</h2>
			<p>The tool should have also injected the following npm scripts to your <code>package.json</code> if you allowed it to do so during the setup process:</p>

			<div className="language-json">
				<pre>
					<code>
{`{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  ...
}`}
					</code>
				</pre>
			</div>

			<p>The <code>docs:dev</code> script will start a local dev server with instant hot updates. Run it with the following command:</p>

			<div className="language-sh">
				<pre>
					<code>
						npm run docs:dev
					</code>
				</pre>
			</div>

			<p>Instead of npm scripts, you can also invoke VitePress directly with:</p>

			<div className="language-sh">
				<pre>
					<code>
						npx vitepress dev docs
					</code>
				</pre>
			</div>

			<h2>What's Next?</h2>
			<ul>
				<li>To better understand how the file structure maps to the generated routes, read about <a href="/guide/routing">Routing</a>.</li>
				<li>To discover more about what you can do on the page, such as writing markdown content or using Vue components, read about <a href="/guide/writing">Writing</a>. A great place to start would be to learn about <a href="/guide/markdown">Markdown Extensions</a>.</li>
				<li>To explore the features provided by the default documentation theme, check out the <a href="/reference/default-theme-config">Default Theme Config Reference</a>.</li>
				<li>If you want to further customize the appearance of your site, explore how to <a href="/guide/extending-default-theme">Extend the Default Theme</a> or <a href="/guide/custom-theme">Build a Custom Theme</a>.</li>
				<li>Once your documentation site starts to take shape, make sure to read the <a href="/guide/deploy">Deployment Guide</a>.</li>
			</ul>
		</div>
	);
}
