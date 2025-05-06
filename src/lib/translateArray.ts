export default async function translateArray(array : any, language : string){
    // this function sends a POST request to the /api/translate endpoint with the array and target language as JSON data.
    // It then waits for the response and parses it as JSON. Finally, it returns the translated array to the console.

    const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: array,
          targetLanguage: language,
        }),
      });
    
      const result = await response.json();
      return result.data; // Translated array
}