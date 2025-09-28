import { ChatMessage, ChatStats, ParsedChat } from '../types/chat';

export class WhatsAppChatParser {
  private static parseMessage(line: string, index: number): ChatMessage | null {
    // Skip empty lines
    if (!line.trim()) return null;

    // System messages (encryption notices, etc.)
    if (line.includes('Messages and calls are end-to-end encrypted') ||
        line.includes('This chat is with a business account') ||
        line.includes('You blocked this business') ||
        line.includes('You unblocked this business')) {
      return {
        id: `system-${index}`,
        timestamp: new Date(),
        sender: 'System',
        content: line,
        type: 'system',
        isSystemMessage: true
      };
    }

    // Regular message pattern: [date, time] sender: content
    const messageRegex = /^\[(\d{4}\/\d{2}\/\d{2}), (\d{2}:\d{2}:\d{2})\] ([^:]+): (.+)$/;
    const match = line.match(messageRegex);

    if (!match) {
      // Handle multi-line messages or other formats
      return null;
    }

    const [, dateStr, timeStr, sender, content] = match;
    const timestamp = new Date(`${dateStr} ${timeStr}`);

    // Determine message type based on content
    let type: ChatMessage['type'] = 'text';
    let mediaFile: string | undefined;

    if (content.includes('image omitted')) {
      type = 'image';
    } else if (content.includes('audio omitted')) {
      type = 'audio';
    } else if (content.includes('video omitted')) {
      type = 'video';
    } else if (content.includes('sticker omitted')) {
      type = 'sticker';
    } else if (content.includes('GIF omitted')) {
      type = 'gif';
    } else if (content.includes('This message was deleted')) {
      type = 'deleted';
    } else if (content.includes('<attached:')) {
      // Extract media file name
      const mediaMatch = content.match(/<attached: ([^>]+)>/);
      if (mediaMatch) {
        mediaFile = mediaMatch[1];
        // Determine type from file extension
        const fileName = mediaFile.toLowerCase();
        if (fileName.includes('audio') || fileName.endsWith('.opus')) {
          type = 'audio';
        } else if (fileName.includes('video') || fileName.endsWith('.mp4')) {
          type = 'video';
        } else if (fileName.includes('sticker') || fileName.endsWith('.webp')) {
          type = 'sticker';
        } else if (fileName.includes('photo') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          type = 'image';
        } else if (fileName.includes('gif') || fileName.includes('GIF')) {
          type = 'gif';
        }
      }
    }

    return {
      id: `msg-${index}`,
      timestamp,
      sender: sender.trim(),
      content: content.trim(),
      type,
      mediaFile,
      isSystemMessage: false
    };
  }

  static parseChatFile(content: string): ParsedChat {
    const lines = content.split('\n');
    const messages: ChatMessage[] = [];
    let currentMessage: ChatMessage | null = null;

    // Parse each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const message = this.parseMessage(line, i);

      if (message) {
        if (currentMessage && !message.isSystemMessage && !currentMessage.isSystemMessage) {
          // Check if this is a continuation of the previous message
          const isContinuation = !line.match(/^\[\d{4}\/\d{2}\/\d{2}, \d{2}:\d{2}:\d{2}\]/);
          if (isContinuation) {
            currentMessage.content += ' ' + line.trim();
            continue;
          }
        }
        
        if (currentMessage) {
          messages.push(currentMessage);
        }
        currentMessage = message;
      } else if (currentMessage && !currentMessage.isSystemMessage) {
        // This is a continuation line
        currentMessage.content += ' ' + line.trim();
      }
    }

    // Add the last message
    if (currentMessage) {
      messages.push(currentMessage);
    }

    // Calculate statistics
    const stats = this.calculateStats(messages);

