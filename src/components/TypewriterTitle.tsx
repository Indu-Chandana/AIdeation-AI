'use client'
import React from 'react'
import TypewriterComponent from 'typewriter-effect'

type Props = {}

const TypewriterTitle = (props: Props) => {
    return (
        <TypewriterComponent
            options={{ loop: true }}
            onInit={(typewriter) => {
                typewriter.typeString("Supercharged Productivity.")
                    .pauseFor(1000).deleteAll() // pause 1sec and delete all
                    .typeString("AI-Powered Insights.") // type again
                    .start()
            }}
        />
    )
}

export default TypewriterTitle