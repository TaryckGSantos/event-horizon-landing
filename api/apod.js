// Serverless function (Vercel) — cache em memória do APOD da NASA.
// Garante que todos os usuários compartilhem um único request diário à NASA.

let cache = { date: null, data: null }

const TIMEOUT_MS = 8000

function ymd(d) {
    return d.toISOString().slice(0, 10)
}

async function fetchApod(apiKey, dateStr) {
    const base = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
    const url = dateStr ? `${base}&date=${dateStr}` : base
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
        const r = await fetch(url, { signal: controller.signal })
        if (!r.ok) return null
        return await r.json()
    } catch {
        return null
    } finally {
        clearTimeout(timer)
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const today = ymd(new Date())

    if (cache.date === today && cache.data) {
        return res.status(200).json(cache.data)
    }

    const apiKey = process.env.VITE_NASA_API_KEY || 'DEMO_KEY'

    // tenta hoje; se falhar, tenta ontem (datas passadas são estáveis na NASA)
    let data = await fetchApod(apiKey, null)
    if (!data) {
        const yesterday = new Date()
        yesterday.setUTCDate(yesterday.getUTCDate() - 1)
        data = await fetchApod(apiKey, ymd(yesterday))
    }

    if (data) {
        cache = { date: today, data }
        return res.status(200).json(data)
    }

    // nada novo, mas há cache antigo: serve stale em vez de 502
    if (cache.data) {
        return res.status(200).json(cache.data)
    }

    return res.status(502).json({ error: 'NASA APOD indisponível no momento.' })
}
