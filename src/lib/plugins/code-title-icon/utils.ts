import { builtinIcons } from "./builtin";
import { encodeSvgForCss, getIconData, iconToHTML, iconToSVG } from "@iconify/utils";

export function getCodeTitleIconClass(s: string): string | undefined {
	const matched = matchIcon(s, builtinIcons);
	if (matched) {
		return "code-title-icon-" + s;
	}
}

function matchIcon(s: string, icons: Record<string, string>): string | undefined {
	return undefined
}

function getMatchedLabels(labels: Set<string>, icons: Record<string, string>) {
  const matched: Record<string, string[]> = {}
  const sortedKeys = Object.keys(icons).sort((a, b) => b.length - a.length)
  for (const label of labels) {
		const key = sortedKeys.find(k => label?.toLowerCase().includes(k))
		if (key) {
			matched[icons[key]] = (matched[icons[key]] || []).concat(label)
		}
  }
  return matched
}

async function generateIconCSS(matched: Record<string, string[]>) {
  const iconCSS = await Promise.all(Object.entries(matched).map(async ([icon, labels]) => {
    if (!icon) {
      return ''
    }

    const svg = await getSVG(icon)
    const selector = labels.map(label => `[data-title='${label}']::before`).join(',')
    return `
${selector} {
  content: '';
  --icon: url("data:image/svg+xml,${svg}");
}`
  }))

  return iconCSS.sort().join('')
}

async function getSVG(icon: string) {
  if (icon.startsWith('<svg')) {
    return encodeSvgForCss(icon)
  }

  if (/^https?:\/\//.test(icon)) {
    try {
      const raw = await fetch(icon)
      const iconContent = await raw.text()
      return encodeSvgForCss(iconContent)
    }
    catch {
      console.warn(`[vitepress-plugin-group-icons]: Failed to fetch icon: ${icon}`)
      return ''
    }
  }

  const [collection, iconName] = icon.split(':')
	if (collection === 'vscode-icons') {
		const { icons } = await import('@iconify-json/vscode-icons')
    const iconData = getIconData(icons, iconName)

    if (iconData) {
      const { attributes, body } = iconToSVG(iconData)
      const svg = iconToHTML(body, attributes)

      return encodeSvgForCss(svg)
    }

    return ''
  }
}
