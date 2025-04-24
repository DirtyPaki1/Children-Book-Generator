import { Character } from "../types/character";

type Props = {
  metadata: { text: string };
} & Partial<Character>;

export const getStoryPrompt = (props: Props) => {
  const metadata = { text: "" };
  const { name, age, description } = props;
  const prompt = `
CHARACTER NAME: ${name}
---------
CHARACTER AGE: ${age}
---------
CHARACTER DESCRIPTION: ${description}
---------
TASK: 
- Write an engaging short children book story.
- Please break down the story into parts, each part should be illustrated by one piece of art in the final book.
- Each part should take place in a different location.
- Interleave each parts with a detailed art prompt for an AI art-generator, but don't mention the name of the character in the prompts.
- Start with a detailed description of the main character of the story, but don't mention their name.
----------
EXAMPLE STORY:
You can take inspiration from this story to write your own:

${metadata.text}

----------
OUTPUT FORMAT:
<character-description>
--YOUR DETAILED CHARACTER DESCRIPTION HERE--
</character-description>
<art-prompt>
--YOUR FRONT COVER ART PROMPT HERE--
</art-prompt>
<paragraph number=1>
--YOUR TEXT HERE--
</paragraph>
<art-prompt>
Create an illustration in an anime style inspired, featuring [describe the scene, characters, and key elements]. The artwork should have a whimsical and enchanting aesthetic, with vibrant colors and detailed backgrounds. Characters should have expressive eyes and distinctive features. The environment should be rich in natural elements like lush forests, rolling hills, or quaint villages, with a magical, serene atmosphere. Include elements like [specific objects, animals, or nature elements relevant to your story]. The lighting should be soft and natural, creating a warm and inviting tone. Each illustration should maintain this consistent style, color palette, and level of detail to ensure uniformity across the book.
</art-prompt>
...
<art-prompt>
--YOUR BACK COVER ART PROMPT HERE--
</art-prompt>
----------
EXAMPLE:
<character-description>
The main character is a ${age} year old boy with dark hair, brown eyes, and a big smile. He wears a blue t-shirt, with jeans and sneakers, and a red cap hat. He has the following description: ${description}
</character-description>
<art-prompt>
Create a children book front cover illustration for a story about a child who is is a ${age} year old boy with dark hair, brown eyes, and a big smile. He wears a blue t-shirt, with jeans and sneakers, and a red cap hat. 
</art-prompt>
<paragraph number=1>
${name} was playing around in his garden.
</paragraph>
<art-prompt>
Create an illustration in an anime style, featuring [describe the scene, characters, and key elements]. The artwork should have a whimsical and enchanting aesthetic, with vibrant colors and detailed backgrounds. Characters should have expressive eyes and distinctive features. The environment should be rich in natural elements like lush forests, rolling hills, or quaint villages, with a magical, serene atmosphere. Include elements like [specific objects, animals, or nature elements relevant to your story]. The lighting should be soft and natural, creating a warm and inviting tone. Each illustration should maintain this consistent style, color palette, and level of detail to ensure uniformity across the book
</art-prompt>
<paragraph number=2>
One day, ${name} was watering his plants when he saw a little bird in the tree.
</paragraph>
...
<art-prompt>
Create a children book back cover illustration for a story about a child who is is a ${age} year old boy with dark hair, brown eyes, and a big smile. He wears a blue t-shirt, with jeans and sneakers, and a red cap hat.
</art-prompt>
`;
  return prompt;
};
