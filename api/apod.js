// Serverless function (Vercel) — cache em memória do APOD da NASA.
// Garante que todos os usuários compartilhem um único request diário à NASA.

let cache = { date: null, data: null }

function todayUTC() {
    return new Date().toISOString().slice(0, 10)
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const today = todayUTC()

    if (cache.date === today && cache.data) {
        res.status(200).json(cache.data)
        return
    }

    const apiKey = process.env.VITE_NASA_API_KEY || 'DEMO_KEY'
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`

    try {
        const nasaRes = await fetch(url)
        if (!nasaRes.ok) {
            res.status(502).json({ error: `NASA API respondeu com status ${nasaRes.status}` })
            return
        }

        const data = await nasaRes.json()
        cache = { date: today, data }

        res.status(200).json(data)
    } catch (err) {
        res.status(502).json({ error: 'Falha ao contactar a API da NASA' })
    }
}
