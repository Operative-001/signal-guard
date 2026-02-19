# Signal Guard Roadmap (10 Rounds)

_Date: 2026-02-19_

## Round 1 — Skeleton + Canonical Schema
- Repo scaffolding, CI, lint/test pipeline
- Define canonical `Item/Assessment/Evidence/Decision` schema
- Basic config + env management

## Round 2 — Ingestion v1
- Implement first connector (Discord webhook or Reddit pull)
- Cursor/idempotency support
- Persist raw + normalized payloads

## Round 3 — Feature Extraction v1
- Add deterministic feature extractors:
  - duplication similarity
  - link/citation signals
  - verbosity/repetition heuristics
- Feature trace output for explainability

## Round 4 — Scoring Engine v1
- Weighted score with policy thresholds
- Confidence bands + reason codes
- API endpoint: `POST /assess`

## Round 5 — Evidence Pack Builder
- Generate reviewer packet with top reasons + similar items
- Include source metadata and policy hits
- UI/API render format finalized

## Round 6 — Reviewer Queue UI/API
- Queue filters: risk, age, source, assignee
- Actions: approve/reject/escalate/request-info
- Decision persistence and status transitions

## Round 7 — Notification Integrations
- Slack digest + urgent escalations
- Optional Discord mod channel alerts
- Batched notifications with de-dup

## Round 8 — Audit + Governance Controls
- Immutable audit log
- Reviewer activity feed
- Basic policy versioning and change tracking

## Round 9 — Quality Tuning + Guardrails
- Add sampled QA lane for auto-allow items
- False-positive monitoring and threshold tuning
- Performance and failure-mode tests

## Round 10 — Launch Readiness
- Operator runbook + dashboard
- Seed docs (usage, policy tuning, incident response)
- Pilot checklist and success metrics for ADVERTISE phase

---

## Exit criteria for BUILD completion
- End-to-end flow works on at least one real source
- Human review queue functional with evidence packs
- Slack/Discord alerting operational
- Audit trail queryable for every decision
