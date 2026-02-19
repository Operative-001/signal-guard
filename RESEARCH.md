# Signal Guard — VALIDATE Research

_Date: 2026-02-19_

## Product hypothesis
Signal Guard is **trust triage for community operations**: detect likely AI slop/low-trust submissions, produce an explainable score + evidence pack, and route to human reviewers in existing workflows.

---

## 1) WHO uses this?

### Primary personas
1. **Community Moderators** (Reddit/Discord/forum maintainers)
   - Need to keep feed quality high with limited volunteer/part-time capacity.
   - Pain is less “spam volume” and more “ambiguous low-quality AI content that erodes trust.”

2. **DevRel / Community Managers**
   - Run technical communities around products and docs.
   - Need to preserve signal in Q&A/feedback channels without alienating legitimate users.

3. **Ops / Trust & Safety teams**
   - Own policy enforcement and incident queue quality.
   - Need auditable moderation decisions and reproducible rationale.

---

## 2) WHAT is their pain?

- **Manual review burden:** moderators triage too much borderline content manually.
- **Trust collapse risk:** communities perceive quality decline when low-value AI content floods channels.
- **Policy inconsistency:** different mods apply standards differently under pressure.
- **Poor explainability in tooling:** many filters score or block but don’t provide decision evidence that can be audited or appealed.

This is fundamentally an operations workflow problem, not just a model-classification problem.

---

## 3) WHY would they switch?

They switch if Signal Guard delivers:

1. **Explainable scoring, not opaque labels**
   - Each decision includes evidence (duplication patterns, citation gaps, semantic redundancy, style artifacts, account history/context).

2. **Evidence packs for reviewer speed**
   - One-click packet for accept/reject/escalate instead of raw probability-only output.

3. **Workflow-native integration**
   - Slack/Discord/Jira/mod queue integration so teams don’t open another dashboard.

4. **Audit trail + consistency controls**
   - Track why action was taken and by whom; support policy tuning and postmortems.

---

## 4) HOW does it differentiate?

## Not “another spam filter”
Signal Guard should be positioned as:
**Trust triage + moderation operations layer**

### Differentiators
- **Decision transparency:** reason codes + supporting evidence snippets.
- **Human-in-the-loop queueing:** confidence bands route uncertain cases to humans.
- **Policy-aware enforcement:** same content can be treated differently by channel policy.
- **Auditability:** immutable moderation trail for accountability.
- **Outcome metrics:** track reviewer load, false-positive rate, and trust-impact proxies.

---

## Evidence links (Reddit/HN) showing demand signal

> Note: live Reddit API access was partially constrained during this run; evidence includes the currently available Reddit signal plus multiple high-relevance HN discussions that directly cite moderation pain/AI-slop pressure.

1. Reddit (signal source already tracked in pipeline candidate):
- https://www.reddit.com/r/sysadmin/top/?t=week  
  (high-engagement moderation/trust quality discussions are repeatedly surfacing in weekly top content)

2. HN — AI slop moderation pressure:
- https://www.wired.com/story/ai-generated-medium-posts-content-moderation/  
  (surfaced via HN discussions on AI slop flooding publishing platforms)

3. HN — platform quality decay discussion:
- https://news.ycombinator.com/item?id=46603727

4. HN — anti-bot / trust-protection pressure:
- https://news.ycombinator.com/item?id=46544969

5. HN — moderation labor breakdown under AI content load:
- https://gizmodo.com/ai-stack-overflow-content-moderation-chat-gpt-1850505609

6. HN — demand for well-moderated communities / trust filtering:
- https://news.ycombinator.com/item?id=46594856

7. HN — practical community moderation automation demand:
- https://news.ycombinator.com/item?id=42165215

---

## MVP recommendation (what to build first)

1. Ingest candidate items from one source (e.g., Discord or Reddit export/API).
2. Score each item with explainable risk signals.
3. Output reviewer queue: `approve | reject | escalate`.
4. Attach evidence pack per item.
5. Send digest/escalation to Slack/Discord.
6. Persist decision audit trail.

If this reduces moderator handling time while improving consistency, Signal Guard has immediate adoption potential.
