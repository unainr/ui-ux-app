"use server"
import { GENERATE_UI_SYSTEM_PROMPT } from '@/constants';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
interface Props{
  name:string;
}
export const generateUI = async ({name}:Props) => { 
    try {
      const {text} = await generateText({
        model:groq('openai/gpt-oss-20b'),
        system:GENERATE_UI_SYSTEM_PROMPT,
        prompt:name
      })

      return text
        
    } catch (error) {
        console.log(error)
    }

  }