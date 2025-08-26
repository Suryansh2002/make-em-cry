import "server-only";

import path from 'path';
import OpenAI from 'openai';
import { GoogleGenAI, Modality, } from '@google/genai';
import { findCharacterByName, loadData } from './file';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImage(character: Character){
    let imageData: string|undefined = undefined;

    const prompt = `
        Generate a simple 2d cartoonish fun image,
        Don't have any background in the image,
        Full body of character and face should be visible,

        Use the following details to create the image: ${JSON.stringify(character)}
    `;

    const response = gemini.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE]
        }
    });

    const candidates = (await response).candidates;
    if (!candidates || !candidates[0].content || !candidates[0].content.parts){
        return
    }
    for (const part of candidates[0].content?.parts){
        if (part.text) {
            console.log(part.text);
        } else if (part.inlineData) {
            imageData = part.inlineData.data as string;
            const buffer = Buffer.from(imageData, "base64");
            await writeFile(path.join(process.cwd(), `uploads/images/${character.name}.png`), buffer);
        }
    }

    if (!imageData){
        return
    }

    const contents = [
        { text: "Can you make the person cry?" },
        {
        inlineData: {
            mimeType: "image/png",
            data: imageData,
        },
        },
    ];
    const editResponse = await gemini.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: contents,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE]
        }
    });

    const editCandidates = (await editResponse).candidates;
    if (!editCandidates || !editCandidates[0].content || !editCandidates[0].content.parts){
        return
    }
    for (const part of editCandidates[0].content?.parts){
        if (part.text) {
            console.log(part.text);
        } else if (part.inlineData) {
            const imageData = part.inlineData.data as string;
            const buffer = Buffer.from(imageData, "base64");
            await writeFile(path.join(process.cwd(), `uploads/images/${character.name}-crying.png`), buffer);
        }
  }
}

export async function generateCharacter(){
    let allData = await loadData();
    const names = allData.map(character => character.name);
    const professions = allData.map(character => character.profession);
    // @typescript
    const tools:any[] = [
        {
            type: "function",
            name: "generateCharacter",
            description: "Generates a random character.",
            parameters: {
                type: "object",
                properties: {
                    name: {type: "string"},
                    introduction: {type: "string", description: "A brief introduction about the character."},
                    age: {type: "number", description: "The age of the character."},
                    profession: {type: "string", description: "The profession of the character."},
                    gender: {type: "string", enum: ["male", "female"]},
                    looks: {type: "string", enum: ["fat", "skinny", "fit", "slim", "chubby", "athletic"]},
                    skin: {type: "string", enum: ["light", "tan", "dark"]}
                },
                required: ["name", "introduction", "age", "profession", "gender", "looks", "skin"],
                additionalProperties: false
            },
            strict: true,
        }

    ]
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {role: "user", content: `Generate a random character but don't use these names: ${names.join(", ")} and don't use these professions: ${professions.join(", ")}`}
        ],
        tools,
        tool_choice: "required"
    })
    // @ts-expect-error 
    const character: Character = {id: uuidv4(), ...JSON.parse(response.output[0].arguments)};
    allData = await loadData();
    allData.push(character);
    await writeFile(path.join(process.cwd(), "uploads/info.json"), JSON.stringify(allData, null, 2));

    await generateImage(character);
}

export async function checkCry(name: string, responseString: string): Promise<boolean> {
    const character = await findCharacterByName(name);
    const prompt = `
    You are a fun, humor filled game where we try to make characters cry.
    Game has easy difficulty i.e. It's easy to make the characters cry with right prompts.

    Character is ${JSON.stringify(character)}

    User said: ${responseString}

    Does the user response make the character cry?
    `
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {role: "user", content: prompt}
        ],
        tools: [
            {
                type: "function",
                name: "checkCry",
                description: "Checks if the user response makes the character cry.",
                parameters: {
                    type: "object",
                    properties: {
                        cried: {type: "boolean"},
                    },
                    required: ["cried"],
                    additionalProperties: false
                },
                strict: true,
            }
        ],
        tool_choice: "required"
    })
    // @ts-expect-error
    const result:any = JSON.parse(response.output[0].arguments);
    return result.cried;
}
