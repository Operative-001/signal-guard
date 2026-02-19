# Signal Guard

Evidence-first trust triage for community ops.

## Round 1 scope
- Canonical schema (`Item`, `Assessment`, `Evidence`, `ReviewDecision`, `AuditEvent`)
- Config/env bootstrap
- Minimal API skeleton
- Test pipeline

## MVP contract scaffolding included
- Source connector endpoint: `POST /ingest/discord`
- Scoring + reasons API: `POST /assess`
- Reviewer queue endpoint: `GET /queue` and decision endpoint `POST /decision`
- Simple reviewer UI: `GET /ui`
- Slack digest integration: `POST /digest/slack`
- Audit logging for all actions: `GET /audit`

## Run
```bash
node src/server.js
# server on :8787
```
