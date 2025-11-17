export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, settings, action } = req.body;
    
    // Токены из Environment Variables Vercel
    const atlasToken = process.env.ATLAS_TOKEN;
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (action === 'search') {
      // Поиск через ATLAS API
      const searchResponse = await fetch('https://api.atlass.digital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: atlasToken,
          ...settings,
          search: query
        })
      });
      
      const data = await searchResponse.json();
      return res.status(200).json(data);
    }

    if (action === 'log') {
      // Логирование в Telegram
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔍 LOG: ${query}`
        })
      });
      
      return res.status(200).json({ status: 'logged' });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
        }
