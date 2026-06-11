import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { industry, description, style, sessionId } = await req.json();

    if (!description || description.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a description (at least 3 characters)" },
        { status: 400 }
      );
    }

    const styleGuide: Record<string, string> = {
      creative: "creative, unique, memorable, playful names that stand out",
      professional: "professional, trustworthy, authoritative names that convey expertise",
      tech: "modern, tech-savvy, innovative names with digital appeal",
      friendly: "warm, approachable, friendly names that feel welcoming",
      minimal: "short, minimal, clean names that are easy to remember (1-2 syllables preferred)",
    };

    const selectedStyle = styleGuide[style] || styleGuide.creative;

    const prompt = `You are a world-class branding expert. Generate 15 unique business names for the following:

Industry: ${industry || "General Business"}
Description: ${description}
Style: ${selectedStyle}

Requirements:
- Generate exactly 15 business names
- Each name should be unique, memorable, and brandable
- Include a mix of real words, portmanteaus, and invented words
- Each name should be suitable for domain registration
- For each name, provide: name, tagline (max 8 words), and a score (1-10) for memorability, pronounceability, and brandability

Respond in this exact JSON format:
{
  "names": [
    {
      "name": "BrandName",
      "tagline": "Short catchy tagline here",
      "scores": {
        "memorability": 8,
        "pronounceability": 9,
        "brandability": 8
      },
      "overall": 8.3
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a world-class branding and naming expert. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    const names = parsed.names || [];

    // Save to DB (fire and forget, don't block response)
    prisma.nameGeneration
      .create({
        data: {
          industry: industry || "General",
          description,
          style: style || "creative",
          names: names,
          sessionId: sessionId || null,
        },
      })
      .catch(console.error);

    return NextResponse.json({ names, success: true });
  } catch (error) {
    console.error("Error generating names:", error);
    return NextResponse.json(
      { error: "Failed to generate business names. Please try again." },
      { status: 500 }
    );
  }
}