    return {
      messages,
      stats
    };
  }

  private static calculateStats(messages: ChatMessage[]): ChatStats {
    const nonSystemMessages = messages.filter(msg => !msg.isSystemMessage);
    
    if (nonSystemMessages.length === 0) {
      return {
        totalMessages: 0,
        totalMedia: 0,
        totalImages: 0,
        totalVideos: 0,
        totalAudio: 0,
        totalStickers: 0,
        totalGifs: 0,
        participants: [],
        dateRange: { start: new Date(), end: new Date() },
        messagesByParticipant: {},
        messagesByHour: {},
        messagesByDay: {},
        messagesByMonth: {},
        mostActiveDay: '',
        mostActiveHour: 0,
        averageMessagesPerDay: 0,
        longestStreak: 0,
        wordCount: {},
        emojiCount: {}
      };
    }

    // Basic counts
    const totalMessages = nonSystemMessages.length;
    const totalMedia = nonSystemMessages.filter(msg => 
      ['image', 'audio', 'video', 'sticker', 'gif'].includes(msg.type)
    ).length;
    const totalImages = nonSystemMessages.filter(msg => msg.type === 'image').length;
    const totalVideos = nonSystemMessages.filter(msg => msg.type === 'video').length;
    const totalAudio = nonSystemMessages.filter(msg => msg.type === 'audio').length;
    const totalStickers = nonSystemMessages.filter(msg => msg.type === 'sticker').length;
    const totalGifs = nonSystemMessages.filter(msg => msg.type === 'gif').length;

    // Participants
    const participants = [...new Set(nonSystemMessages.map(msg => msg.sender))];

    // Date range
    const timestamps = nonSystemMessages.map(msg => msg.timestamp.getTime());
    const dateRange = {
      start: new Date(Math.min(...timestamps)),
      end: new Date(Math.max(...timestamps))
    };

    // Messages by participant
    const messagesByParticipant: Record<string, number> = {};
    participants.forEach(participant => {
      messagesByParticipant[participant] = nonSystemMessages.filter(msg => msg.sender === participant).length;
    });

    // Messages by hour
    const messagesByHour: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      messagesByHour[i] = 0;
    }
    nonSystemMessages.forEach(msg => {
      const hour = msg.timestamp.getHours();
      messagesByHour[hour]++;
    });

    // Messages by day of week
    const messagesByDay: Record<string, number> = {
      'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0,
      'Thursday': 0, 'Friday': 0, 'Saturday': 0
    };
    nonSystemMessages.forEach(msg => {
      const dayName = msg.timestamp.toLocaleDateString('en-US', { weekday: 'long' });
      messagesByDay[dayName]++;
    });

    // Messages by month
    const messagesByMonth: Record<string, number> = {};
    nonSystemMessages.forEach(msg => {
      const monthKey = msg.timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      messagesByMonth[monthKey] = (messagesByMonth[monthKey] || 0) + 1;
    });

    // Most active day and hour
    const mostActiveDay = Object.entries(messagesByDay).reduce((a, b) => messagesByDay[a[0]] > messagesByDay[b[0]] ? a : b)[0];
    const mostActiveHour = Object.entries(messagesByHour).reduce((a, b) => messagesByHour[parseInt(a[0])] > messagesByHour[parseInt(b[0])] ? a : b)[0];

    // Average messages per day
    const daysDiff = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const averageMessagesPerDay = daysDiff > 0 ? totalMessages / daysDiff : 0;

    // Word count
    const wordCount: Record<string, number> = {};
    nonSystemMessages.forEach(msg => {
      if (msg.type === 'text' && msg.content) {
        const words = msg.content.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 2);
        words.forEach(word => {
          wordCount[word] = (wordCount[word] || 0) + 1;
        });
      }
    });

    // Emoji count
    const emojiCount: Record<string, number> = {};
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    nonSystemMessages.forEach(msg => {
      if (msg.type === 'text' && msg.content) {
        const emojis = msg.content.match(emojiRegex);
        if (emojis) {
          emojis.forEach(emoji => {
            emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
          });
        }
      }
    });

    // Calculate longest streak (consecutive days with messages)
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    const sortedMessages = [...nonSystemMessages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    for (const msg of sortedMessages) {
      const msgDate = new Date(msg.timestamp.getFullYear(), msg.timestamp.getMonth(), msg.timestamp.getDate());
      
      if (lastDate) {
        const dayDiff = Math.floor((msgDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
        } else if (dayDiff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      lastDate = msgDate;
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      totalMessages,
      totalMedia,
      totalImages,
      totalVideos,
      totalAudio,
      totalStickers,
      totalGifs,
      participants,
      dateRange,
      messagesByParticipant,
      messagesByHour,
      messagesByDay,
      messagesByMonth,
      mostActiveDay,
      mostActiveHour: parseInt(mostActiveHour),
      averageMessagesPerDay,
      longestStreak,
      wordCount,
      emojiCount
    };
  }
}
