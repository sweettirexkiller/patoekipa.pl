'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatWidgetContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ChatWidgetContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ChatWidgetContext.Provider>
  );
}

export function useChatWidget() {
  const context = useContext(ChatWidgetContext);
  if (context === undefined) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  return context;
} 