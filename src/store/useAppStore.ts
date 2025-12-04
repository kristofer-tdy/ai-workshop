import { create } from 'zustand';

export type Mode = 'presentation' | 'self-study';
export type TokenMethod = 'word' | 'subword' | 'character';

interface Token {
  text: string;
  id: number;
}

interface AppState {
  // Global state
  mode: Mode;
  currentSection: number;
  reducedMotion: boolean;

  // Tokenization state
  tokenization: {
    inputText: string;
    tokens: Token[];
    method: TokenMethod;
  };

  // Training state
  training: {
    currentStep: number;
    isAutoPlaying: boolean;
    speed: 1 | 2 | 3;
  };

  // Inference state
  inference: {
    prompt: string;
    output: Token[];
    isGenerating: boolean;
    temperature: number;
  };

  // Behind the scenes state
  behindScenes: {
    isAnimating: boolean;
    selectedModel: string;
    inputTokens: number;
    outputTokens: number;
  };

  // Actions
  setMode: (mode: Mode) => void;
  setCurrentSection: (section: number) => void;
  setReducedMotion: (reduced: boolean) => void;

  // Tokenization actions
  setTokenizationInput: (text: string) => void;
  setTokenizationMethod: (method: TokenMethod) => void;
  setTokens: (tokens: Token[]) => void;

  // Training actions
  setTrainingStep: (step: number) => void;
  toggleAutoPlay: () => void;
  setTrainingSpeed: (speed: 1 | 2 | 3) => void;

  // Inference actions
  setInferencePrompt: (prompt: string) => void;
  setInferenceOutput: (output: Token[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setTemperature: (temp: number) => void;

  // Behind scenes actions
  setIsAnimating: (animating: boolean) => void;
  setSelectedModel: (model: string) => void;
  setTokenCounts: (input: number, output: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  mode: 'self-study',
  currentSection: 0,
  reducedMotion: false,

  tokenization: {
    inputText: '',
    tokens: [],
    method: 'subword',
  },

  training: {
    currentStep: 0,
    isAutoPlaying: false,
    speed: 1,
  },

  inference: {
    prompt: '',
    output: [],
    isGenerating: false,
    temperature: 0.7,
  },

  behindScenes: {
    isAnimating: false,
    selectedModel: 'gpt-4',
    inputTokens: 0,
    outputTokens: 0,
  },

  // Actions
  setMode: (mode) => set({ mode }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

  setTokenizationInput: (text) =>
    set((state) => ({
      tokenization: { ...state.tokenization, inputText: text },
    })),
  setTokenizationMethod: (method) =>
    set((state) => ({
      tokenization: { ...state.tokenization, method },
    })),
  setTokens: (tokens) =>
    set((state) => ({
      tokenization: { ...state.tokenization, tokens },
    })),

  setTrainingStep: (step) =>
    set((state) => ({
      training: { ...state.training, currentStep: step },
    })),
  toggleAutoPlay: () =>
    set((state) => ({
      training: { ...state.training, isAutoPlaying: !state.training.isAutoPlaying },
    })),
  setTrainingSpeed: (speed) =>
    set((state) => ({
      training: { ...state.training, speed },
    })),

  setInferencePrompt: (prompt) =>
    set((state) => ({
      inference: { ...state.inference, prompt },
    })),
  setInferenceOutput: (output) =>
    set((state) => ({
      inference: { ...state.inference, output },
    })),
  setIsGenerating: (generating) =>
    set((state) => ({
      inference: { ...state.inference, isGenerating: generating },
    })),
  setTemperature: (temp) =>
    set((state) => ({
      inference: { ...state.inference, temperature: temp },
    })),

  setIsAnimating: (animating) =>
    set((state) => ({
      behindScenes: { ...state.behindScenes, isAnimating: animating },
    })),
  setSelectedModel: (model) =>
    set((state) => ({
      behindScenes: { ...state.behindScenes, selectedModel: model },
    })),
  setTokenCounts: (input, output) =>
    set((state) => ({
      behindScenes: { ...state.behindScenes, inputTokens: input, outputTokens: output },
    })),
}));
