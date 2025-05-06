import { NextRequest } from 'next/server';
import openai from "@/lib/openai";


export async function POST(req: NextRequest) {
  try {
    const { jobPost, language } = await req.json();

    // Ensure the input object is valid
    if (!jobPost || typeof jobPost !== 'object') {
      return new Response(JSON.stringify({ message: 'Invalid job post format.' }), { status: 400 });
    }

    // Call OpenAI to handle both translation and formatting in one go
    const markdownJobPost = await generateFormattedJobPost(jobPost, language);

    return new Response(JSON.stringify({ jobPost: markdownJobPost }), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to process the job post.', error: error.message }), { status: 500 });
  }
}

// Helper function to generate the job post in the requested language and format it
async function generateFormattedJobPost(jobPost: Record<string, any>, targetLanguage: string) {
  // Check if the necessary keys exist in the job post, and provide default values if any are missing
  const jobTitle = jobPost.stellenangebotsTitel || 'No title provided';
  const companyName = jobPost.firma || 'No company specified';
  const position = jobPost.hauptberuf || 'No position specified';
  const description = jobPost.stellenangebotsBeschreibung || 'No description provided';
  const location = jobPost.stellenlokationen && jobPost.stellenlokationen[0] 
    ? `${jobPost.stellenlokationen[0].adresse.ort}, ${jobPost.stellenlokationen[0].adresse.land}` 
    : 'No location provided';
  const applyLink = jobPost.externeURL || 'No application link provided';

  const jobDescription = `
    You are a job listing assistant. I need you to help format and translate a job post into **${targetLanguage}** in a structured format. The job post should be clearly divided into sections with descriptive headings.

    Sections should include:
    1. **Job Title** (translated)
    2. **Company** and **Position** (translated)
    3. **Job Description** (responsibilities and tasks, translated)
    4. **Requirements** (skills and qualifications, translated)
    5. **How to Apply** (instructions for applying, translated)
    6. **Location** (translated)
    7. **Salary and Benefits** (translated)

    Here’s the job post (do not change the keys, only translate and format the values):

    **Job Title:** ${jobTitle}
    **Company:** ${companyName}
    **Position:** ${position}
    **Description:** ${description}
    **Location:** ${location}
    **How to Apply:** Send your application to ${applyLink}
    **External URL:** ${applyLink}

    Please ensure each section is formatted with clear headings, keeping the job post professional and easy to read. and dont add any extra information or a single word or text.
  `;

  // Call OpenAI API to translate and format the job post in a structured way
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional job post formatter and translator. You will format the job post and translate it into the language requested by the user.',
      },
      {
        role: 'user',
        content: jobDescription,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || 'Failed to generate the job post.';
}
