import { useState, ChangeEvent, FormEvent, SetStateAction } from "react";
import LoadingBar from "./LoadingBar";
import {
  generatePromptEmbedding,
  getEmbeddingMetadata,
  generateStory,
} from "../utils/apiCalls";
import { getStoryPrompt } from "../prompts/getStoryPrompt";

type Props = {
  setStoryPages: React.Dispatch<SetStateAction<string[]>>;
};

const InputForm: React.FC<Props> = ({ setStoryPages }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { embedding } = await generatePromptEmbedding(formData.description);
    if (embedding) {
      const metadata = await getEmbeddingMetadata(embedding);
      console.log("metadata:", metadata);

      const prompt = getStoryPrompt({
        ...formData,
        metadata,
      });
      await generateStory({ prompt, setStoryPages, setLoading });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="-mx-3 flex">
        <div className="w-full px-3">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
            htmlFor="name"
          >
            Child's Name
          </label>
          <input
            className="mb-3 block w-full appearance-none rounded rounded-3xl border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-6 w-full px-3 md:w-1/2">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
            htmlFor="age"
          >
            Age
          </label>
          <input
            className="block w-full appearance-none rounded rounded-3xl border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="mb-6 w-full">
        <label
          className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
          htmlFor="description"
        >
          Description
        </label>
        <input
          className="mb-3 block w-full appearance-none rounded rounded-3xl border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
          name="description"
          type="text"
          placeholder="Description"
          onChange={handleInputChange}
        />
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="submit"
          className={`main-button focus:shadow-outline flex max-w-[300px] items-center justify-center space-x-2 rounded bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700  focus:outline-none ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            <span>✨ GENERATE BOOK</span>
          )}
        </button>
        <LoadingBar loading={loading} />
      </div>
    </form>
  );
};

export default InputForm;
