"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import { SearchSourceToggle } from "@/components/chat/search-source-toggle";
import { SearchStatus } from "@/components/chat/search-status";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export type SearchSource = "web" | "knowledge" | "both";
export type SearchEngine = "serpapi" | "serper" | "searchapi";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  searchResults?: SearchResult[];
  sources?: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant with web search capabilities. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [searchSource, setSearchSource] = useState<SearchSource>("both");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>("serpapi");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsSearching(true);

    try {
      // Simulate search and response
      const searchResults = await simulateSearch(content, searchSource, searchEngine);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(content, searchResults),
        role: "assistant",
        timestamp: new Date(),
        searchResults,
        sources: searchResults.map(r => r.url),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Temporary simulation functions
  const simulateSearch = async (
    query: string,
    source: SearchSource,
    engine: SearchEngine
  ): Promise<SearchResult[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [
      {
        title: "Example Search Result",
        url: "https://example.com",
        snippet: "This is a simulated search result relevant to the query.",
        source: engine,
      },
    ];
  };

  const generateResponse = (query: string, results: SearchResult[]): string => {
    return `Based on the search results, here's what I found about "${query}"...`;
  };

  return (
    <main className="flex h-screen flex-col">
      <ChatHeader />
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <SearchSourceToggle
          source={searchSource}
          onChange={setSearchSource}
          engine={searchEngine}
          onEngineChange={setSearchEngine}
        />
        <SearchStatus isSearching={isSearching} />
      </div>
      <MessageList messages={messages} />
      <ChatInput onSubmit={handleSubmit} disabled={isSearching} />
    </main>
  );
}