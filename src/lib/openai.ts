import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export async function generateImagePrompt(name: string) {
    // name-('math') -> detailed description
    // after that  we feed into generateImage function
    // because DALLE api (more detailed your description) the better the image result is get.

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an creative and helpfull AI assistante capable of generating interesting thumbnail description for my notes. Your output will be fed into the DALLE API to generate the thumbnail. The description should be minimalistic and flat styled'
                },
                {
                    role: "user",
                    content: `Please generate a thumbnail description for my notebook title ${name}`
                }
            ]
        })

        const data = await response.json()

        console.log('openAI json res ::', data)
        const image_description = data.choices[0].message.content
        return image_description as string
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function generateImage() {

}