// vite-plugin-inline-favicon.ts
import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

export interface InlineFaviconOptions {
  /** 要内联的图标文件路径，默认：process.cwd()/public/favicon.ico */
  input?: string
  /** Data URI 的 MIME 类型，默认：image/vnd.microsoft.icon */
  mimeType?: string
  /** 匹配 `<link>` 的正则，可按需调整 */
  tagPattern?: RegExp
}

export function inlineFaviconPlugin(
  options: InlineFaviconOptions = {}
): Plugin {
  const {
    input = path.resolve(process.cwd(), 'public/favicon.ico'),
    mimeType = 'image/vnd.microsoft.icon',
    tagPattern = /<link\s+rel=["']icon["'][^>]*>/i
  } = options

  let dataUri: string

  return {
    name: 'vite-plugin-inline-favicon',
    enforce: 'post',
    // 在 build 过程中首次调用时准备好 Data URI
    buildStart() {
      if (!fs.existsSync(input)) {
        this.error(`inline-favicon: 文件不存在：${input}`)
      }
      const buf = fs.readFileSync(input)
      dataUri = `data:${mimeType};base64,${buf.toString('base64')}`
    },
    // 替换 HTML 中的 <link rel="icon">
    transformIndexHtml(html) {
      return html.replace(
        tagPattern,
        `<link rel="icon" href="${dataUri}" />`
      )
    }
  }
}
