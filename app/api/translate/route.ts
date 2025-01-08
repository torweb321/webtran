import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const config = {
  api: {
    bodyParser: false,
  },
}

async function extractTextFromFile(file: File): Promise<string> {
  return await file.text()
}

async function translateText(text: string, targetLang: string): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLang}. Keep the original formatting and structure.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3
    })
  })

  if (!response.ok) {
    throw new Error('Translation API error')
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const targetLang = formData.get('targetLang') as string || 'en'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const text = await extractTextFromFile(file)
    const translation = await translateText(text, targetLang)

    // Store in Supabase
    const { data, error } = await supabase
      .from('translations')
      .insert([
        {
          original_text: text,
          translated_text: translation,
          target_language: targetLang,
          file_name: file.name
        }
      ])

    if (error) {
      console.error('Supabase error:', error)
    }

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
