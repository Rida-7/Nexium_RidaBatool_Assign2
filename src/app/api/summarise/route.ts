import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import { translateToUrdu } from '@/lib/translateUrdu';

function generateStaticSummary(text: string, sentenceCount: number = 3): string {
  const sentences = text.match(/[^.!?]+[.!?]/g) || [];
  const wordFreq: Record<string, number> = {};

  text.toLowerCase().split(/\W+/).forEach(word => {
    if (word.length > 3) wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  const scored = sentences.map(sentence => {
    const words = sentence.toLowerCase().split(/\W+/);
    const score = words.reduce((acc, w) => acc + (wordFreq[w] || 0), 0);
    return { sentence, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .map(s => s.sentence.trim())
    .join(' ');
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    console.log("Blog URL:", url);

    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    console.log("Trying Readability...");
    const reader = new Readability(document);
    const parsed = reader.parse();

    let text = parsed?.textContent?.trim() || '';
    console.log(" Readability length:", text.length);

    // if Readability fails or is too short
    if (!text || text.length < 300) {
      console.log(" Readability failed. Fallback to DOM parsing...");

      // Remove other elements
      ['script', 'style', 'nav', 'header', 'footer', 'form', 'noscript', 'aside'].forEach(tag => {
        document.querySelectorAll(tag).forEach(el => el.remove());
      });

      // all relevant content elements
      const selectors = [
        'article', 'main', 'section', '.content', '.post-content', '.entry-content',
        '.blog-post', '.sqs-html-content', '.sqs-block-content', '#content'
      ];

      const blocks: string[] = [];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = Array.from(el.querySelectorAll('p, h1, h2, h3, blockquote'))
            .map(p => p.textContent?.trim() || '')
            .filter(t => t.length > 40 && !t.includes('{') && !t.includes('function'));
          if (text.length) blocks.push(text.join(' '));
        });
      });

      if (blocks.length) {
        text = blocks.join('\n\n');
      } else {
        text = Array.from(document.querySelectorAll('p'))
          .map(p => p.textContent?.trim() || '')
          .filter(t => t.length > 40)
          .join('\n\n');
      }
    }

    const cleanText = text.replace(/\s+/g, ' ').trim();
    console.log("📜 Cleaned Text Length:", cleanText.length);
    console.log("🧾 Sample Text:", cleanText.slice(0, 500));

    if (cleanText.length < 200) {
      throw new Error(" Blog content too short even after fallback parsing.");
    }

    const summary = generateStaticSummary(cleanText, 3);
    const urdu = translateToUrdu(summary);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );

    const { error: supabaseError } = await supabase
      .from('summaries')
      .insert({ url, summary });

    if (supabaseError) {
      throw new Error(`Supabase insert failed: ${supabaseError.message}`);
    }

    const mongo = new MongoClient(process.env.MONGODB_URI!);
    await mongo.connect();
    await mongo.db('blogApp').collection('blogs').insertOne({ url, fullText: cleanText });

    console.log("Blog processed and stored successfully.");
    return NextResponse.json({ summary, urdu });

  } catch (error: any) {
    console.error(" ERROR:", error.message || error);
    return NextResponse.json(
      { error: error.message || 'Failed to summarize blog' },
      { status: 500 }
    );
  }
}
