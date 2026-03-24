import type {VercelRequest, VercelResponse} from '@vercel/node';

interface EvaluateRequest {
  answer: string;
  rubric: string;
  question: string;
  accessCode: string;
  sectionId?: string;
}

interface EvaluationResult {
  passed: boolean;
  score: number;
  great: string;
  improvement: string;
}

function getValidCodes(): string[] {
  const raw = process.env.EVALUATION_ACCESS_CODES || process.env.EVALUATION_ACCESS_CODE || '';
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS headers for Docusaurus dev server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method not allowed'});
    return;
  }

  const {answer, rubric, question, accessCode} = req.body as EvaluateRequest;

  if (!answer || !rubric || !question || !accessCode) {
    res.status(400).json({error: 'Missing required fields'});
    return;
  }

  const validCodes = getValidCodes();
  if (validCodes.length === 0 || !validCodes.includes(accessCode)) {
    res.status(401).json({error: 'Invalid access code'});
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({error: 'Evaluation service not configured'});
    return;
  }

  if (answer.length > 5000) {
    res.status(400).json({error: 'Response too long. Keep it under 5000 characters.'});
    return;
  }

  try {
    const evaluation = await evaluateWithClaude(apiKey, question, answer, rubric);
    res.status(200).json(evaluation);
  } catch (err) {
    console.error('Evaluation error:', err);
    res.status(500).json({error: 'Evaluation failed. Please try again.'});
  }
}

async function evaluateWithClaude(
  apiKey: string,
  question: string,
  answer: string,
  rubric: string,
): Promise<EvaluationResult> {
  const systemPrompt = `You are an encouraging interview coach reviewing a workshop participant's response. Your goal is to help them learn and improve, not to grade them harshly.

Your style:
- Be generous. If they're making an effort and showing understanding, that counts. Imperfect wording, abbreviations, shorthand, and rough phrasing are all fine.
- Always find specific things they did well — not generic praise like "good job" but concrete: "You captured the key data point about 47 failures" or "Good instinct to ask about the timeline."
- Improvement suggestions should be actionable and brief. One or two specific things they could add or change.
- Keep each section to 1-3 short sentences. Brief lines, not paragraphs.

You are evaluating UNDERSTANDING, not perfection. Someone who captures the key concept in messy shorthand shows more understanding than someone who writes nothing.`;

  const userPrompt = `Review this workshop participant's response.

EXERCISE QUESTION:
${question}

WHAT A STRONG ANSWER DEMONSTRATES (rubric for your eyes only — do not quote this to the participant):
${rubric}

PARTICIPANT'S RESPONSE:
${answer}

Respond with EXACTLY this JSON format, nothing else:
{
  "passed": true or false,
  "score": 0-100,
  "great": "What they did well — be specific, 1-3 brief lines",
  "improvement": "1-2 concrete suggestions for improvement — brief and actionable"
}

Scoring — be generous:
- 80-100: Shows clear understanding. Core concepts are present even if rough.
- 60-79: On the right track. Has the main idea but missing a piece.
- 40-59: Some effort shown but key concepts are absent.
- 0-39: Doesn't engage with the exercise.

Set "passed" to true if score >= 60.

Keep "great" and "improvement" to brief, scannable lines. No long paragraphs.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{role: 'user', content: userPrompt}],
      system: systemPrompt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error('Empty response from Claude API');
  }

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    const result = JSON.parse(jsonMatch[0]);
    return {
      passed: Boolean(result.passed),
      score: Math.max(0, Math.min(100, Number(result.score) || 0)),
      great: String(result.great || ''),
      improvement: String(result.improvement || ''),
    };
  } catch {
    return {
      passed: true,
      score: 60,
      great: content,
      improvement: '',
    };
  }
}
