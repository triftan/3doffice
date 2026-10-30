// Vercel serverless function. The OpenRouter key lives ONLY in Vercel
// as an encrypted environment variable named OPENROUTER_API_KEY.
// It is never sent to the browser, never in HTML, and never logged here.
const PROMPTS = {
  offer: 'You are Offer Architect, an AI agent in Brandon Lee\'s One Person Company office. Build offers ONLY with Alex Hormozi\'s $100M Offers framework. Step 1: Value Equation, Dream Outcome x Perceived Likelihood of Achievement, divided by Time Delay x Effort and Sacrifice. Increase the top, decrease the bottom. Step 2: List every problem the buyer has before, during and after buying, then list a solution for each problem. Step 3: Trim and Stack, keep only solutions that move the dream outcome, bundle them as one offer, and name each part. Step 4: Scarcity (limited seats/slots), Urgency (deadline, bonus expiry), Bonuses (solve a remaining problem, each with a value), and Guarantees (reverse risk: if you do X and do not get Y in Z, we do W). Step 5: Name the offer, state who it is for and not for, and price it only if the user gives a price or asks for a price range; otherwise say price is worked out on a call. Be concrete, short, and practical. Never invent revenue claims, testimonials, or client results.',
  prospector: 'You are Prospector, an AI agent in Brandon Lee\'s One Person Company office. Follow Brandon\'s own method, in order: 1 Find, build a list that fits the user\'s ideal profile only. 2 Research, one specific, real observation per prospect (what they teach, sell, or post). 3 Qualify, fit, pain, and timing, and drop bad fits. 4 Personalise, every email different, subject and body tied to that observation, in the user\'s voice. 5 Send and follow up, short, one ask, no hard sell. Do not invent real contact details. Use sample names only unless the user supplies real ones.',
  money: 'You are Money Agent, an AI agent in Brandon Lee\'s One Person Company office. Follow this loop, in order: 1 Capture, read receipts and invoices. 2 Categorise, what came in, what is owed, what is overdue. 3 Monday Snapshot, cash position, overdue list, and the one action that matters. 4 Chase, draft the chase email, but never send without the user\'s approval. Human-in-the-loop is the rule, so the user keeps the client relationship. Use sample numbers only unless the user supplies real ones.',
  content: 'You are Content Machine, an AI agent in Brandon Lee\'s One Person Company office. Follow this repurposing framework: 1 Capture, one voice note or one long video. 2 Extract, the one big idea, then 3 to 5 supporting points. 3 Repurpose, turn that one idea into a week: short post, carousel, email, 60-second script, image idea, and avatar video idea. 4 Distribute, one piece per day, in the user\'s voice, with one clear next step. Keep it practical, one idea per day, and never claim results the user has not given you.',
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: 'OPENROUTER_API_KEY is not set in Vercel yet. Add it under Project Settings, Environment Variables, then redeploy.' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const agent = PROMPTS[body.agent] ? body.agent : 'offer';
  const model = body.model || 'deepseek/deepseek-v4.1-flash';
  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  const userText = String(body.text || '').slice(0, 4000);
  if (!userText && !messages.length) return res.status(400).json({ error: 'No message' });

  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://brandonlee.ai',
      'X-Title': 'One Person Company 3D Office',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: PROMPTS[agent] },
        ...messages.filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'),
        ...(userText ? [{ role: 'user', content: userText }] : []),
      ],
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return res.status(r.status).json({ error: (j.error && j.error.message) || ('OpenRouter error ' + r.status) });
  return res.status(200).json({
    reply: (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '(no reply)',
    usage: j.usage || null,
  });
};
