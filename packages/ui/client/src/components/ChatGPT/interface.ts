import { OpenAIChatMessage } from "modelfusion";
import type { ReactNode } from "react";

export interface SendBarProps {
  loading: boolean;
  disabled: boolean;
  onSend: (message: OpenAIChatMessage) => void;
  onClear: () => void;
  onStop: () => void;
}

export interface ShowProps {
  loading?: boolean;
  fallback?: ReactNode;
  children?: ReactNode;
}
