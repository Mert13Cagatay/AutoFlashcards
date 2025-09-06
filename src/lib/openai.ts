import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Only for client-side usage, consider moving to API routes for production
});

export interface FlashcardData {
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface GenerateFlashcardsOptions {
  text: string;
  count?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  categories?: string[];
}

export async function generateFlashcards({ 
  text, 
  count = 10, 
  difficulty = 'mixed',
  categories = []
}: GenerateFlashcardsOptions): Promise<FlashcardData[]> {
  console.log('🚀 OpenAI API call started - Generating flashcards...');
  console.log('📊 Parameters:', { count, difficulty, categories: categories.length });
  
  try {
    const prompt = `
You are an expert educational content creator. Generate ${count} high-quality flashcards from the following text.

Text content:
${text}

Instructions:
- Create diverse, meaningful questions that test understanding
- Include a mix of factual recall and conceptual understanding
- Questions should be clear and unambiguous
- Answers should be concise but complete
- Assign appropriate difficulty levels: easy, medium, hard
- Categorize each flashcard by topic/subject
- Add relevant tags for better organization
${difficulty !== 'mixed' ? `- Focus on ${difficulty} difficulty level` : ''}
${categories.length > 0 ? `- Focus on these categories: ${categories.join(', ')}` : ''}

Return the flashcards as a JSON array with this exact format:
[
  {
    "question": "Clear, specific question",
    "answer": "Concise, accurate answer",
    "category": "Subject/topic name",
    "difficulty": "easy|medium|hard",
    "tags": ["tag1", "tag2", "tag3"]
  }
]

Ensure the JSON is valid and properly formatted.`;

    console.log('📡 Sending request to OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in creating effective study flashcards. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });
    console.log('✅ OpenAI API response received successfully');

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in response');
    }

    const flashcards = JSON.parse(jsonMatch[0]) as FlashcardData[];
    
    // Validate the structure
    const validatedFlashcards = flashcards.map((card, index) => {
      if (!card.question || !card.answer || !card.category || !card.difficulty) {
        throw new Error(`Invalid flashcard structure at index ${index}`);
      }
      
      return {
        question: card.question.trim(),
        answer: card.answer.trim(),
        category: card.category.trim(),
        difficulty: card.difficulty as 'easy' | 'medium' | 'hard',
        tags: Array.isArray(card.tags) ? card.tags.map(tag => tag.trim()) : []
      };
    });

    return validatedFlashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error(`Failed to generate flashcards: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function improveSingleFlashcard(flashcard: FlashcardData): Promise<FlashcardData> {
  try {
    const prompt = `
Improve this flashcard to make it more effective for learning:

Original flashcard:
Question: ${flashcard.question}
Answer: ${flashcard.answer}
Category: ${flashcard.category}
Difficulty: ${flashcard.difficulty}

Instructions:
- Make the question clearer and more specific
- Ensure the answer is concise but complete
- Maintain the same difficulty level and category
- Improve tags for better organization

Return the improved flashcard as JSON with this format:
{
  "question": "Improved question",
  "answer": "Improved answer",
  "category": "${flashcard.category}",
  "difficulty": "${flashcard.difficulty}",
  "tags": ["improved", "tags"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON object found in response');
    }

    const improvedCard = JSON.parse(jsonMatch[0]) as FlashcardData;
    
    return {
      question: improvedCard.question.trim(),
      answer: improvedCard.answer.trim(),
      category: improvedCard.category.trim(),
      difficulty: improvedCard.difficulty,
      tags: Array.isArray(improvedCard.tags) ? improvedCard.tags.map(tag => tag.trim()) : []
    };
  } catch (error) {
    console.error('Error improving flashcard:', error);
    // Return original flashcard if improvement fails
    return flashcard;
  }
}

export const googleBrandColors = {
  blue: '#4285F4',
  red: '#DB4437',
  yellow: '#F4B400',
  green: '#0F9D58'
} as const;

export function getCategoryColor(category: string): string {
  const colors = Object.values(googleBrandColors);
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
