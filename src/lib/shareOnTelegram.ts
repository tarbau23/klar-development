export const shareOnTelegram = (url : string, text : string = '') => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank', 'width=600,height=400');
  };
  