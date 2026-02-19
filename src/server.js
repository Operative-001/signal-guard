import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, logAudit } from './store.js';
import { id, nowIso } from './schema.js';
import { scoreContent } from './scoring.js';

const PORT = Number(process.env.PORT || 8787);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function json(res, code, obj){ res.writeHead(code, {'content-type':'application/json'}); res.end(JSON.stringify(obj)); }
async function body(req){
  const chunks=[]; for await (const c of req) chunks.push(c);
  const raw=Buffer.concat(chunks).toString('utf8')||'{}';
  return JSON.parse(raw);
}

const server = http.createServer(async (req,res)=>{
  try {
    const u = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && u.pathname === '/health') return json(res,200,{ok:true});

    if (req.method === 'GET' && u.pathname === '/ui') {
      const html = fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
      res.writeHead(200, {'content-type':'text/html; charset=utf-8'});
      return res.end(html);
    }

    if (req.method === 'POST' && u.pathname === '/ingest/discord') {
      const b = await body(req);
      const item = {
        id: id('itm'), source: 'discord', source_id: String(b.id || id('src')),
        community_id: String(b.community_id || 'default'), author_id: String(b.author_id || 'unknown'),
        content: String(b.content || ''), created_at: nowIso(), status: 'new'
      };
      db.items.push(item); logAudit('Item', item.id, 'ingested', 'connector.discord', { source_id: item.source_id });
      return json(res,201,item);
    }

    if (req.method === 'POST' && u.pathname === '/assess') {
      const b = await body(req);
      const item = db.items.find(i => i.id === b.item_id) || b.item;
      if (!item) return json(res,400,{error:'item_id or item required'});
      if (!db.items.find(i=>i.id===item.id)) db.items.push(item);
      const r = scoreContent(item.content || '');
      const assessment = {
        item_id: item.id, score: r.score, confidence: r.confidence, reasons: r.reasons,
        policy_version: 'v0.1', assessed_at: nowIso()
      };
      const evidence = {
        item_id: item.id,
        snippets: [{ type:'content', text: (item.content||'').slice(0,180) }],
        similar_items: [],
        feature_snapshot: r.features
      };
      db.assessments.push(assessment); db.evidence.push(evidence);
      item.status = r.score >= 45 ? 'review' : 'auto_allow';
      logAudit('Assessment', item.id, 'scored', 'engine', { score: r.score, reasons: r.reasons });
      return json(res,200,{assessment,evidence,item_status:item.status});
    }

    if (req.method === 'GET' && u.pathname === '/queue') {
      const items = db.items.filter(i=>i.status==='review').map(i=>({
        item: i,
        assessment: db.assessments.find(a=>a.item_id===i.id),
        evidence: db.evidence.find(e=>e.item_id===i.id)
      }));
      return json(res,200,{count:items.length, items});
    }

    if (req.method === 'POST' && u.pathname === '/decision') {
      const b = await body(req);
      const item = db.items.find(i=>i.id===b.item_id);
      if (!item) return json(res,404,{error:'item not found'});
      const d = { item_id:item.id, reviewer_id:String(b.reviewer_id||'reviewer'), decision:String(b.decision||'escalate'), rationale:String(b.rationale||''), decided_at: nowIso() };
      db.decisions.push(d); item.status = d.decision;
      logAudit('ReviewDecision', item.id, 'decided', d.reviewer_id, { decision: d.decision });
      return json(res,200,d);
    }

    if (req.method === 'POST' && u.pathname === '/digest/slack') {
      const b = await body(req);
      const webhook = b.webhook_url || process.env.SLACK_WEBHOOK_URL;
      if (!webhook) return json(res,400,{error:'webhook_url required'});
      const review = db.items.filter(i=>i.status==='review').slice(0,10);
      const text = ['*Signal Guard Digest*', ...review.map(i=>`• ${i.id} risk pending review`)].join('\n');
      const resp = await fetch(webhook,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text})});
      logAudit('Digest', 'slack', 'sent', 'notifier', { status: resp.status, count: review.length });
      return json(res,200,{status:resp.status,count:review.length});
    }

    if (req.method === 'GET' && u.pathname === '/audit') return json(res,200,{count:db.audit.length,events:db.audit});

    return json(res,404,{error:'not found'});
  } catch (e) {
    return json(res,500,{error:e.message});
  }
});

if (process.argv[1] && new URL(`file://${process.argv[1]}`).href === import.meta.url) {
  server.listen(PORT, ()=>console.log(`signal-guard listening on :${PORT}`));
}

export default server;
