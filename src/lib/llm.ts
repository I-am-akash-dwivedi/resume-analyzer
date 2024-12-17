import { GoogleGenerativeAI } from "@google/generative-ai";
import { Buffer } from "buffer";

function generatePrompt(industry: string) {
  const RESUME_REVIEW_PROMPT = `
You are an expert career coach and resume consultant with over 15 years of experience in hiring and recruitment across multiple industries. 

Resume Structure and Layout Recommendations:
1. Candidate Experience Level Assessment:
- Early Career (No experience):
  * Prioritize education at the top
  * Highlight internships, projects, and academic achievements
  * Emphasize skills and potential

- Some Experiene:
  * Experience section should be prominent
  * Education can be more concise
  * Focus on professional achievements and skills

- Experienced Professional:
  * Experience section is primary
  * Education can be brief
  * Emphasize strategic achievements and leadership skills

2. Layout Optimization Guidelines:
- Recommended Sections Order:
  a) For Entry-Level: Education > Projects > Skills
  b) For Mid-Career: Experience > Skills > Education 
  c) For Experienced Professionals: Experience > Skills > Achievements > Education
  These are the examples, recommend layout based on the candidate's profile.

3. Formatting Recommendations:
- Use clean, professional fonts (Arial, Calibri, Times New Roman)
- Consistent font sizes (10-12pt body, 14-16pt headers)
- Clear section headers
- Adequate white space
- Avoid graphics or complex designs that may confuse ATS

Target Industry: ${industry}

Analyze the uploaded resume file and provide comprehensive, actionable feedback focusing on structure, content, and potential improvements. Also include suggestions and examples for enhancing the resume based on the candidate's experience level and target industry in each section.
Use the sentences like you are directly talking to the candidate and providing feedback.`;

  return RESUME_REVIEW_PROMPT;
}

async function getFileBase64(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64"); // Buffer to base64
  return base64String;
}

export async function generateFeedback(
  file: File,
  apiKey: string,
  model: string,
  industry: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", model);
  formData.append("industry", industry);
  let response = {
    data: "",
    success: false,
  };

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const genAIModel = genAI.getGenerativeModel({ model: model });

    const prompt = generatePrompt(industry);
    const filetype = file.type;
    const fileBytes = await getFileBase64(file);

    const result = await genAIModel.generateContent([
      {
        inlineData: {
          data: fileBytes,
          mimeType: filetype,
        },
      },
      prompt,
    ]);

    response = {
      data: await result.response.text(),
      success: true,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error generating feedback:", error);
    response = {
      data: `Failed to generate feedback. Please try again. || Error: ${error.message}`,
      success: false,
    };
  }
  return response;
}
