import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.API_FOOTBALL_KEY;
const BASE = 'https://v3.football.api-sports.io';

app.use(express.static('public'));

async function api(path) {
  if (!KEY) throw new Error('API_FOOTBALL_KEY não configurada no servidor.');
  const r = await fetch(BASE + path, { headers: { 'x-apisports-key': KEY } });
  if (!r.ok) throw new Error(`API respondeu ${r.status}`);
  return r.json();
}

app.get('/api/live', async (_,res)=>{
  try { res.json(await api('/fixtures?live=all')); }
  catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/fixtures', async (req,res)=>{
  try {
    const date = req.query.date || new Date().toISOString().slice(0,10);
    res.json(await api(`/fixtures?date=${encodeURIComponent(date)}`));
  } catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/events/:id', async (req,res)=>{
  try { res.json(await api(`/fixtures/events?fixture=${encodeURIComponent(req.params.id)}`)); }
  catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/standings', async (req,res)=>{
  try {
    if (!req.query.league || !req.query.season)
      return res.status(400).json({error:'Informe league e season.'});
    res.json(await api(`/standings?league=${encodeURIComponent(req.query.league)}&season=${encodeURIComponent(req.query.season)}`));
  } catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/leagues', async (_,res)=>{
  try { res.json(await api('/leagues')); }
  catch(e){ res.status(500).json({error:e.message}); }
});

app.listen(PORT,()=>console.log(`Guiné Sports: http://localhost:${PORT}`));
