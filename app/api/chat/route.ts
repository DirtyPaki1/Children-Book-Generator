import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const getCharacterDescription = (
  input: string | undefined
): string | undefined => {
  if (!input) return undefined;
  const regex = /<character-description>\s*(.*?)\s*<\/character-description>/s;
  const match = input.match(regex);
  console.log("match:", match);
  return match?.[1];
};

const getArtPrompts = (input: string | undefined): string[] => {
  if (!input) return [];
  const regex = /<art-prompt>(.*?)<\/art-prompt>/gs;
  let match;
  const results: string[] = [];
  while ((match = regex.exec(input)) !== null && match[1] !== undefined) {
    results.push(match[1].trim());
  }

  return results;
};

const getUpdateText = async (
  text: string | undefined,
  artPrompts: Array<{ original: string; updated: string }>
) => {
  if (!text) return { modifiedInput: "", imageJobIds: [""] };
  let modifiedInput = text;
  modifiedInput =
    modifiedInput.split("</character-description>")[1] || modifiedInput; // remove character description

  artPrompts.forEach(({ original, updated }) => {
    const imageBlock = `<img alt="${updated}" />`;
    const promptBlock = `<art-prompt>\n${original}\n</art-prompt>`;
    modifiedInput = modifiedInput.replace(promptBlock, imageBlock);
  });

  return { modifiedInput };
};

export async function POST(req: Request, res: Response) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const body = await req.text();
  const { prompt } = JSON.parse(body);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a bestseller children book author. " +
          "You use AI art-generator to create illustrations for your books. " +
          "You are a master at writing prompts for the AI art-generator." +
          "You write stories under 100 words long.",
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
  const artPromptsObject = artPrompts.map((prompt) => {
    return {
      original: prompt,
      updated: `${prompt} The art should capture the essence of a serene and enchanting anime world with a high level of detail and clarity, akin to the aesthetic seen in Studio Ghibli films.
The colors should be vivid and saturated, with a focus on strong light and shadow contrasts to create a sense of depth and dimensionality. The overall feel should be one of uplifting tranquility
and the simple joy of a moment of solitude in nature. ${characterDescription}`,
    };
  });
  console.log("characterDescription:", characterDescription);
  const { modifiedInput } = await getUpdateText(text, artPromptsObject);
  text = modifiedInput;
  return NextResponse.json({ text, artPrompts: artPromptsObject });
}
