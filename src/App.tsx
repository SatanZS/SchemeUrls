import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Card, Input, Menu, Space, Spin, Table, Tag, Typography } from 'antd'
import type { MenuProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import './App.css'
import {
  buildSchemeLink as buildSchemeLinkFromFile,
  groupOrder,
  loadSchemeGroups,
  type SchemeGroup,
  type SchemeItem,
  type SchemeParam,
} from './schemeData'

type SchemeRow = SchemeItem & { rowId: string }

const menuItems: MenuProps['items'] = [
  {
    key: 'system',
    label: '系统级',
    children: [
      { key: 'system-common', label: '通用（iOS & Android）' },
      { key: 'system-ios', label: 'iOS 专属' },
      { key: 'system-android', label: 'Android 专属' },
    ],
  },
  {
    key: 'china',
    label: '国内 App',
    children: [
      { key: 'china-social', label: '社交通讯' },
      { key: 'china-pay', label: '支付金融' },
      { key: 'china-short-content', label: '短视频 / 内容' },
      { key: 'china-commerce', label: '电商购物' },
      { key: 'china-map', label: '地图导航' },
      { key: 'china-tools', label: '工具 / 其他' },
    ],
  },
  { key: 'global', label: '国外 App' },
  { key: 'browser', label: '浏览器' },
]

const columns: ColumnsType<SchemeRow> = [
  {
    title: '应用/平台',
    dataIndex: 'app',
    width: 100,
    render: (app: string) => <Tag color="blue">{app}</Tag>,
  },
  {
    title: '协议',
    dataIndex: 'scheme',
    width: 200,
    render: (scheme: string) => <Typography.Text code>{scheme}</Typography.Text>,
  },
  {
    title: '用途',
    dataIndex: 'purpose',
    width: 150,
  },
  {
    title: '示例',
    dataIndex: 'example',
    width: 200,
    render: (example: string | undefined) =>
      example ? (
        <Typography.Text code style={{ wordBreak: 'break-all' }}>
          {example}
        </Typography.Text>
      ) : (
        <Typography.Text type="secondary">-</Typography.Text>
      ),
  },
]

function App() {
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({})
  const [activeMenuKey, setActiveMenuKey] = useState(groupOrder[0] ?? '')
  const [groups, setGroups] = useState<SchemeGroup[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const topNavRef = useRef<HTMLElement | null>(null)
  const scrollRafRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const parsed = await loadSchemeGroups()
        if (!cancelled) {
          setGroups(parsed)
          setLoadError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : '加载失败')
          setGroups([])
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const safeGroups = useMemo(() => groups ?? [], [groups])

  const initializedValues = useMemo(() => {
    const defaults: Record<string, Record<string, string>> = {}
    safeGroups.forEach((group) => {
      group.items.forEach((item, index) => {
        const id = `${group.id}-${index}`
        defaults[id] = {}
        item.params?.forEach((param) => {
          defaults[id][param.key] = param.defaultValue ?? ''
        })
      })
    })
    return defaults
  }, [safeGroups])

  const getValues = (rowId: string) => formValues[rowId] ?? initializedValues[rowId] ?? {}

  const updateValue = useCallback(
    (rowId: string, key: string, value: string) => {
      setFormValues((prev) => ({
        ...prev,
        [rowId]: {
          ...(prev[rowId] ?? initializedValues[rowId] ?? {}),
          [key]: value,
        },
      }))
    },
    [initializedValues],
  )

  const openScheme = useCallback(
    (item: SchemeItem, rowId: string) => {
      const link = buildSchemeLinkFromFile(item, getValues(rowId))
      window.location.href = link
    },
    [formValues, initializedValues],
  )

  useEffect(() => {
    const updateActiveByHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && safeGroups.some((group) => group.id === hash)) {
        setActiveMenuKey(hash)
      }
    }
    updateActiveByHash()
    window.addEventListener('hashchange', updateActiveByHash)
    return () => window.removeEventListener('hashchange', updateActiveByHash)
  }, [safeGroups])

  useLayoutEffect(() => {
    if (safeGroups.length === 0) return

    const getOffset = () => {
      const navHeight = topNavRef.current?.offsetHeight ?? 0
      return navHeight + 12
    }

    const updateActiveFromScroll = () => {
      const offset = getOffset()
      let nextKey = safeGroups[0]?.id

      safeGroups.forEach((group) => {
        const el = document.getElementById(group.id)
        if (!el) return
        const top = el.getBoundingClientRect().top
        if (top <= offset) {
          nextKey = group.id
        }
      })

      if (nextKey) {
        setActiveMenuKey((prev) => (prev === nextKey ? prev : nextKey))
      }
    }

    const scheduleUpdate = () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current)
      }
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null
        updateActiveFromScroll()
      })
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
    }
  }, [safeGroups])

  type SubRow =
    | { key: string; kind: 'param'; label: string; param: SchemeParam }
    | { key: string; kind: 'action' }

  const expandedRowRender = (record: SchemeRow) => {
    const rowValues = getValues(record.rowId)
    const finalLink = buildSchemeLinkFromFile(record, rowValues)
    const params = record.params ?? []

    const subColumns: ColumnsType<SubRow> = [
      {
        title: '字段',
        key: 'field',
        width: 100,
        render: (_, row) => (row.kind === 'param' ? row.label : '操作'),
      },
      {
        title: '内容',
        key: 'content',
        render: (_, row) => {
          if (row.kind === 'param') {
            const v = rowValues[row.param.key] ?? ''
            return (
              <Input
                addonBefore={row.param.label}
                value={v}
                placeholder={row.param.placeholder}
                onChange={(event) => updateValue(record.rowId, row.param.key, event.target.value)}
              />
            )
          }

          return (
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Button type="primary" size="small" onClick={() => openScheme(record, record.rowId)}>
                快捷打开
              </Button>
              <Typography.Paragraph
                copyable={{ text: finalLink }}
                className="final-link"
                ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
              >
                {finalLink}
              </Typography.Paragraph>
            </Space>
          )
        },
      },
    ]

    const subData: SubRow[] = [
      ...params.map((p) => ({
        key: `param-${p.key}`,
        kind: 'param' as const,
        label: p.label,
        param: p,
      })),
      { key: 'action', kind: 'action' as const },
    ]

    return (
      <Table<SubRow>
        size="small"
        showHeader={false}
        pagination={false}
        rowKey="key"
        columns={subColumns}
        dataSource={subData}
      />
    )
  }

  const rowsByGroup = useMemo<Record<string, SchemeRow[]>>(
    () =>
      safeGroups.reduce<Record<string, SchemeRow[]>>((acc, group) => {
        acc[group.id] = group.items.map((item, index) => ({
          ...item,
          rowId: `${group.id}-${index}`,
        }))
        return acc
      }, {}),
    [safeGroups],
  )

  return (
    <div className="scheme-page">
      <header ref={topNavRef} className="top-nav">
        <div className="top-nav-inner">
          <div className="top-menu-wrap">
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={[activeMenuKey]}
              onClick={({ key }) => {
                if (!safeGroups.some((group) => group.id === key)) {
                  return
                }
                setActiveMenuKey(key)
                window.location.hash = key
              }}
            />
          </div>
        </div>
      </header>

      <main className="content">
        {groups === null ? (
          <Card className="section-card">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Spin />
              <Typography.Text type="secondary">正在从 md 文档加载数据…</Typography.Text>
            </Space>
          </Card>
        ) : (
          <>
            {loadError ? (
              <Alert
                type="warning"
                showIcon
                message="文档加载失败"
                description={`未能加载 /手机端常见URL_Scheme大全.md：${loadError}`}
                style={{ marginBottom: 12 }}
              />
            ) : null}
            {safeGroups.map((group) => (
              <Card id={group.id} key={group.id} className="section-card">
                <Typography.Title level={5} style={{ marginTop: 0 }}>
                  {group.title}
                </Typography.Title>
                <Typography.Paragraph type="secondary">{group.description}</Typography.Paragraph>
                <Table
                  rowKey={(record) => record.rowId}
                  columns={columns}
                  dataSource={rowsByGroup[group.id] ?? []}
                  pagination={false}
                  size="small"
                  expandable={{
                    expandedRowRender,
                    rowExpandable: () => true,
                  }}
                />
              </Card>
            ))}
          </>
        )}
        <Typography.Paragraph type="secondary" className="tip">
          提示：若未安装对应 App，部分 Scheme 可能无响应。请以真机与目标 App 版本测试结果为准。
        </Typography.Paragraph>
      </main>
    </div>
  )
}

export default App
