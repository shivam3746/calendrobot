'use server'

import FirecrawlApp from '@mendable/firecrawl-js';
import { extractRelevantEventMarkdown, extractJsonFromCodeBlock } from './utils';
import { InferenceClient } from "@huggingface/inference";

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});

const client = new InferenceClient(process.env.HF_TOKEN);

async function scrape(url: string): Promise<string> {

  console.log("🔍 Scraping URL:", url);
  const result = await app.crawlUrl(url, {
    limit: 100,
    scrapeOptions: {
      formats: ['markdown'],
      onlyMainContent: false,
      maxAge: 3600000
    }
  })

  // console.log("Result content:", result)

  if (!result.success) {
    console.error("🔥 Firecrawl failed:", result.error);
    throw new Error(result.error);
  }

  return result.data[0]?.markdown || '';
  
}

export async function getCategoryOnly(url: string): Promise<string> {
  const content = await scrape(url);
  const cleanMarkdown = extractRelevantEventMarkdown(content);

  const prompt = `
Given the following content from a calendar event page, classify it into one of:
"Meeting", "Webinar", "Interview", "Sales Call", "Training", "Tech Talk"

Return only the category as a string.

---
${cleanMarkdown.slice(0, 1000)}
  `;

  try {

    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [{ role: "user", content: prompt }],
    });


    const result = chatCompletion.choices[0]?.message?.content?.trim();

    const cleaned = extractJsonFromCodeBlock(result!);
    const parsed = JSON.parse(cleaned);

    return parsed.category || "Meeting";

  } catch (err) {
    console.error("❌JSON parse error:", err);
    throw new Error("Failed to get valid OpenAI response.");
  }
}

export async function getCategoryAndDescription(url: string): Promise<{
  category: string;
  description: string;
}> {
  const content = await scrape(url);
  const cleanMarkdown = extractRelevantEventMarkdown(content);

  const prompt = `
You're an assistant that helps users create calendar events.

From the content below, extract:
1. A category (one of): "Meeting", "Webinar", "Interview", "Sales Call", "Training", "Tech Talk"
2. A short 1–2 sentence event description.

Respond in JSON:
{
  "category": "...",
  "description": "..."
}

---
${cleanMarkdown.slice(0, 1000)}
`;

  //console.log("📝 Prompt:\n", prompt);

  try {

    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [{ role: "user", content: prompt}],
    });

    const result = chatCompletion.choices[0]?.message?.content?.trim();
    //console.log("🧠 OpenAI raw result:", result);

    const cleaned = extractJsonFromCodeBlock(result!);
    const parsed = JSON.parse(cleaned);

    return {
      category: parsed.category || "Meeting",
      description: parsed.description || "",
    };
  } catch (err) {
    console.error("❌JSON parse error:", err);
    throw new Error("Failed to get valid OpenAI response.");
  }
}
