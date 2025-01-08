import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const config = {
  api: {
    bodyParser: false,
  },
}

async function extractTextFromFile(file: formidable.File): Promise<string> {
  const fileType = file.mimetype || ''
  const filePath = file.filepath
  const fileContent = await fs.promises.readFile(filePath)

  if (fileType.includes('pdf')) {
    const pdfData = await pdf(fileContent)
    return pdfData.text
  } else if (fileType.includes('msword') || fileType.includes('wordprocessingml')) {
    const result = await mammoth.extractRawText({ buffer: fileContent })
    return result.value
  } else {
    // Assume it's a text file
    return fileContent.toString()
  }
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
    const form = formidable({})
    const [fields, files] = await new Promise((resolve, reject) => {
      const chunks: any[] = []
      req.body?.pipeThrough(new TransformStream({
        transform(chunk, controller) {
          chunks.push(chunk)
          controller.enqueue(chunk)
        }
      }))
      
      form.parse(new Blob(chunks), (err, fields, files) => {
        if (err) reject(err)
        else resolve([fields, files])
      })
    })

    if (!files.file || Array.isArray(files.file)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const targetLang = fields.targetLang?.[0] || 'en'
    const text = await extractTextFromFile(files.file)
    const translation = await translateText(text, targetLang)

    // Store in Supabase
    const { data, error } = await supabase
      .from('translations')
      .insert([
        {
          original_text: text,
          translated_text: translation,
          target_language: targetLang,
          file_name: files.file.originalFilename
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
