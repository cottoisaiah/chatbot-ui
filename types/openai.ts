import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo-0125',
  GPT_4 = 'gpt-4-turbo-2024-04-09',
  GPT_4O = 'gpt-4o-2024-11-20',
  GPT_4_TURBO = 'gpt-4-turbo-2024-04-09',
}


// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_4;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 16000,
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
    maxLength: 24000,
    tokenLimit: 128000,
  },
  [OpenAIModelID.GPT_4O]: {
    id: OpenAIModelID.GPT_4O,
    name: 'GPT-4O',
    maxLength: 90000,
    tokenLimit: 128000,
  },
  [OpenAIModelID.GPT_4_TURBO]: {
    id: OpenAIModelID.GPT_4_TURBO,
    name: 'GPT-4 Turbo',
    maxLength: 90000,
    tokenLimit: 128000,
  },
};
