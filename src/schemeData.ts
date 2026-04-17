export type SchemeParam = {
  key: string
  label: string
  placeholder?: string
  defaultValue?: string
}

export type SchemeItem = {
  app: string
  scheme: string
  purpose: string
  example?: string
  template?: string
  params?: SchemeParam[]
}

export type SchemeGroup = {
  id: string
  title: string
  description: string
  items: SchemeItem[]
}

export const schemeMdPath = '/手机端常见URL_Scheme大全.md'

export const groupMeta: Record<string, Pick<SchemeGroup, 'title' | 'description'>> = {
  'system-common': {
    title: '通用（iOS & Android）',
    description: '来自文档：系统级 Scheme / 通用表格',
  },
  'system-ios': {
    title: 'iOS 专属',
    description: '来自文档：系统级 Scheme / iOS 专属表格与 App-Prefs 表格',
  },
  'system-android': {
    title: 'Android 专属',
    description: '来自文档：系统级 Scheme / Android 专属表格',
  },
  'china-social': { title: '社交通讯', description: '来自文档：国内 App Scheme / 社交通讯表格' },
  'china-pay': { title: '支付金融', description: '来自文档：国内 App Scheme / 支付金融表格' },
  'china-short-content': {
    title: '短视频 / 内容',
    description: '来自文档：国内 App Scheme / 短视频 / 内容表格',
  },
  'china-commerce': { title: '电商购物', description: '来自文档：国内 App Scheme / 电商购物表格' },
  'china-map': { title: '地图导航', description: '来自文档：国内 App Scheme / 地图导航表格' },
  'china-tools': {
    title: '工具 / 其他',
    description: '来自文档：国内 App Scheme / 工具 / 其他表格',
  },
  global: { title: '国外 App Scheme', description: '来自文档：国外 App Scheme 表格' },
  browser: { title: '浏览器 Scheme', description: '来自文档：浏览器 Scheme 表格' },
}

export const groupOrder: SchemeGroup['id'][] = [
  'system-common',
  'system-ios',
  'system-android',
  'china-social',
  'china-pay',
  'china-short-content',
  'china-commerce',
  'china-map',
  'china-tools',
  'global',
  'browser',
]

const cleanCell = (value: string) => {
  return value.trim().replace(/^`|`$/g, '').replace(/\\\|/g, '|')
}

