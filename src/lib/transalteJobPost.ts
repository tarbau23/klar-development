export default async function translateJobPost(jobPost: any, language: any) {
  try {
    const response = await fetch("/api/translateJobPost", {
      // Adjust the endpoint as needed
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobPost, language }),
    });

    const data = await response.json();
    if (response.ok) {
        return data.jobPost; // Return the formatted job post in markdown format
    } else {
      console.error("Error:", data.message);
      return null; // Handle error case
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null; // Handle error case
  }
};
