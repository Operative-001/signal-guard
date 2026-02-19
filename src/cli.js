#!/usr/bin/env node
import fs from 'node:fs';
import { scoreContent } from './scoring.js';

function arg(name, fallback=null){
  const i = process.argv.indexOf(`--${name}`);
  return i>-1 ? process.argv[i+1] : fallback;
}

async function postWebhook(url, text){
  const r = await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text})});
  return r.status;
}

async function main(){
  const input = arg('input');
  if(!input){
    console.error('Usage: signal-guard --input items.json [--notify-webhook URL] [--top 20]');
    process.exit(1);
  }
  const top = Number(arg('top','20'));
  const raw = JSON.parse(fs.readFileSync(input,'utf8'));
  if(!Array.isArray(raw)) throw new Error('input must be JSON array of {id,content,source,author}');

  const rows = raw.map(item=>{
    const s = scoreContent(item.content||'');
    let queue='accept';
    if(s.score>=70) queue='reject';
    else if(s.score>=45) queue='review';
    return { id:item.id||'unknown', source:item.source||'unknown', score:s.score, confidence:s.confidence, queue, reasons:s.reasons };
  }).sort((a,b)=>b.score-a.score).slice(0, top);

  console.log('id\tsource\tscore\tconfidence\tqueue\treasons');
  rows.forEach(r=>console.log(`${r.id}\t${r.source}\t${r.score}\t${r.confidence}\t${r.queue}\t${r.reasons.join(',')}`));

  const webhook = arg('notify-webhook');
  if(webhook){
    const summary = ['*Signal Guard Queue Digest*', ...rows.slice(0,10).map(r=>`• ${r.id} => ${r.queue} (score=${r.score})`)].join('\n');
    const st = await postWebhook(webhook, summary);
    console.log(`webhook_status=${st}`);
  }
}

main();
