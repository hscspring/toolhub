import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-data-middleware',
      configureServer(server) {
        server.middlewares.use('/api/save', (req, res, next) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                const targetPath = path.resolve(__dirname, '../web/src/data/tools.json')
                // Verify it is valid JSON
                JSON.parse(body)
                fs.writeFileSync(targetPath, body)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true }))
              } catch (e) {
                console.error('Save failed:', e)
                res.statusCode = 500
                res.end(JSON.stringify({ error: e.message }))
              }
            })
          } else {
            next()
          }
        })
      }
    }
  ],
  server: { port: 5173 }
})
