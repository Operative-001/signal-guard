# Signal Guard Architecture (DESIGN)

_Date: 2026-02-19_

## 1) Objective
Signal Guard is an evidence-first trust triage system for community operations. It scores likely low-trust/AI-slop content, explains why, and routes items into a reviewer workflow with an audit trail.

## 2) System context

```text
[Community Inputs]
  Reddit/Discord/Forum/Webhooks
          |
          v
   [Ingestion Connectors] ---> [Normalization]
          |                          |
          v                          v
   [Feature Extractor] ------> [Risk Scoring Engine]
          |                          |
          +-------> [Evidence Pack Builder]
                               |
                               v
                       [Reviewer Queue API]
                         /      |      \
                        v       v       v
                   [Web UI] [Slack] [Discord]
                          \     |     /
                           v    v    v
                         [Decision Store + Audit Log]
```

## 3) Core components

1. **Ingestion Layer**
   - Pulls candidate posts/messages from configured sources
   - Supports batch + near-real-time webhook mode
   - Idempotent fetch with source offsets/cursors

2. **Normalization Service**
   - Canonical schema: `source`, `author`, `channel`, `content`, `metadata`
   - Strips markup, extracts links, language hints, attachments

3. **Feature Extractor**
   - Signals: novelty score, duplication cluster, citation quality, language entropy, account behavior, policy keyword flags
   - Output: feature vector + interpretable feature notes

4. **Risk Scoring Engine**
   - Computes trust-risk score (0–100)
   - Confidence banding (`LOW`,`MEDIUM`,`HIGH`)
   - Policy-aware thresholds per community/channel

5. **Evidence Pack Builder**
   - Generates human-review packet:
     - top reasons
     - nearest similar posts
     - source metadata
     - policy rule hits

6. **Reviewer Workflow API/UI**
   - Queue: `approve | reject | escalate | request-info`
   - Bulk actions + SLA aging + assignment

7. **Notification Integrations**
   - Slack/Discord digests and urgent pings
   - Escalation for stale/high-risk items

8. **Audit & Analytics**
   - Immutable decision trail (who/when/why)
   - Metrics: load, false positives, turnaround time, agreement rate

## 4) Data model (MVP)

- `Item(id, source, source_id, community_id, author_id, content, created_at)`
- `Assessment(item_id, score, confidence, reasons_json, policy_version, assessed_at)`
- `Evidence(item_id, snippets_json, similar_items_json, feature_snapshot_json)`
- `ReviewDecision(item_id, reviewer_id, decision, rationale, decided_at)`
- `AuditEvent(id, entity_type, entity_id, action, actor, metadata, created_at)`

## 5) Decision flow

1. Ingest item
2. Normalize + extract features
3. Score against policy thresholds
4. Build evidence pack
5. Route:
   - score < low threshold -> auto-allow (sampled QA)
   - mid band -> human review queue
   - high band -> priority review + mod ping
6. Record decision and feedback loop to threshold tuning

## 6) Security model

- Tenant/community isolation by `community_id`
- Least privilege integration tokens
- External content treated as untrusted input
- Signed audit entries / immutable append-only log
- PII minimization + retention policy per source

## 7) Reliability + ops

- Queue-based processing with retries + DLQ
- Idempotent ingestion to prevent duplicate triage
- Observability: traces from ingestion -> score -> decision
- SLO target (MVP): 95% items triaged in < 5 min from ingestion

## 8) Build handoff contract (for swarm-dev)

MVP must include:
1. One source connector (Discord webhook or Reddit ingest)
2. Scoring + reasons API
3. Reviewer queue endpoint and simple UI
4. Slack digest integration
5. Audit logging for every decision
