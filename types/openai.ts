import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_3_5_AZ = 'gpt-35-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_32K = 'gpt-4-32k',
  GPT_4_1106_PREVIEW = 'gpt-4-1106-preview',
  GPT_4_VISION_PREVIEW = 'gpt-4-vision-preview',
  GPT_4_TURBO = ' gpt-4-turbo-2024-04-09',
  GPT_4_TURBO_VISION = 'gpt-4-turbo-vision'
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_4_TURBO;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_3_5_AZ]: {
    id: OpenAIModelID.GPT_3_5_AZ,
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
    maxLength: 24000,
    tokenLimit: 8000,
  },
  [OpenAIModelID.GPT_4_32K]: {
    id: OpenAIModelID.GPT_4_32K,
    name: 'GPT-4-32K',
    maxLength: 96000,
    tokenLimit: 32000,
  },
  [OpenAIModelID.GPT_4_1106_PREVIEW]: {
    id: OpenAIModelID.GPT_4_1106_PREVIEW,
    name: 'GPT-4-1106-Preview',
    maxLength: 4096, // as per the context window
    tokenLimit: 128000, // as per the training data
  },
  [OpenAIModelID.GPT_4_VISION_PREVIEW]: {
    id: OpenAIModelID.GPT_4_VISION_PREVIEW,
    name: 'GPT-4-Vision-Preview',
    maxLength: 4096, // as per the context window
    tokenLimit: 128000, // as per the training data
  },
   [OpenAIModelID.GPT_4_TURBO]: {
    id: OpenAIModelID.GPT_4_TURBO,
    name: 'GPT-4-TURBO',
    maxLength: 4096, // as per the context window
    tokenLimit: 128000, // as per the training data
  },
   [OpenAIModelID.GPT_4_TURBO_VISION]: {
    id: OpenAIModelID.GPT_4_TURBO_VISION,
    name: 'GPT-4-TURBO-VISION',
    maxLength: 4096, // as per the context window
    tokenLimit: 128000, // as per the training data
  },
};
