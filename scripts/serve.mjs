// Servidor estático de desarrollo. No contiene lógica de backend.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../public/', import.meta.url))
const port = Number(process.env.PORT || 4173)
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml' }
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname))
    if (!path.startsWith(resolve(root) + sep)) { res.writeHead(403); res.end('Acceso no permitido'); return }
    const content = await readFile(path)
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-store' })
    res.end(content)
  } catch { res.writeHead(404); res.end('Archivo no encontrado') }
}).listen(port, '127.0.0.1', () => console.log(`ReportaCampus: http://127.0.0.1:${port}`))
