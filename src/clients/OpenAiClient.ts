import fs from 'fs'
import path from 'path'
import { OpenAI } from 'openai'

export class OpenAiClient {
  constructor(public readonly openAiApiKeyFilePath: string) {
    if (!path.isAbsolute(openAiApiKeyFilePath)) {
      throw new Error(`openai api key file path must be absolute: ${openAiApiKeyFilePath}`)
      
    }
    const OPENAI_API_KEY = fs.readFileSync(openAiApiKeyFilePath, 'utf-8').trim()

    this.openAiClient = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
  }

  private openAiClient: OpenAI

  createEmbedding = async (text: string) => {
    const result = await this.openAiClient.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })

    console.log(`[OpenAiClient] createEmbedding: usage: ${JSON.stringify(result.usage, null, 2)}`)

    return result.data
  }

  createChatCompletion = async (messages: Parameters<typeof this.openAiClient.chat.completions.create>[0]['messages']) => {
    const result = await this.openAiClient.chat.completions.create({
      model: 'gpt-4',
      messages,
    })

    console.log(`[OpenAiClient] createChatCompletion: usage: ${JSON.stringify(result.usage, null, 2)}`)

    if (!result.choices[0]?.message) {
      throw new Error('[OpenAiClient]: Failed to get message')
    }

    return result.choices[0].message
  }
}
