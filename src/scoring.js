export function extractFeatures(text='') {
  const links = (text.match(/https?:\/\//g) || []).length;
  const exclaim = (text.match(/!/g) || []).length;
  const repeat = /(\b\w+\b)(?:\s+\1){2,}/i.test(text) ? 1 : 0;
  const long = text.length > 400 ? 1 : 0;
  return { links, exclaim, repeat, long };
}

export function scoreContent(text='') {
  const f = extractFeatures(text);
  let score = 20;
  score += f.repeat ? 25 : 0;
  score += f.exclaim > 6 ? 15 : 0;
  score += f.links === 0 ? 10 : 0;
  score += f.long ? 10 : 0;
  const bounded = Math.max(0, Math.min(100, score));
  const confidence = bounded >= 70 ? 'HIGH' : bounded >= 45 ? 'MEDIUM' : 'LOW';

  const reasons = [];
  if (f.repeat) reasons.push('repetition-pattern');
  if (f.exclaim > 6) reasons.push('excessive-punctuation');
  if (f.links === 0) reasons.push('no-citations');
  if (f.long) reasons.push('overlong-content');
  if (reasons.length === 0) reasons.push('low-risk-baseline');

  return { score: bounded, confidence, reasons, features: f };
}
