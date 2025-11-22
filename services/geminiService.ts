import { GoogleGenAI, Type } from "@google/genai";
import { KpiSuggestion } from '../types';
import { FormState } from '../components/GeneratorForm';

function getBusinessTypeDescription(type: string): string {
    switch (type) {
        case 'software': return 'A software or SaaS (Software as a Service) platform.';
        case 'manufacturing': return 'A manufacturing company that produces physical goods.';
        case 'logistics': return 'A logistics and supply chain company.';
        case 'ecommerce': return 'An e-commerce business that sells products online.';
        case 'service': return 'A business that provides professional services to clients (e.g., consulting, agency).';
        default: return 'A standard business.';
    }
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        categories: {
            type: Type.ARRAY,
            description: "A list of KPI categories relevant to the business type.",
            items: {
                type: Type.OBJECT,
                properties: {
                    categoryName: {
                        type: Type.STRING,
                        description: "Name of the KPI category (e.g., 'Operational Efficiency', 'Financial Performance')."
                    },
                    kpis: {
                        type: Type.ARRAY,
                        description: "A list of specific KPIs within this category.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: {
                                    type: Type.STRING,
                                    description: "The name of the Key Performance Indicator (e.g., 'Overall Equipment Effectiveness (OEE)')."
                                },
                                description: {
                                    type: Type.STRING,
                                    description: "A brief, one-sentence explanation of what this KPI measures."
                                }
                            },
                            required: ["name", "description"]
                        }
                    }
                },
                required: ["categoryName", "kpis"]
            }
        }
    },
    required: ["categories"],
};

export async function generateKpiSuggestions(formState: FormState): Promise<KpiSuggestion> {
  // Initialize the AI client inside the function to ensure process.env is available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const { businessName, businessType } = formState;

  const businessTypeDesc = getBusinessTypeDescription(businessType);

  const prompt = `
    You are an expert business intelligence consultant. Your task is to generate a list of relevant Key Performance Indicators (KPIs) for a company named "${businessName}".

    The company's industry is: ${businessTypeDesc}.

    Generate a list of 3-4 relevant categories of KPIs for this type of business. For each category, provide 3-4 specific KPIs.
    
    For example, for a manufacturing company, categories could be "Production Metrics", "Quality Assurance", and "Inventory Management".

    The output MUST be a valid JSON object matching the provided schema.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.5,
    },
  });
  
  try {
    const jsonText = response.text?.trim();
    if (!jsonText) {
      throw new Error("The AI returned an empty response.");
    }
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation
    if (parsedJson && Array.isArray(parsedJson.categories)) {
        return parsedJson as KpiSuggestion;
    } else {
        throw new Error("Parsed JSON does not match the expected KpiSuggestion structure.");
    }
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", response.text);
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}