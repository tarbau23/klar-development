export const openYouTube = (youtubeUrl :any) => {
    // Extract the video ID from the YouTube URL
    const videoId = new URL(youtubeUrl).searchParams.get('v');
    const youtubeAppUrl = `youtube://www.youtube.com/watch?v=${videoId}`; // Deep link for YouTube app
  
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      // Try opening in YouTube app
      window.location.href = youtubeAppUrl;
  
      // Fallback to browser after a delay
      setTimeout(() => {
        window.location.href = youtubeUrl;
      }, 1000); // 1-second delay to give the YouTube app time to open
    } else {
      // Open in browser for non-mobile devices
      window.location.href = youtubeUrl;
    }
  };
  