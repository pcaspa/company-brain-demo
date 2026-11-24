import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
mkdirSync('data', { recursive: true });
export const db = new DatabaseSync(process.env.DB_PATH || 'data/brain.sqlite');
db.exec(`CREATE TABLE IF NOT EXISTS daily(date TEXT PRIMARY KEY,revenue REAL,orders INTEGER,spend REAL,cogs REAL,shipping REAL,refunds REAL);
CREATE TABLE IF NOT EXISTS creatives(id TEXT PRIMARY KEY,name TEXT,angle TEXT,hook TEXT,spend REAL,revenue REAL,ctr REAL,frequency REAL);
CREATE TABLE IF NOT EXISTS inventory(sku TEXT PRIMARY KEY,name TEXT,stock INTEGER,daily_units REAL,lead_days INTEGER);
CREATE TABLE IF NOT EXISTS knowledge(id INTEGER PRIMARY KEY,title TEXT,body TEXT,source TEXT);
CREATE TABLE IF NOT EXISTS runs(id INTEGER PRIMARY KEY,agent TEXT,created TEXT,result TEXT);
CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY,title TEXT UNIQUE,created TEXT,status TEXT);`);
if (!db.prepare('SELECT COUNT(*) n FROM daily').get().n) {
 const insert = db.prepare('INSERT INTO daily VALUES(?,?,?,?,?,?,?)');
 for(let i=0;i<28;i++){const date=new Date(Date.UTC(2026,10, -3+i)).toISOString().slice(0,10); const revenue= Math.round(14800+i*173+Math.sin(i*1.8)*1500);insert.run(date,revenue,Math.round(revenue/92),Math.round(4400+i*73),Math.round(revenue*.29),Math.round(revenue*.065),Math.round(revenue*.035));}
 const ad=db.prepare('INSERT INTO creatives VALUES(?,?,?,?,?,?,?,?)');
 [['CR-014','The 6am reset','Everyday ritual','Your morning deserves a better start.',4200,19320,2.8,1.9],['CR-022','Real people, real routines','Social proof','I thought it was just another wellness trend.',3900,14430,2.3,2.4],['CR-008','A little everyday luxury','Self-care','Five minutes that are just for you.',5100,11730,1.2,4.8],['CR-031','What’s actually inside','Ingredient education','Turn the label around. Let’s talk ingredients.',2100,7350,2.1,1.6]].forEach(x=>ad.run(...x));
 const stock=db.prepare('INSERT INTO inventory VALUES(?,?,?,?,?)');
 [['RIT-001','Daily Ritual · Original',284,42,18],['RIT-002','Daily Ritual · Berry',960,31,18],['KIT-001','The Starter Kit',620,24,14],['REF-001','Monthly Refill',1430,38,21]].forEach(x=>stock.run(...x));
 const doc=db.prepare('INSERT INTO knowledge(title,body,source) VALUES(?,?,?)');
 [['Weekly growth standup','The creative team will produce three morning-routine variations. Do not scale Original until the purchase order is confirmed. Owner: Operations.','Meeting transcript · 23 Nov 2026'],['Metric definitions','Revenue is synthetic net merchandise sales before refunds. Contribution = revenue minus COGS, shipping, refunds and paid media. MER = revenue / total paid media spend. Ad ROAS is platform-attributed revenue / spend and must not be added to store revenue.','Finance SOP · v1'],['Customer research: routines','Synthetic interview theme: customers prefer simple daily habits over complex routines. This is a research hypothesis, not proven causation.','Research notes · 20 Nov 2026']].forEach(x=>doc.run(...x));
}
export function snapshot(days=7){
 const rows=db.prepare('SELECT * FROM daily ORDER BY date DESC LIMIT ?').all(days).reverse();
 const sum=k=>rows.reduce((s,r)=>s+r[k],0);const revenue=sum('revenue'),spend=sum('spend');
 return {period:{from:rows[0].date,to:rows.at(-1).date,days},currency:'AUD',revenue,spend,orders:sum('orders'),mer:revenue/spend,contribution:revenue-spend-sum('cogs')-sum('shipping')-sum('refunds'),daily:rows,creatives:db.prepare('SELECT *, revenue/spend AS roas FROM creatives ORDER BY roas DESC').all(),inventory:db.prepare('SELECT *, stock/daily_units AS cover FROM inventory ORDER BY cover').all(),knowledge:db.prepare('SELECT * FROM knowledge').all()};
}
export function evidence(topic,days=7){const s=snapshot(days);if(topic==='inventory')return {source:'Seeded inventory table · snapshot 24 Nov 2026',records:s.inventory};if(topic==='creative')return {source:'Seeded ad performance · illustrative campaign totals, independent of dashboard date range',records:s.creatives};if(topic==='knowledge')return {source:'Seeded knowledge table',records:s.knowledge};return {source:`Seeded daily trading table · ${s.period.from} to ${s.period.to}`,records:{...s,creatives:undefined,inventory:undefined,knowledge:undefined}};}
export function report(days=7){const s=snapshot(days);const risk=s.inventory.filter(x=>x.cover<x.lead_days);return `Founder briefing | ${s.period.from} – ${s.period.to}\nSynthetic data · AUD\n\nRevenue: $${s.revenue.toLocaleString()} from ${s.orders} orders.\nPaid media: $${s.spend.toLocaleString()}. MER: ${s.mer.toFixed(2)}x.\nContribution after product costs, shipping, refunds and media: $${s.contribution.toLocaleString()} (${(100*s.contribution/s.revenue).toFixed(1)}%).\n\nInventory: ${risk.map(x=>`${x.name} has ${x.cover.toFixed(1)} days of cover versus a ${x.lead_days}-day lead time`).join('; ') || 'No lead-time breaches'}.\nCreative: ${s.creatives[0].name} leads the illustrative ad dataset at ${s.creatives[0].roas.toFixed(2)}x attributed ROAS.\n\nRecommended next step: confirm Original replenishment before increasing spend. Test morning-routine variations; results show association, not causation.\n\nSources: daily, inventory and creatives SQLite tables. Creative and stock snapshots are independent of the selected trading period. No reports have been sent externally.`;}
