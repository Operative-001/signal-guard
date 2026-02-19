import { id, nowIso } from './schema.js';

export const db = {
  items: [],
  assessments: [],
  evidence: [],
  decisions: [],
  audit: []
};

export function logAudit(entity_type, entity_id, action, actor='system', metadata={}) {
  db.audit.push({ id: id('aud'), entity_type, entity_id, action, actor, metadata, created_at: nowIso() });
}
