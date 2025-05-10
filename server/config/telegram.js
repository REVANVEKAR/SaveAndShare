import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import Resource from '../models/Resource.js';

dotenv.config();

// Initialize bot with polling since we're using HTTP
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Helper function to parse donation message
const parseDonationMessage = (text) => {
  const donationMatch = text.match(/Donation:?\s*(.+?)(?:\n|$)/i);
  const locationMatch = text.match(/Location:?\s*(.+?)(?:\n|$)/i);
  const contactMatch = text.match(/Contact:?\s*(.+?)(?:\n|$)/i);

  if (!donationMatch || !locationMatch) {
    return null;
  }

  return {
    donation: donationMatch[1].trim(),
    location: locationMatch[1].trim(),
    contact: contactMatch ? contactMatch[1].trim() : null
  };
};

// Helper function to generate mock coordinates (in real implementation, use geocoding)
const generateMockCoordinates = () => ({
  lat: 37.7749 + (Math.random() - 0.5) * 0.1,
  lng: -122.4194 + (Math.random() - 0.5) * 0.1
});

// Set up message handling
const setupBot = () => {
  // Handle incoming messages
  bot.on('message', async (msg) => {
    try {
      const chatId = msg.chat.id;
      const sender = `${msg.from.first_name} ${msg.from.last_name || ''}`;
      
      // Parse the donation message
      const parsedMessage = parseDonationMessage(msg.text);
      
      if (!parsedMessage) {
        const helpMessage = `Please format your message like this:
Donation: [items]
Location: [address]
Contact: [name and phone]

Example:
Donation: 20 food packets
Location: 123 Main St, City
Contact: John Doe, 555-1234`;
        
        await bot.sendMessage(chatId, helpMessage);
        return;
      }

      // Generate mock coordinates (use real geocoding in production)
      const coordinates = generateMockCoordinates();

      // Create new resource
      const resource = new Resource({
        title: `Donation: ${parsedMessage.donation}`,
        description: msg.text,
        location: {
          lat: coordinates.lat,
          lng: coordinates.lng,
          address: parsedMessage.location
        },
        contactInfo: parsedMessage.contact || sender,
        donorName: sender,
        source: 'telegram'
      });

      await resource.save();

      // Send confirmation message
      const confirmationMessage = `Thank you for your donation! 🙏

We've received your donation details:
• Items: ${parsedMessage.donation}
• Location: ${parsedMessage.location}
• Contact: ${parsedMessage.contact || sender}

Your donation has been listed and will be visible to verified NGOs in the area.`;

      await bot.sendMessage(chatId, confirmationMessage);

    } catch (error) {
      console.error('Error processing message:', error);
      await bot.sendMessage(msg.chat.id, 'Sorry, there was an error processing your donation. Please try again later.');
    }
  });

  console.log('Telegram bot is running in polling mode');
};

export { bot, setupBot }; 