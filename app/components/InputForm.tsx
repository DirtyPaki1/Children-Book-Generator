import { useState, FormEvent } from "react";
import { 
  FaMagic, 
  FaChild, 
  FaBook, 
  FaLightbulb, 
  FaSpinner 
} from "react-icons/fa";

type StoryPage = {
  text: string;
  imageUrl: string;
};

type InputFormProps = {
  setStoryPages: React.Dispatch<React.SetStateAction<StoryPage[]>>;
};

export default function InputForm({ setStoryPages }: InputFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "6",
    description: "",
    theme: "adventure"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getThemeElements = (theme: string) => {
    const elements = {
      adventure: {
        places: ["Deep Jungle", "Ancient Ruins", "Pirate Cove", "Mysterious Island"],
        items: ["treasure map", "golden compass", "old journal", "magic torch"],
        creatures: ["explorer monkey", "talking parrot", "wise turtle", "jungle spirit"],
        actions: ["decode the map", "cross raging rivers", "solve ancient puzzles", "find hidden treasure"]
      },
      fantasy: {
        places: ["Enchanted Forest", "Dragon's Lair", "Cloud Castle", "Crystal Caves"],
        items: ["magic wand", "enchanted book", "crystal ball", "fairy dust"],
        creatures: ["friendly dragon", "mischievous fairy", "wise wizard", "unicorn guide"],
        actions: ["cast protection spells", "brew magic potions", "ride flying carpets", "break evil curses"]
      },
      space: {
        places: ["Alien Planet", "Space Station", "Asteroid Field", "Black Hole"],
        items: ["laser blaster", "star chart", "gravity boots", "alien translator"],
        creatures: ["robot companion", "friendly alien", "cosmic whale", "astro-scientist"],
        actions: ["fix broken engines", "navigate asteroid fields", "communicate with aliens", "activate warp drives"]
      },
      animal: {
        places: ["Whispering Woods", "Sunny Meadow", "Crystal Lake", "Mushroom Village"],
        items: ["golden acorn", "magic honey", "talking flower", "healing berry"],
        creatures: ["wise old owl", "playful squirrel", "singing frog", "mother deer"],
        actions: ["heal sick animals", "organize forest festival", "solve weather mystery", "build treehouse village"]
      }
    };
    return elements[theme as keyof typeof elements] || elements.adventure;
  };

  const generateStoryContent = (): {text: string, keywords: string[]}[] => {
    const { name, age, description, theme } = formData;
    const protagonist = name || (parseInt(age) < 5 ? "Lily" : "Max");
    const ageAdjective = parseInt(age) < 5 ? "little" : "brave";
    const elements = getThemeElements(theme);
    const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    return [
      {
        text: `${ageAdjective} ${protagonist} discovered ${description || random(elements.items)} in ${random(elements.places)}.`,
        keywords: ["discovery", description || random(elements.items), random(elements.places)]
      },
      {
        text: `There, they met ${random(elements.creatures)} who needed help to ${random(elements.actions)}.`,
        keywords: ["meeting", random(elements.creatures), random(elements.actions)]
      },
      {
        text: `Using ${description.split(' ')[0] || "quick thinking"}, they ${random(elements.actions)} with their new friend.`,
        keywords: ["action", description.split(' ')[0] || "solution", random(elements.actions)]
      },
      {
        text: `In the end, ${protagonist} learned that ${getLesson(theme)} and promised to return someday.`,
        keywords: ["resolution", "lesson", "friendship"]
      }
    ];
  };

  const getImageForPage = (keywords: string[], theme: string, index: number): string => {
    const baseUrl = "https://img.freepik.com/free-vector/";
    const [scene, item, location] = keywords;
    const themeKeywords = {
      adventure: {
        discovery: `jungle-discovery-${item.replace(' ', '-')}_23-21494${20000 + index}`,
        meeting: `adventure-meeting-${location.replace(' ', '-')}_23-21494${20010 + index}`,
        action: `action-${item.replace(' ', '-')}_23-21494${20020 + index}`,
        resolution: `treasure-celebration_23-21494${20030 + index}`
      },
      fantasy: {
        discovery: `fantasy-${item.replace(' ', '-')}-scene_23-21494${20100 + index}`,
        meeting: `${location.replace(' ', '-')}-encounter_23-21494${20110 + index}`,
        action: `magic-${item.replace(' ', '-')}-action_23-21494${20120 + index}`,
        resolution: `fantasy-victory_23-21494${20130 + index}`
      },
      space: {
        discovery: `space-${item.replace(' ', '-')}-discovery_23-21494${20200 + index}`,
        meeting: `alien-${location.replace(' ', '-')}-meet_23-21494${20210 + index}`,
        action: `spaceship-${item.replace(' ', '-')}_23-21494${20220 + index}`,
        resolution: `space-success_23-21494${20230 + index}`
      },
      animal: {
        discovery: `forest-${item.replace(' ', '-')}-find_23-21494${20300 + index}`,
        meeting: `animal-${location.replace(' ', '-')}-friends_23-21494${20310 + index}`,
        action: `woods-${item.replace(' ', '-')}-activity_23-21494${20320 + index}`,
        resolution: `animal-celebration_23-21494${20330 + index}`
      }
    };

    const imagePath = themeKeywords[theme as keyof typeof themeKeywords]?.[scene as keyof typeof themeKeywords.adventure] 
      || `children-story-${theme}-${scene}_23-21494${20000 + index}`;
    
    return `${baseUrl}${imagePath}.jpg`;
  };

  const getLesson = (theme: string): string => {
    const lessons = {
      adventure: "true treasure is the friends we make along the way",
      fantasy: "even small acts of kindness can break the strongest curses",
      space: "the universe rewards those who help others",
      animal: "every creature has something valuable to teach us"
    };
    return lessons[theme as keyof typeof lessons] || lessons.adventure;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const storyBeats = generateStoryContent();
      const pages = storyBeats.map((beat, index) => ({
        text: beat.text,
        imageUrl: getImageForPage(beat.keywords, formData.theme, index)
      }));
      
      setStoryPages(pages);
    } catch (err) {
      setError("Failed to generate story. Please try again.");
      console.error("Story generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaMagic className="text-purple-500" /> Create Your Storybook
      </h2>

      <div className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FaChild className="text-blue-500" /> Child's Name (optional)
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Emma or Noah"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Age (1-12)</label>
          <input
            type="number"
            min="1"
            max="12"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FaBook className="text-green-500" /> Story Theme
          </label>
          <select
            value={formData.theme}
            onChange={(e) => setFormData({...formData, theme: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="adventure">Adventure</option>
            <option value="fantasy">Fantasy</option>
            <option value="space">Space</option>
            <option value="animal">Animal Friends</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500" /> Special Item
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., golden key, star map, magic acorn"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-70 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Creating Your Story...
            </>
          ) : (
            <>
              <FaMagic /> Generate Story
            </>
          )}
        </button>
      </div>
    </form>
  );
}