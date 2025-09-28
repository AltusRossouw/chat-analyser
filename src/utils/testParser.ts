import { WhatsAppChatParser } from './chatParser';

// Test function to parse the example chat file
export const testParser = async () => {
  try {
    const response = await fetch('/examples/_chat.txt');
    const content = await response.text();
    const parsed = WhatsAppChatParser.parseChatFile(content);
    
    console.log('Parsed chat data:', parsed);
    console.log('Total messages:', parsed.stats.totalMessages);
    console.log('Participants:', parsed.stats.participants);
    console.log('Date range:', parsed.stats.dateRange);
    
    return parsed;
  } catch (error) {
    console.error('Error testing parser:', error);
    return null;
  }
};
