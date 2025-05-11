import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

// Modified regex to be ES2018 compatible
const getCharacterDescription = (
  input: string | undefined
): string | undefined => {
  if (!input) return undefined;
  const regex = /<character-description>([\s\S]*?)<\/character-description>/;
  const match = input.match(regex);
  return match?.[1]?.trim();
};

// Modified regex to be ES2018 compatible
const getArtPrompts = (input: string | undefined): string[] => {
  if (!input) return [];
  const regex = /<art-prompt>([\s\S]*?)<\/art-prompt>/g;
  const results: string[] = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    if (match[1]) {
      results.push(match[1].trim());
    }
  }
  return results;
};

const getUpdateText = async (
  text: string | undefined,
  artPrompts: Array<{ original: string; updated: string }>
) => {
  if (!text) return { modifiedInput: "", imageJobIds: [""] };
  let modifiedInput = text;
  
  // Remove character description section
  const descEnd = modifiedInput.indexOf("</character-description>");
  if (descEnd !== -1) {
    modifiedInput = modifiedInput.slice(descEnd + "</character-description>".length);
  }

  // Replace art prompts with image tags
  artPrompts.forEach(({ original, updated }) => {
    const imageBlock = `<img alt="${updated.replace(/"/g, '\\"')}" />`;
    const promptBlock = `<art-prompt>${original}</art-prompt>`;
    modifiedInput = modifiedInput.replace(promptBlock, imageBlock);
  });

  return { modifiedInput };
};

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const { prompt } = body;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a bestseller children book author. 
          You use AI art-generator to create illustrations for your books. 
          You are a master at writing prompts for the AI art-generator.
          You write stories under 100 words long.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let text = response?.choices?.[0]?.message?.content ?? "";
    const artPrompts = getArtPrompts(text);
    const characterDescription = getCharacterDescription(text);

    const artPromptsObject = artPrompts.map((prompt) => ({
      original: prompt,
      updated: `${prompt} The art should capture the essence of a serene and enchanting anime world with a high level of detail and clarity, akin to the aesthetic seen in Studio Ghibli films.
      The colors should be vivid and saturated, with a focus on strong light and shadow contrasts to create a sense of depth and dimensionality. The overall feel should be one of uplifting tranquility
      and the simple joy of a moment of solitude in nature. ${characterDescription || ""}`,
    }));

    const { modifiedInput } = await getUpdateText(text, artPromptsObject);
    
    return NextResponse.json({ 
      text: modifiedInput, 
      artPrompts: artPromptsObject 
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}