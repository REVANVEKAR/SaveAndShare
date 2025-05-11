import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import Resource from '../models/Resource.js';

dotenv.config();

// Initialize bot with polling since we're using HTTP
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Store temporary donation data
const pendingDonations = new Map();

// Helper function to parse donation message
const parseDonationMessage = (text) => {
  const donationMatch = text.match(/Donation:?\s*(.+?)(?:\n|$)/i);
  const contactMatch = text.match(/Contact:?\s*(.+?)(?:\n|$)/i);

  if (!donationMatch) {
    return null;
  }

  return {
    donation: donationMatch[1].trim(),
    contact: contactMatch ? contactMatch[1].trim() : null
  };
};

// Set up message handling
const setupBot = () => {
  // Handle incoming messages
  bot.on('message', async (msg) => {
    try {
      const chatId = msg.chat.id;
      const sender = `${msg.from.first_name} ${msg.from.last_name || ''}`;

      // If message contains location
      if (msg.location) {
        const pendingDonation = pendingDonations.get(chatId);
        if (pendingDonation) {
          // Create new resource with the location
          const resource = new Resource({
            title: `Donation: ${pendingDonation.donation}`,
            description: pendingDonation.donation,
            location: {
              lat: msg.location.latitude,
              lng: msg.location.longitude,
              address: 'Location shared via Telegram' // We can use reverse geocoding here if needed
            },
            contactInfo: pendingDonation.contact || sender,
            donorName: sender,
            source: 'telegram'
          });

          await resource.save();
          pendingDonations.delete(chatId);

          // Send confirmation message
          const confirmationMessage = `Thank you for your donation! 🙏

We've received your donation details:
• Items: ${pendingDonation.donation}
• Contact: ${pendingDonation.contact || sender}
• Location: Received via Telegram location sharing

Your donation has been listed and will be visible to verified NGOs in the area.`;

          await bot.sendMessage(chatId, confirmationMessage);
          return;
        }
      }

      // Parse the donation message
      const parsedMessage = parseDonationMessage(msg.text);

      if (!parsedMessage) {
        const helpMessage = `Please format your message like this:
Donation: [items]
Contact: [name and phone]

After sending this, I'll ask you to share your location.`;
        
        await bot.sendMessage(chatId, helpMessage);
        return;
      }

      // Store the donation details and ask for location
      pendingDonations.set(chatId, {
        donation: parsedMessage.donation,
        contact: parsedMessage.contact || sender
      });

      await bot.sendMessage(
        chatId,
        'Great! Now please share your location using the location sharing feature in Telegram.',
        {
          reply_markup: {
            keyboard: [[{ text: 'Share Location', request_location: true }]],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        }
      );

    } catch (error) {
      console.error('Error processing message:', error);
      await bot.sendMessage(msg.chat.id, 'Sorry, there was an error processing your donation. Please try again later.');
    }
  });

  console.log('Telegram bot is running in polling mode');
};

export default setupBot; 