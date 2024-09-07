const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

// Set the bot's webhook
bot.setWebHook(`${process.env.BOT_URL}/bot${token}`);

// Middleware to parse the incoming JSON requests
app.use(express.json());

// Define the endpoint that Telegram will send updates to
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Только Давлету", callback_data: "send_photo" }],
      ],
    },
  };

  bot.sendMessage(chatId, "Click the button to receive a photo:", options);
});

// Listen for callback queries (button clicks)
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (data === "send_photo") {
    // Send a photo when the button is clicked
    bot.sendPhoto(
      message.chat.id,
      "https://i.postimg.cc/fy9j3wZw/1704795878786-1704795856319.jpg",
      {
        caption: "Here is your photo!",
      }
    );
  }
});

// The root endpoint just to verify the bot is running
app.get("/", (req, res) => {
  res.send("Telegram bot is running!");
});

// Export the Express app for Vercel
module.exports = app;
