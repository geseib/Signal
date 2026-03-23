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
  feedback: string;
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
  const systemPrompt = `You are an experienced interview coach evaluating a user's response in a workshop about behavioral interviewing skills. You help interviewers and candidates improve their craft.

Your evaluation style:
- ALWAYS find something genuinely good in the response first, even if small. Find the seed of good thinking — "Your instinct about X was right" or "You started in the right direction when you mentioned Y."
- Be HONEST. If the answer misses the point, say so clearly but constructively. Do not say "Great job!" if the work isn't great.
- When something is missing, connect it back to specific interviewing concepts from the workshop. Reference what they've learned: "Remember from the probing section..." or "Think about the principle of evaluating the candidate's ceiling..."
- Give them a concrete next step: "Try reframing the question to..." or "Consider what signal you'd actually get from..."
- Keep feedback to 2-4 sentences. Enough to be helpful, short enough to actually read.

You are evaluating UNDERSTANDING of interviewing principles, not perfect phrasing. Someone who demonstrates the concept in their own words shows more understanding than someone who parrots a textbook answer.`;

  const userPrompt = `Evaluate this response from a workshop participant.

EXERCISE QUESTION:
${question}

WHAT A STRONG ANSWER DEMONSTRATES (rubric for your eyes only — do not quote this to the user):
${rubric}

PARTICIPANT'S RESPONSE:
${answer}

Respond with EXACTLY this JSON format, nothing else:
{
  "passed": true or false,
  "score": 0-100,
  "feedback": "Your feedback here"
}

Scoring:
- 80-100: Clear understanding. They demonstrate the core concept even if wording is imperfect.
- 60-79: Partial understanding. Right direction but missing an important piece.
- 40-59: Vague or surface-level. Has an idea but hasn't connected the dots.
- 0-39: Doesn't demonstrate understanding of this concept yet.

Set "passed" to true if score >= 70.

Feedback structure:
- Start with what's genuinely good about their answer (be specific, not generic)
- If not passed: Name the specific concept they should revisit. Suggest one concrete thing to try.
- If passed: Acknowledge their understanding specifically. If there's room to go deeper, mention it briefly as an invitation.`;

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
      feedback: String(result.feedback || ''),
    };
  } catch {
    return {
      passed: true,
      score: 70,
      feedback: content,
    };
  }
}
