const fetch = require('node-fetch');

async function testSocialMediaRoute() {
  console.log("🚀 SIMULATING WHATSAPP MESSAGE TO DR. BOT...");
  
  const payload = {
    data: {
      text: "بدي برنامج لعلاج حب الشباب وتصبغات الوجه"
    }
  };

  try {
    const response = await fetch('https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=manychat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2VpYnZhbGtveXRhZnlud29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMzc1OTUsImV4cCI6MjA4NTkxMzU5NX0.cnstN7JUhkt-hevIWhaeYRu1Y51tPSTi7eOBM6RLz4Y'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("\n✅ DR. BOT RESPONSE (ManyChat Format):");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Test Failed:", error);
  }
}

testSocialMediaRoute();