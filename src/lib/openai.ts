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
                    content: `You are an creative and helpfull AI assistante capable of generating interesting thumbnail description for my notes. 
                    Your output will be fed into the DALLE API to generate the thumbnail. The description should be minimalistic and flat styled`
                },
                {
                    role: "user",
                    content: `Please generate a thumbnail description for my notebook title ${name}`
                }
            ]
        })

        const data = await response.json()

        console.log('openAI json res ::', data)

        /////////////////////////////////////////////////////////////////////////////
        // openAI json res :: {
        //     id: 'chatcmpl-93J5KrX80OUC9A2o6GXf7xRHa2qgk',
        //     object: 'chat.completion',
        //     created: 1710575374,
        //     model: 'gpt-3.5-turbo-0125',
        //     choices: [
        //       {
        //         index: 0,
        //         message: [Object],
        //         logprobs: null,
        //         finish_reason: 'stop'
        //       }
        //     ],
        //     usage: { prompt_tokens: 65, completion_tokens: 10, total_tokens: 75 },
        //     system_fingerprint: 'fp_4f2ebda25a'
        //   }
        /////////////////////////////////////////////////////////////////////////////

        const image_description = data.choices[0].message.content
        return image_description as string
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function generateImage(image_description: string) {
    try {
        const response = await openai.createImage({
            prompt: image_description,
            n: 1, // how many images are needed
            size: '256x256'
        })
        const data = await response.json()

        /////////////////////////////////////////////////////////////////////////////
        // res json from open-ai image ::  {
        //     created: 1710575382,
        //     data: [
        //       {
        //         url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-vcgYHtTCckxYQm47B5TG69Pa/user-eDTTCUMQ0457ZXkr1SR0Uysy/img-0SKN6IgSVuSwS6nS7EyqVe2g.png?st=2024-03-16T06%3A49%3A42Z&se=2024-03-16T08%3A49%3A42Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-16T07%3A15%3A09Z&ske=2024-03-17T07%3A15%3A09Z&sks=b&skv=2021-08-06&sig=U1ZfO%2B//kYuvTjUJjxpGQyZR1bGt%2Bkkq8KDysFa2f0M%3D'
        //       }
        //     ]
        //   }
        /////////////////////////////////////////////////////////////////////////////

        console.log('res json from open-ai image :: ', data)
        const image_url = data.data[0].url
        return image_url as string
    } catch (error) {
        console.error(error)
    }
}