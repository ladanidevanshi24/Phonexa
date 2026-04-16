const { GoogleGenerativeAI } = require("@google/generative-ai");

const localMessageResponder = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes("product") || msg.includes("trending") || msg.includes("popular")) {
    return "We have a wide range of premium electronics! You can find our most popular products in the 'Popular Products' section on our home page. Is there a specific category you're interested in (e.g., Wireless Earbuds, Smart Watches)?";
  }
  
  if (msg.includes("order") || msg.includes("track")) {
    return "To track your order, please visit the 'Orders' section in your profile. You'll find all your recent purchases and their current status there.";
  }
  
  if (msg.includes("category") || msg.includes("categories")) {
    return "Our store features several categories including Headphones, Smart Watches, Wireless Earbuds, and Bluetooth Speakers. You can browse them directly from the home page!";
  }
  
  if (msg.includes("contact") || msg.includes("help") || msg.includes("support")) {
    return "You can reach our support team via email at support@phonex.com or call us at +1-800-PHONEX. We're here to help!";
  }
  
  if (msg.includes("return") || msg.includes("refund")) {
    return "We offer a 30-day return policy for all products in their original condition. Please check our detailed Return Policy page in the footer for more info.";
  }

  if (msg.includes("hello") || msg.includes("hi ") || msg === "hi" || msg.includes("hey")) {
    return "Hello! I'm Phonex AI. I can help you find products, track orders, or answer questions about our store. What's on your mind?";
  }

  return null; // Fallback to AI if no keywords match
};

const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // 1. Try local smart responder first
    const localResponse = localMessageResponder(message);
    if (localResponse) {
      return res.status(200).json({
        success: true,
        message: localResponse,
        source: 'local'
      });
    }

    // 2. Check for API key for full AI mode
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(200).json({
        success: true,
        message: "I am currently in Local Assistant mode. To enable full AI conversations, please add a `GEMINI_API_KEY` to the server configuration. How else can I help you with our store?",
        source: 'local-fallback'
      });
    }

    // 3. Proceed with Gemini AI if key is present
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      message: text,
      source: 'ai'
    });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({
      success: false,
      message: "I'm having trouble connecting to my AI brain right now, but I'm still here to help! Ask me about our products or your orders.",
      error: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};