const detectParamsAndTemplate = (
  rawExample: string,
): { template: string; params: SchemeParam[] } | undefined => {
  // Special-case: tel: always needs a phone parameter
  // Examples are often like `tel:10086` (no placeholder words to detect).
  if (rawExample.startsWith('tel:')) {
    const number = rawExample.slice('tel:'.length)
    if (number.length > 0) {
      return {
        template: 'tel:{phone}',
        params: [{ key: 'phone', label: '电话号码', placeholder: number }],
      }
    }
    return { template: 'tel:{phone}', params: [{ key: 'phone', label: '电话号码' }] }
  }

  // Special-case: sms/smsto should always provide phone + content
  // Examples are often concrete like `sms:10086?body=查询余额` / `smsto:10086:查询余额`.
  if (rawExample.startsWith('sms:')) {
    const after = rawExample.slice('sms:'.length)
    const phone = after.split('?')[0] ?? ''
    const bodyMatch = rawExample.match(/[?&]body=([^&]*)/)
    const body = bodyMatch ? decodeURIComponent(bodyMatch[1]) : ''
    return {
      template: 'sms:{phone}?body={body}',
      params: [
        { key: 'phone', label: '手机号', placeholder: phone || '10086' },
        { key: 'body', label: '短信内容', placeholder: body || '查询余额' },
      ],
    }
  }

  if (rawExample.startsWith('smsto:')) {
    const after = rawExample.slice('smsto:'.length)
    const [phone = '', body = ''] = after.split(':')
    return {
      template: 'smsto:{phone}:{body}',
      params: [
        { key: 'phone', label: '手机号', placeholder: phone || '10086' },
        { key: 'body', label: '短信内容', placeholder: body || '查询余额' },
      ],
    }
  }

  // Special-case: mailto should always provide email + subject + body
  // Example: `mailto:test@example.com?subject=标题&body=内容`
  if (rawExample.startsWith('mailto:')) {
    const after = rawExample.slice('mailto:'.length)
    const [emailPart, query = ''] = after.split('?')
    const search = new URLSearchParams(query)
    const subject = search.get('subject') ?? ''
    const body = search.get('body') ?? ''
    return {
      template: 'mailto:{email}?subject={subject}&body={body}',
      params: [
        { key: 'email', label: '邮箱', placeholder: emailPart || 'test@example.com' },
        { key: 'subject', label: '标题', placeholder: subject || '标题' },
        { key: 'body', label: '内容', placeholder: body || '内容' },
      ],
    }
  }

  // Special-case: iOS Apple Maps search
  // Example: `maps://?q=北京故宫`
  if (rawExample.startsWith('maps://')) {
    const qMatch = rawExample.match(/[?&]q=([^&]*)/)
    const q = qMatch ? decodeURIComponent(qMatch[1]) : ''
    return {
      template: 'maps://?q={keyword}',
      params: [{ key: 'keyword', label: '搜索词', placeholder: q || '北京故宫' }],
    }
  }

  // Special-case: FaceTime
  // Examples: `facetime:user@icloud.com`, `facetime-audio:user@icloud.com`
  if (rawExample.startsWith('facetime-audio:')) {
    const target = rawExample.slice('facetime-audio:'.length)
    return {
      template: 'facetime-audio:{target}',
      params: [{ key: 'target', label: '号码/邮箱', placeholder: target || 'user@icloud.com' }],
    }
  }
  if (rawExample.startsWith('facetime:')) {
    const target = rawExample.slice('facetime:'.length)
    return {
      template: 'facetime:{target}',
      params: [{ key: 'target', label: '号码/邮箱', placeholder: target || 'user@icloud.com' }],
    }
  }

  // Special-case: App Store link
  // Example: `itms-apps://itunes.apple.com/app/idXXXXXX`
  if (rawExample.startsWith('itms-apps://')) {
    const idMatch = rawExample.match(/\/id([0-9Xx]+)/)
    const appId = idMatch ? idMatch[1] : ''
    return {
      template: 'itms-apps://itunes.apple.com/app/id{appId}',
      params: [{ key: 'appId', label: 'AppID', placeholder: appId || '123456' }],
    }
  }

  // Special-case: Shortcuts
  // Example: `shortcuts://run-shortcut?name=指令名称`
  if (rawExample.startsWith('shortcuts://')) {
    const nameMatch = rawExample.match(/[?&]name=([^&]*)/)
    const name = nameMatch ? decodeURIComponent(nameMatch[1]) : ''
    return {
      template: 'shortcuts://run-shortcut?name={name}',
      params: [{ key: 'name', label: '指令名称', placeholder: name || '指令名称' }],
    }
  }

  // Special-case: Android geo
  // Example: `geo:39.916,116.397?q=北京`
  if (rawExample.startsWith('geo:')) {
    const after = rawExample.slice('geo:'.length)
    const [coordPart = '', queryPart = ''] = after.split('?')
    const [lat = '', lng = ''] = coordPart.split(',')
    const qMatch = queryPart.match(/(^|&)q=([^&]*)/)
    const keyword = qMatch ? decodeURIComponent(qMatch[2]) : ''
    return {
      template: 'geo:{lat},{lng}?q={keyword}',
      params: [
        { key: 'lat', label: '纬度', placeholder: lat || '39.916' },
        { key: 'lng', label: '经度', placeholder: lng || '116.397' },
        { key: 'keyword', label: '搜索词', placeholder: keyword || '北京' },
      ],
    }
  }

  // Special-case: Android market
  // Example: `market://details?id=com.package.name`
  if (rawExample.startsWith('market://')) {
    const idMatch = rawExample.match(/[?&]id=([^&]*)/)
    const pkg = idMatch ? decodeURIComponent(idMatch[1]) : ''
    return {
      template: 'market://details?id={package}',
      params: [{ key: 'package', label: '包名', placeholder: pkg || 'com.package.name' }],
    }
  }

  // Special-case: Android intent/content examples (treat as free-form URI)
  if (rawExample.startsWith('intent://')) {
    return {
      template: '{intentUri}',
      params: [{ key: 'intentUri', label: 'Intent URI', placeholder: rawExample }],
    }
  }
  if (rawExample.startsWith('content://')) {
    return {
      template: '{contentUri}',
      params: [{ key: 'contentUri', label: 'Content URI', placeholder: rawExample }],
    }
  }

  const replacements: Array<{
    matcher: RegExp
    key: string
    label: string
    placeholder?: string
  }> = [
    { matcher: /商品ID/g, key: 'productId', label: '商品ID', placeholder: '1234567890' },
    { matcher: /skuId":"商品ID"/g, key: 'skuId', label: '商品ID', placeholder: '100012043978' },
    { matcher: /视频ID/g, key: 'videoId', label: '视频ID', placeholder: 'dQw4w9WgXcQ' },
    { matcher: /用户ID/g, key: 'userId', label: '用户ID', placeholder: '123456' },
    { matcher: /页面ID/g, key: 'pageId', label: '页面ID', placeholder: '123456' },
    { matcher: /用户名/g, key: 'username', label: '用户名', placeholder: 'example' },
    { matcher: /子版块名/g, key: 'subreddit', label: '子版块名', placeholder: 'news' },
    { matcher: /曲目ID/g, key: 'trackId', label: '曲目ID', placeholder: '0VjIjW4GlUZAMYd2vXMi3b' },
    { matcher: /会议ID/g, key: 'confno', label: '会议ID', placeholder: '123456789' },
    { matcher: /邀请码/g, key: 'invite', label: '邀请码', placeholder: 'AbCdEf' },
    { matcher: /直播间号/g, key: 'roomId', label: '直播间号', placeholder: '12345' },
    { matcher: /QQ号/g, key: 'uin', label: 'QQ号', placeholder: '12345678' },
    { matcher: /手机号/g, key: 'phone', label: '手机号', placeholder: '13800000000' },
    { matcher: /搜索词/g, key: 'keyword', label: '搜索词', placeholder: '北京故宫' },
    { matcher: /目的地名称/g, key: 'name', label: '目的地名称', placeholder: '北京故宫' },
    { matcher: /目的地/g, key: 'to', label: '目的地', placeholder: '北京南站' },
    { matcher: /纬度/g, key: 'lat', label: '纬度', placeholder: '39.916' },
    { matcher: /经度/g, key: 'lng', label: '经度', placeholder: '116.397' },
    { matcher: /\blat\b/g, key: 'lat', label: '纬度', placeholder: '39.916' },
    { matcher: /\blng\b/g, key: 'lng', label: '经度', placeholder: '116.397' },
    { matcher: /\burl\b/g, key: 'url', label: 'URL', placeholder: 'https://example.com' },
    { matcher: /指令名称/g, key: 'name', label: '指令名称', placeholder: '我的快捷指令' },
    {
      matcher:
        /WIFI|Bluetooth|NOTIFICATIONS_ID|LOCATION_SERVICES|Privacy|General|DISPLAY|CASTLE|DO_NOT_DISTURB/g,
      key: 'setting',
      label: '设置项',
      placeholder: 'WIFI',
    },
    { matcher: /内容/g, key: 'text', label: '内容', placeholder: '你好' },
    { matcher: /消息/g, key: 'message', label: '消息内容', placeholder: 'Hello' },
  ]

  let template = rawExample
  const params: SchemeParam[] = []

  replacements.forEach((rule) => {
    if (!rule.matcher.test(template)) return
    template = template.replace(rule.matcher, `{${rule.key}}`)
    if (!params.some((p) => p.key === rule.key)) {
      params.push({ key: rule.key, label: rule.label, placeholder: rule.placeholder })
    }
  })

  if (params.length === 0) return undefined
  return { template, params }
}

export const parseMarkdownTables = (markdown: string): SchemeGroup[] => {
  const lines = markdown.split('\n')
  let section: string | undefined
  let subSection: string | undefined
  let subSubSection: string | undefined

  const itemsByGroup: Record<string, SchemeItem[]> = {}
  const ensure = (id: string) => {
    if (!itemsByGroup[id]) itemsByGroup[id] = []
    return itemsByGroup[id]
  }

  const resolveGroupId = () => {
    // 系统级
    if (section === '一、系统级 Scheme') {
      if (subSection === '通用（iOS & Android）') return 'system-common'
      if (subSection === 'iOS 专属') return 'system-ios'
      if (subSection === 'Android 专属') return 'system-android'
      if (subSubSection?.includes('App-Prefs')) return 'system-ios'
    }
    // 国内
    if (section === '二、国内 App Scheme') {
      if (subSection === '社交通讯') return 'china-social'
      if (subSection === '支付金融') return 'china-pay'
      if (subSection === '短视频 / 内容') return 'china-short-content'
      if (subSection === '电商购物') return 'china-commerce'
      if (subSection === '地图导航') return 'china-map'
      if (subSection === '工具 / 其他') return 'china-tools'
    }
    // 国外
    if (section === '三、国外 App Scheme') return 'global'
    // 浏览器
    if (section === '四、浏览器 Scheme') return 'browser'
    return undefined
  }

  const isTableHeader = (line: string) => line.includes('|') && line.includes('---')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('## ')) {
      section = line.replace(/^##\s+/, '')
      subSection = undefined
      subSubSection = undefined
      continue
    }
    if (line.startsWith('### ')) {
      subSection = line.replace(/^###\s+/, '')
      subSubSection = undefined
      continue
    }
    if (line.startsWith('#### ')) {
      subSubSection = line.replace(/^####\s+/, '')
      continue
    }

    // Find markdown table
    if (line.startsWith('|') && i + 1 < lines.length && isTableHeader(lines[i + 1])) {
      const header = line
      const headers = header
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean)

      const groupId = resolveGroupId()
      i += 2 // skip separator line

      while (i < lines.length) {
        const rowLine = lines[i].trim()
        if (!rowLine.startsWith('|')) break

        const cells = rowLine
          .split('|')
          .map((c) => cleanCell(c))
          .filter((c) => c.length > 0)

        if (cells.length >= 2 && groupId) {
          // System tables: [Scheme, 用途, 示例]
          if (headers[0] === 'Scheme' && headers.includes('示例')) {
            const scheme = cells[0] ?? ''
            const purpose = cells[1] ?? ''
            const example = cells[2] ?? ''
            const detected = detectParamsAndTemplate(example)
            ensure(groupId).push({
              app: '系统',
              scheme,
              purpose,
              example,
              template: detected?.template ?? example,
              params: detected?.params,
            })
          }
          // App tables: [App, Scheme, 用途]
          else if ((headers[0] === 'App' || headers[0] === '浏览器') && headers[1] === 'Scheme') {
            const app = cells[0] ?? ''
            const scheme = cells[1] ?? ''
            const purpose = cells[2] ?? ''
            const detected = detectParamsAndTemplate(scheme)
            ensure(groupId).push({
              app,
              scheme,
              purpose,
              example: scheme,
              template: detected?.template ?? scheme,
              params: detected?.params,
            })
          }
          // App-Prefs sub-table: [Scheme, 跳转页面]
          else if (headers[0] === 'Scheme' && headers[1]?.includes('跳转页面')) {
            const scheme = cells[0] ?? ''
            const purpose = cells[1] ?? ''
            ensure(groupId).push({
              app: 'iOS 设置',
              scheme,
              purpose,
              example: scheme,
              template: scheme,
            })
          }
        }

        i++
      }

      i--
    }
  }

  return groupOrder.map((id) => ({
    id,
    title: groupMeta[id].title,
    description: groupMeta[id].description,
    items: itemsByGroup[id] ?? [],
  }))
}

export const buildSchemeLink = (item: SchemeItem, values: Record<string, string>) => {
  const template = item.template ?? item.example ?? item.scheme
  return template.replace(/\{([^}]+)\}/g, (_match: string, key: string) => {
    const value = values[key] ?? ''
    return encodeURIComponent(value)
  })
}

export const loadSchemeGroups = async (mdPath: string = schemeMdPath): Promise<SchemeGroup[]> => {
  const resp = await fetch(mdPath, { cache: 'no-cache' })
  if (!resp.ok) {
    throw new Error(`加载 md 失败: ${resp.status}`)
  }
  const text = await resp.text()
  return parseMarkdownTables(text)
}
