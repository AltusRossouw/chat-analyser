export interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'sticker' | 'gif' | 'system' | 'deleted';
  mediaFile?: string;
  isSystemMessage: boolean;
}

export interface ChatStats {
  totalMessages: number;
  totalMedia: number;
  totalImages: number;
  totalVideos: number;
  totalAudio: number;
  totalStickers: number;
  totalGifs: number;
  participants: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  messagesByParticipant: Record<string, number>;
  messagesByHour: Record<number, number>;
  messagesByDay: Record<string, number>;
  messagesByMonth: Record<string, number>;
  mostActiveDay: string;
  mostActiveHour: number;
  averageMessagesPerDay: number;
  longestStreak: number;
  wordCount: Record<string, number>;
  emojiCount: Record<string, number>;
}

export interface ParsedChat {
  messages: ChatMessage[];
  stats: ChatStats;
}
