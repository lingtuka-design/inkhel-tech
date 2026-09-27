interface Env {
  GEMINI_API_KEY?: string;
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { text, apiKey } = (await context.request.json()) as {
      text?: string;
      apiKey?: string;
    };

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Raw text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const key = apiKey?.trim() || context.env.GEMINI_API_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Cloudflare Pages or provided in request.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemInstruction = `
You are an award-winning senior technology journalist and chief gadget editor for iTECH (tech.inkhel.com).
Your mission is to take raw English tech news, smartphone leaks, gadget announcements, or reviews and transform them into a comprehensive, captivating, highly readable article in natural, authentic Mizo language.

CRITICAL GUIDELINES:
1. All prose must be in fluent, idiomatic, natural Mizo (e.g. use natural Mizo tech terms like "tlangzarh", "thlalak fiah tak", "chhe mai mai lo turin", "daih rei", "hralh chhuahna man").
2. Write a captivating headline in Mizo (title) that creates interest without being clickbait.
3. Content MUST be clean semantic HTML string:
   - Start with <p class="lead"> summarizing the biggest news or revelation in 2-3 engaging Mizo sentences.
   - Organize logically with descriptive <h2> subheadings in Mizo (e.g. Design, Display & Screen, Camera & Photography, Performance & Processor, Battery & Charging, Thutlukna / Verdict).
   - Include an editorial highlight quote: <blockquote>"..."</blockquote>
   - Use <p>, <strong>, <em>, <ul>, <li> effectively for easy readability.
   - Conclude with a strong final editorial recommendation under <h2>Thutlukna (Verdict)</h2>.
4. Extract structured Hardware Specifications tailored directly to the device category:
   Return an object of 4 to 6 defining hardware specifications for that specific product:
   - For Phone: { "Display": "...", "Processor": "...", "Camera": "...", "Battery": "...", "Charging": "..." }
   - For Laptop: { "Processor / CPU": "...", "RAM & Storage": "...", "Graphics / GPU": "...", "Display": "...", "Battery Life": "...", "Weight": "..." }
   - For Tablet: { "Display": "...", "Processor": "...", "Stylus & Keyboard": "...", "Cameras": "...", "Battery": "..." }
   - For Camera: { "Sensor": "...", "Video Resolution": "...", "ISO Range": "...", "Stabilization": "...", "Lens Mount": "..." }
   - For Smartwatch: { "Display": "...", "Sensors & Health": "...", "Battery Life": "...", "Water Resistance": "..." }
   - For Microphone: { "Polar Pattern": "...", "Frequency Response": "...", "Connectivity": "...", "Weight": "..." }
   - For Earbuds/Audio: { "Driver Size": "...", "Noise Cancellation": "...", "Battery Life": "...", "Connectivity": "..." }
   - For Other Gadgets: Extract the 4-6 most essential specs mentioned in the source.
5. Provide 3-5 Pros (advantages) in Mizo.
6. Provide 1-3 Cons (drawbacks, high price, missing charger, etc.) in Mizo.
7. Return an appropriate Category chosen strictly from this list:
   - "Phone"
   - "Laptop"
   - "Tablet"
   - "Camera"
   - "Smartwatch"
   - "Gadgets"
   - "Tech News"
8. Return 5-8 relevant lowercase tags.

Return ONLY a valid JSON object matching this schema:
{
  "title": "string",
  "slug": "string",
  "category": "Phone" | "Laptop" | "Tablet" | "Camera" | "Smartwatch" | "Gadgets" | "Tech News",
  "excerpt": "string",
  "content": "string (valid HTML)",
  "specs": {
    "Spec Name": "Spec Value"
  },
  "pros": ["string"],
  "cons": ["string"],
  "tags": ["string"],
  "readTime": 5
}
`;

    // Prioritize high-availability, low-latency models with robust fallbacks
    const CANDIDATE_MODELS = [
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.7-flash',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];

    let geminiData: any = null;
    let lastError: string = '';

    for (const model of CANDIDATE_MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${systemInstruction}\n\nHere is the raw English tech text to transform into a Mizo article:\n\n${text}`,
                  },
                ],
              },
            ],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.7,
            },
          }),
        });

        if (res.ok) {
          geminiData = await res.json();
          break;
        } else {
          const errText = await res.text();
          lastError = errText;
          // If busy/rate-limited (503 / 429), pause briefly before trying next model
          if (res.status === 503 || res.status === 429) {
            await new Promise((r) => setTimeout(r, 400));
          }
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!geminiData) {
      return new Response(
        JSON.stringify({
          error: `Google Gemini server-ah traffic a tam thut (high demand) a ni e. Second tlemte hnuah hmet nawn leh rawh le: ${lastError}`,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const rawOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawOutput) {
      return new Response(JSON.stringify({ error: 'No response generated by Gemini' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsed = JSON.parse(rawOutput);

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
