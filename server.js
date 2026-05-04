const express = require('express');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'TechScreening demo backend is running.' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, lang, qTitle, qPrompt } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write(`data: ${JSON.stringify({ chunk: '(Simulated) Hmm... ' })}\n\n`);
      setTimeout(() => res.write(`data: ${JSON.stringify({ chunk: `You said: "${message}". ` })}\n\n`), 500);
      setTimeout(() => { res.write(`data: [DONE]\n\n`); res.end(); }, 1000);
      return;
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are a human technical interviewer conducting a coding interview for ${lang}. The question is: "${qTitle} - ${qPrompt}". Speak like a human interviewer. Use short sentences. Add pauses using "..." naturally. Occasionally use fillers like "Hmm...", "Alright...", "Let's see...". Avoid long paragraphs. Be conversational.` },
        { role: "user", content: message }
      ],
      stream: true,
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'OPENAI_API_KEY is not set' });
    }
    
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length
    });
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
