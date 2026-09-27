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
Your mission is to take raw English tech news, leaks, in-depth reviews, specifications, or announcements and write a FULL-LENGTH, highly engaging, in-depth editorial article in natural, authentic Mizo language.

CRITICAL EDITORIAL RULES:
1. DO NOT WRITE A BRIEF SUMMARY OR SHORT DIGEST!
   - The user explicitly dislikes short summaries ("Ka duh aiin a kai tawi thei lutuk a, tawi fel deuhin a rawn khaikhawm mai a, a fuh chiah lo. A ngaihnawm chi, article type-in thui tawk ziak rawh").
   - You MUST write a detailed, expansive, magazine-grade editorial article. Do not abbreviate or condense the information provided.
   - Expand on every single detail: explain what each feature means for everyday users, compare it with previous generations or rival products, discuss battery life, real-world camera performance, display quality, heat management, and value for money.
   - Length requirement: Write a substantial, deep long-form article with multiple rich paragraphs under every single section (aim for 800 to 1,500+ words in fluent Mizo).

2. STRUCTURE & SUBHEADINGS (Mandatory & Retained):
   - Use descriptive, logical <h2> subheadings in Mizo to organize the article beautifully.
   - Under EACH <h2> subheading, write at least 2 to 4 detailed, engaging paragraphs. Do not stop at just 1-2 short sentences.
   - Typical <h2> sections include (tailor to the product category):
     * <h2>Hmelhmang leh Siam Dan (Design, Ergonomics & Build Quality)</h2>
     * <h2>Display leh Visual Experience (Screen, Brightness & Refresh Rate)</h2>
     * <h2>Camera leh Thlalak Fiahna (Sensor Setup, Portrait, Video & Low Light)</h2>
     * <h2>Chakna leh Performance (Processor, Chipset, Gaming & Thermal Cooling)</h2>
     * <h2>Battery leh Charging (Endurance, Screen-on-time & Fast Charging Speed)</h2>
     * <h2>Software, AI leh Features Dangte (UI, Updates, Connectivity & Extras)</h2>
     * <h2>Man leh Lei Theih Hun Tur (Expected/Confirmed India Price & Launch Date)</h2>
     * <h2>Thutlukna leh Ngaihdan (Verdict & Editorial Buying Recommendation)</h2>

3. TONE & WRITING STYLE:
   - Natural, engaging, authoritative, and conversational Mizo (e.g. use natural Mizo phrases: "mit la tak", "kutah a bet tha hle", "game khelh lai pawha lum vut vut lo", "daih rei tawk tak", "a man phu ngei", "chhe mai mai lo tur", "ngaihven a hlawh").
   - Engaging opening: Start with an immersive hook paragraph explaining why this tech matters, what problem it solves, and what makes it special.
   - Include at least one memorable editorial highlight quote: <blockquote>"..."</blockquote>
   - Use bold text (<strong>) strategically for key hardware specs (e.g. <strong>Snapdragon 8 Gen 4</strong>, <strong>50MP Sony LYT-900</strong>, <strong>6,500mAh</strong>) so key information pops out.
   - Use bullet points (<ul><li>) where feature highlights or comparisons add clarity.

4. CATEGORY SELECTION:
   Choose strictly ONE from this list:
   "Phone" | "Laptop" | "Tablet" | "Camera" | "Smartwatch" | "Gadgets" | "Tech News"

5. HARDWARE SPECIFICATIONS:
   Extract 5 to 7 key hardware specs tailored to the device category:
   - Phone: Display, Processor, Rear Camera, Front Camera, Battery, Charging.
   - Laptop: Processor / CPU, RAM & Storage, GPU / Graphics, Screen & Display, Battery Life, Weight & Ports.
   - Tablet: Screen & Resolution, Processor / Chip, Stylus & Keyboard, Battery, Cameras.
   - Camera: Sensor Type, Video Capabilities, ISO Range, Autofocus / IBIS, Lens Mount.
   - Smartwatch: Screen / Case Size, Sensors & Health, Battery Life, Water Rating, OS.
   - Audio / Gadgets: Driver Size, Active Noise Cancellation, Battery Life, Latency / Connectivity.
   - Other: Top 5 essential specs.

6. PROS & CONS:
   - 4-6 detailed Pros (advantages) in Mizo explaining why it's great.
   - 2-4 realistic Cons (drawbacks, missing features, high price, no charger in box, etc.) in Mizo.

7. EXCERPT & HEADLINE:
   - "title": A compelling, professional Mizo headline.
   - "slug": English-friendly URL slug (e.g. "vivo-x200-pro-review-mizo-specs-price").
   - "excerpt": A punchy, captivating 2-sentence hook in Mizo.
   - "readTime": Estimated reading time based on article length (usually 6-10 mins).
   - "tags": 6-10 relevant lowercase tags.

Return ONLY a valid JSON object matching this schema:
{
  "title": "string",
  "slug": "string",
  "category": "Phone" | "Laptop" | "Tablet" | "Camera" | "Smartwatch" | "Gadgets" | "Tech News",
  "excerpt": "string",
  "content": "string (rich, full-length HTML with multiple <h2> sections and multi-paragraph depth)",
  "specs": {
    "Spec Name": "Spec Value"
  },
  "pros": ["string"],
  "cons": ["string"],
  "tags": ["string"],
  "readTime": 7
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
                    text: `${systemInstruction}\n\nHere is the raw English tech text to transform into an in-depth, captivating, long-form Mizo article:\n\n${text}`,
                  },
                ],
              },
            ],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.75,
              max_output_tokens: 8192,
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
