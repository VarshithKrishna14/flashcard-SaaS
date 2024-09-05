import { NextResponse } from 'next/server';
import { ReadableStream } from 'stream/web'; // Ensure you're using correct polyfill if not native in NodeJS

// Mocking Groq SDK (Replace with actual SDK and ensure correct import)
import { Groq } from "groq-sdk"; // Ensure this is correct based on actual SDK documentation

// Initialize Groq with the correct API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        // Parse the request body
        const { text } = await req.json();
        
        // System message to guide the AI on generating flashcards
        const systemPrompt = {
            role: "system",
            content: `You are an AI-powered Flashcard Generator named StudyBot, designed to create educational flashcards on various topics. Your primary goal is to generate flashcards that help users learn and reinforce key concepts.

When generating flashcards, ensure that:
- The generated answer should be restricted to 2 lines only
- The flashcards are structured in a clear and concise format.
- Each flashcard should contain a "question" and a "answer" in JSON format.
- The "question" should cover a key concept, term, or principle within the user's requested topic.
- Ensure the information is accurate, educational, and easy to understand.
- Tailor the difficulty level of the flashcards to the user's expertise (beginner, intermediate, advanced) if specified.
- Generate 10 flashcards based on the user's input, regardless of the topic.

Output the flashcards in the following JSON format:
[
  {
    "question": "What is a neural network?",
    "answer": "A neural network is a computational model inspired by the way neural networks in the human brain process information."
  },
  {
    "question": "Define supervised learning.",
    "answer": "Supervised learning is a type of machine learning where the model is trained on labeled data."
  }
]
  Make sure to provide the question and answer only in JSON format not in the text format
`
        };

        // User message (assuming the text is from the input for generating flashcards)
        const userMessage = {
            role: "user",
            content: text
        };

        // Formulate the conversation (system message + user message)
        const conversation = [systemPrompt, userMessage];

        // Call the Groq API (replace with the correct method for completion)
        const chatCompletion = await groq.chat.completions.create({
            messages: conversation,
            model: "llama3-8b-8192",  // Ensure this is the correct model name
        });

        // Extract generated content
        const generatedText = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        // Create a readable stream with the generated text
        const stream = new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode(generatedText));
                controller.close();
            }
        });

        // Return the generated content as a response
        return new NextResponse(stream);
    } catch (error) {
        console.error('Exception:', error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }

}
