import { SetStateAction } from "react";

type Props = {
  prompt: string;
  setStoryPages: React.Dispatch<SetStateAction<string[]>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
};

const generateImage = async (prompt: string) => {
  try {
    const response = await fetch(`api/dalle-3`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    const data = await response.json();
    return { imageUrl: data.imageUrl };
  } catch (e) {
    console.log(e);
    return { imageUrl: "", errorMessage: "Failed to generate image" };
  }
};

export const generateStory = async ({
  prompt,
  setStoryPages,
  setLoading,
}: Props) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const {
    text,
    artPrompts,
  }: { text: any; artPrompts: Array<{ original: string; updated: string }> } =
    await response.json();
  console.log("artPrompts:", artPrompts);
  console.log("text", text);

  const pages = text.match(
    /(<img [^>]*\/>)|(<paragraph[^>]*>[\s\S]*?<\/paragraph>\s*<img [^>]*\/>)/g
  );
  setStoryPages(pages);
  setLoading(false);

  let updatedText = text;
  await Promise.all(
    artPrompts.map(async ({ updated: updatedArtPrompt }) => {
      const { imageUrl } = await generateImage(updatedArtPrompt);
      console.log("imageUrl:", imageUrl);
      const imageToReplace = `<img alt="${updatedArtPrompt}"`;
      const outputImage = `<img src="${imageUrl}"`;
      updatedText = updatedText.replace(imageToReplace, outputImage);

      const updatedPages = updatedText.match(
        /(<img [^>]*\/>)|(<paragraph[^>]*>[\s\S]*?<\/paragraph>\s*<img [^>]*\/>)/g
      );
      setStoryPages(updatedPages);
    })
  );
};

export const generatePromptEmbedding = async (prompt: string) => {
  const response = await fetch("/api/openai-embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const {
    embedding,
    errorMessage,
  }: { embedding: Array<number>; errorMessage: string } = await response.json();
  if (errorMessage) {
    return { error: errorMessage };
  }
  return { embedding };
};

export const getEmbeddingMetadata = async (queryVector: Array<number>) => {
  const response = await fetch("/api/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ queryVector }),
  });
  const { metadata, errorMessage } = await response.json();
  return errorMessage ?? metadata;
};
