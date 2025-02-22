import { DEFAULT_MODEL_RESUME_EXTRACTION } from "@/lib/config";
import {
  generateFeedbackPrompt,
  generateResumeExtractionPrompt,
} from "@/lib/prompt_utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Buffer } from "buffer";
import { exportDocx, resumeDataType } from "./generate_resume";

async function getFileBase64(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64"); // Buffer to base64
  return base64String;
}

async function getGenAIModel(apiKey: string, model: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const genAIModel = genAI.getGenerativeModel({ model: model });
  return genAIModel;
}

async function inlineDataObject(file: File) {
  try {
    const filetype = file.type;
    const fileBytes = await getFileBase64(file);

    return {
      data: fileBytes,
      mimeType: filetype,
    };
  } catch (error: unknown) {
    console.error("Error creating inline data object:", error);
    return {
      data: "",
      mimeType: "",
    };
  }
}

type GenerateResponseLLMPayload = {
  apiKey: string;
  model: string;
  prompt: string;
  inlineData: { data: string; mimeType: string };
};

async function generateResponseLLM(payload: GenerateResponseLLMPayload) {
  let response = {
    data: "",
    message: "",
    success: false,
  };

  try {
    const genAIModel = await getGenAIModel(payload.apiKey, payload.model);
    const result = await genAIModel.generateContent([
      {
        inlineData: payload.inlineData,
      },
      payload.prompt,
    ]);

    response = {
      data: await result.response.text(),
      message: "Feedback generated successfully.",
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error generating response:", error);
    response = {
      message: `Failed to generate response. Please try again. || Error: ${
        (error as Error).message
      }`,
      data: "",
      success: false,
    };
  }

  return response;
}

export async function generateFeedback(
  file: File,
  apiKey: string,
  model: string,
  industry: string
) {
  const inlineData = await inlineDataObject(file);
  const prompt = generateFeedbackPrompt(industry);
  const response = generateResponseLLM({
    apiKey,
    model,
    prompt,
    inlineData,
  });

  return response;
}

export async function generateResume(file: File, apiKey: string) {
  let response = {
    data: "",
    success: false,
    message: "",
  };

  try {
    const extractedData = await extractDataFromResume(file, apiKey);
    if (!extractedData.success) {
      return extractedData;
    }
    let data = extractedData.data;
    data = data.replace("```json\n", "").replace("```", "");
    data = JSON.parse(data);
    await exportDocx(data as unknown as resumeDataType);
    response = {
      data: data,
      message: "Resume generated successfully.",
      success: true,
    };
  } catch (error) {
    response = {
      message: `Failed to generate resume. Please try again. || Error: ${
        (error as Error).message
      }`,
      data: "",
      success: false,
    };
  }

  return response;
}

export async function extractDataFromResume(file: File, apiKey: string) {
  const inlineData = await inlineDataObject(file);
  const prompt = generateResumeExtractionPrompt();
  const response = generateResponseLLM({
    apiKey,
    model: DEFAULT_MODEL_RESUME_EXTRACTION,
    prompt,
    inlineData,
  });
  return response;
}
