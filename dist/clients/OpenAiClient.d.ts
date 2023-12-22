import { OpenAI } from 'openai';
export declare class OpenAiClient {
    readonly openAiApiKeyFilePath: string;
    constructor(openAiApiKeyFilePath: string);
    private openAiClient;
    createEmbedding: (text: string) => Promise<OpenAI.Embeddings.Embedding[]>;
    createChatCompletion: (messages: Parameters<typeof this.openAiClient.chat.completions.create>[0]['messages']) => Promise<OpenAI.Chat.Completions.ChatCompletionMessage>;
}
//# sourceMappingURL=OpenAiClient.d.ts.map