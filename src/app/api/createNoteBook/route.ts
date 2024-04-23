// /api/createNoteBook

import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const runtime = "edge" // nextJS vercel wll detect it. and automatically will deploy this function on the edge runtime. instead of the normal nodeTS runtime.

export async function POST(req: Request) {
    const { userId } = auth();

    if (!userId) {
        return new NextResponse('unauthorised', { status: 401 })
    }
    const body = await req.json()
    const { name } = body;

    const image_description = await generateImagePrompt(name) // time to generate img description.
    console.log('image_decription ::', image_description)

    if (!image_description) {
        return new NextResponse("failed to generate image description from openai", { status: 500 })
    }

    // dalle url valind only two hours, we need to save that into another permanent storage. In this case we are using firebase 
    const image_url = await generateImage(image_description); // time to generate img from openai DALL.E

    if (!image_url) {
        return new NextResponse("failed to generate image", { status: 500 })
    }

    const note_ids = await db.insert($notes).values({ // save to neon DB using drizzle ORM
        name: name,
        userId,
        imageUrl: image_url
    }).returning({ insertedId: $notes.id })

    console.log('note res from db ::', note_ids);

    return NextResponse.json({
        note_id: note_ids[0].insertedId
    })
    // return new NextResponse('ok')
}