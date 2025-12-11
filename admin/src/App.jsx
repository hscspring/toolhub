import React, { useState, useEffect } from 'react'
import { sampleData } from './sampleData'

function emptyTool() {
  return {
    id: Date.now().toString(),
    name: '',
    slug: '',
    url: '',
    category: '',
    tags: [],
    description: ''
  }
}

export default function App() {
  const [tools, setTools] = useState(() => {
    // load from localStorage or sample
    try {
      const raw = localStorage.getItem('toolhub_tools_v1')
      return raw ? JSON.parse(raw) : sampleData()
    } catch (e) {
      return sampleData()
    }
  })
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('')
  useEffect(() => {
    localStorage.setItem('toolhub_tools_v1', JSON.stringify(tools, null, 2))
  }, [tools])

  function addTool() {
    const t = emptyTool()
    setTools([t, ...tools])
    setEditing(t.id)
  }

  function updateTool(id, patch) {
    setTools(tools.map(t => t.id === id ? { ...t, ...patch } : t))
  }

  function removeTool(id) {
    if (!confirm('Delete this tool?')) return
    setTools(tools.filter(t => t.id !== id))
  }

  async function saveToWeb() {
    if (!confirm('Save changes to web project?')) return
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tools, null, 2)
      })
      const data = await res.json()
      if (data.success) {
        alert('Saved successfully to web project!')
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (e) {
      alert('Save failed: ' + e.message)
    }
  }

  async function fetchFromUrl(id) {
    const tool = tools.find(t => t.id === id)
    if (!tool || !tool.url) return alert('Please enter URL first')
    try {
      const proxy = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(tool.url)
      const res = await fetch(proxy)
      if (!res.ok) throw new Error('Fetch failed: ' + res.status)
      const html = await res.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const title = doc.querySelector('meta[property="og:title"]')?.content || doc.title || ''
      const desc = doc.querySelector('meta[name="description"]')?.content || doc.querySelector('meta[property="og:description"]')?.content || ''
      const iconEl = doc.querySelector('link[rel*="icon"]')
      const icon = iconEl ? new URL(iconEl.getAttribute('href'), tool.url).href : ''
      updateTool(id, {
        name: title,
        description: desc,
        icon: icon,
        slug: slugify(title || tool.url)
      })
      alert('Fetched title/description. You can edit before saving/exporting.')
    } catch (e) {
      alert('Fetch error: ' + e.message + '\nYou can try again or edit manually.')
    }
  }

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60)
  }

  const visible = tools.filter(t => {
    if (!filter) return true
    const f = filter.toLowerCase()
    return (t.name || '').toLowerCase().includes(f) || (t.description || '').toLowerCase().includes(f) || (t.tags || []).join(' ').toLowerCase().includes(f)
  })

  return (
    <div className="container">
      <header>
        <h1>ToolHub — Admin</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button btn-ghost" onClick={addTool}>New</button>
          <button className="button btn-primary" onClick={saveToWeb}>Save to Web</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div className="card" style={{ marginBottom: 12 }}>
            <input className="input" placeholder="Search name / desc / tags" value={filter} onChange={e => setFilter(e.target.value)} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <table>
              <thead>
                <tr><th>Name</th><th>Category</th><th>Tags</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {visible.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.name || '(no name)'}</strong><div style={{ fontSize: 12, color: '#666' }}>{t.url}</div></td>
                    <td>{t.category}</td>
                    <td>{(t.tags || []).join(', ')}</td>
                    <td>
                      <button className="button btn-ghost small" onClick={() => setEditing(t.id)}>Edit</button>
                      <button className="button" onClick={() => fetchFromUrl(t.id)}>Fetch</button>
                      <button className="button" onClick={() => removeTool(t.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>No tools found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ width: 420 }}>
          <div className="card">
            <h3>{editing ? 'Edit Tool' : 'Select a tool'}</h3>
            {editing ? (
              (() => {
                const t = tools.find(x => x.id === editing)
                if (!t) return <div>Not found</div>
                return (
                  <div>
                    <div className="form-row">
                      <input className="input" placeholder="Name" value={t.name} onChange={e => updateTool(t.id, { name: e.target.value })} />
                    </div>
                    <div className="form-row">
                      <input className="input" placeholder="URL" value={t.url} onChange={e => updateTool(t.id, { url: e.target.value })} />
                      <button className="button btn-ghost small" onClick={() => fetchFromUrl(t.id)}>一键抓取</button>
                    </div>
                    <div className="form-row">
                      <input className="input" placeholder="Category" value={t.category} onChange={e => updateTool(t.id, { category: e.target.value })} />
                      <input className="input small" placeholder="Slug" value={t.slug} onChange={e => updateTool(t.id, { slug: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <input className="input" placeholder="Tags (comma separated)" value={(t.tags || []).join(', ')} onChange={e => updateTool(t.id, { tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <textarea className="input" placeholder="Description" rows="6" value={t.description} onChange={e => updateTool(t.id, { description: e.target.value })}></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="button btn-primary" onClick={() => { setEditing(null); }}>Done</button>
                      <button className="button btn-ghost" onClick={() => { updateTool(t.id, { slug: slugify(t.name || t.url) }); alert('Slug regenerated'); }}>Regenerate Slug</button>
                    </div>
                  </div>
                )
              })()
            ) : (
              <div style={{ color: '#666' }}>Click a tool on the left to edit, or press "New".</div>
            )}
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 20, color: '#666' }}>Data stored locally in your browser (localStorage). Use Export to produce tools.json for the web site.</footer>
    </div>
  )
}
