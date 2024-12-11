import {
  IconArrowDown,
  IconBolt,
  IconBrandGoogle,
  IconPlayerStop,
  IconRepeat,
  IconSend,
  IconUpload,
} from '@tabler/icons-react';
import {
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'next-i18next';

import { Message } from '@/types/chat';
import { Plugin } from '@/types/plugin';
import { Prompt } from '@/types/prompt';

import HomeContext from '@/pages/api/home/home.context';

import { PluginSelect } from './PluginSelect';
import { PromptList } from './PromptList';
import { VariableModal } from './VariableModal';

interface Props {
  onSend: (message: Message, plugin: Plugin | null) => void;
  onRegenerate: () => void;
  onScrollDownClick: () => void;
  stopConversationRef: MutableRefObject<boolean>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  showScrollDownButton: boolean;
}

export const ChatInput = ({
  onSend,
  onRegenerate,
  onScrollDownClick,
  stopConversationRef,
  textareaRef,
  showScrollDownButton,
}: Props) => {
  const { t } = useTranslation('chat');

  const {
    state: { selectedConversation, messageIsStreaming, prompts },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showPromptList, setShowPromptList] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPluginSelect, setShowPluginSelect] = useState(false);
  const [plugin, setPlugin] = useState<Plugin | null>(null);

  const promptListRef = useRef<HTMLUListElement | null>(null);

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(promptInputValue.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const maxLength = selectedConversation?.model.maxLength;

    if (maxLength && value.length > maxLength) {
      alert(
        t(
          `Message limit is {{maxLength}} characters. You have entered {{valueLength}} characters.`,
          { maxLength, valueLength: value.length }
        )
      );
      return;
    }

    setContent(value);
    updatePromptListVisibility(value);
  };

  const handleSend = () => {
    if (messageIsStreaming) {
      return;
    }

    if (!content) {
      alert(t('Please enter a message'));
      return;
    }

    onSend({ role: 'user', content }, plugin);
    setContent('');
    setPlugin(null);

    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageContent = `<img src="${reader.result}" alt="uploaded image" />`;
        onSend({ role: 'user', content: imageContent }, plugin);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStopConversation = () => {
    stopConversationRef.current = true;
    setTimeout(() => {
      stopConversationRef.current = false;
    }, 1000);
  };

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleInitModal = (prompt: Prompt) => {
    setVariables(prompt.variables || []);
    setIsModalVisible(true);
  };

  const handleVariableSubmit = (filledVariables: string[]) => {
    setIsModalVisible(false);
    const promptWithVariables = filledVariables.reduce((content, variable, index) => {
      return content.replace(`{{${index}}}`, variable);
    }, content || '');

    setContent(promptWithVariables);
    setShowPromptList(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const updatePromptListVisibility = (value: string) => {
    const hasPrompts = prompts.some((prompt) =>
      prompt.name.toLowerCase().includes(value.toLowerCase())
    );
    setShowPromptList(hasPrompts);
  };

    // 1. Manage typing effect
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [isTyping]);

  // 2. Scroll prompt list into view when visibility changes
  useEffect(() => {
    if (showPromptList && promptListRef.current) {
      promptListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showPromptList]);

  return (
    <div className="chat-input-container">
      {isModalVisible && selectedPrompt && (
    <VariableModal
      prompt={selectedPrompt} // Pass the prompt here
      variables={variables}
      onSubmit={handleVariableSubmit}
      onClose={() => setIsModalVisible(false)}
    />
  )}

      {showPromptList && (
        <PromptList
          prompts={filteredPrompts}
          activeIndex={activePromptIndex}
          onSelect={(prompt) => handleInitModal(prompt)}
          onHover={(index) => setActivePromptIndex(index)}
          ref={promptListRef}
        />
      )}

      <textarea
        ref={textareaRef}
        className="chat-input-textarea"
        placeholder={t('Type your message...')}
        value={content || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <div className="chat-input-actions">
        {showScrollDownButton && (
          <button
            className="chat-scroll-down-button"
            onClick={onScrollDownClick}
          >
            <IconArrowDown />
          </button>
        )}

        <button
          className="chat-plugin-select-button"
          onClick={() => setShowPluginSelect(!showPluginSelect)}
        >
          <IconBolt />
        </button>

        {showPluginSelect && (
          <PluginSelect
            selectedPlugin={plugin}
            onSelect={(selected) => setPlugin(selected)}
          />
        )}

        <button
          className="chat-send-button"
          onClick={handleSend}
          disabled={messageIsStreaming}
        >
          <IconSend />
        </button>

        <button
          className="chat-stop-button"
          onClick={handleStopConversation}
        >
          <IconPlayerStop />
        </button>

        <label htmlFor="image-upload" className="chat-upload-button">
          <IconUpload />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </div>
  );
};
