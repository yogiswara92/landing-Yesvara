export async function getChatWeb(credential) {
    const res = await fetch('https://n8n.yesvara.com/webhook/get-chat-web', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'auth':`${import.meta.env.VITE_YESVARA_AUTH}` },
      body: JSON.stringify({ credential })
    });
  
    // const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/botchat_history?chat_id=eq.${credential}`, {
    //   method: 'GET',
    //   headers: {'Content-Type': 'application/json',
    //             'apikey':`${import.meta.env.VITE_SUPABASE_API_KEY}`,
    //             'Authorization' : `Bearer ${import.meta.env.VITE_SUPABASE_AUTHORIZATION}`,
    //             'Prefer':'return=representation',
    //      }
    // });


    if (!res.ok) {
      throw new Error('Gagal mengambil data dari webhook');
    }
    
    return await res.json();
  }