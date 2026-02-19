export const schema = {
  Item: ['id','source','source_id','community_id','author_id','content','created_at','status'],
  Assessment: ['item_id','score','confidence','reasons','policy_version','assessed_at'],
  Evidence: ['item_id','snippets','similar_items','feature_snapshot'],
  ReviewDecision: ['item_id','reviewer_id','decision','rationale','decided_at'],
  AuditEvent: ['id','entity_type','entity_id','action','actor','metadata','created_at']
};

export function nowIso(){ return new Date().toISOString(); }
export function id(prefix='id'){ return `${prefix}_${Math.random().toString(36).slice(2,10)}`; }
