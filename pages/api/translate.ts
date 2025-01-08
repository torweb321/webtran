import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import pdfParse from 'pdf-parse'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'Translation service not configured' })
  }

  try {
    const form = formidable({})
    const [fields, files] = await form.parse(req)
    
    const file = files.file?.[0]
    const targetLang = fields.targetLang?.[0] || 'en'

    if (!file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    let text = ''
    const fileName = file.originalFilename?.toLowerCase() || ''

    try {
      if (fileName.endsWith('.txt')) {
        text = fs.readFileSync(file.filepath, 'utf-8')
      } else if (fileName.endsWith('.pdf')) {
        const dataBuffer = fs.readFileSync(file.filepath)
        const pdfData = await pdfParse(dataBuffer)
        text = pdfData.text
      } else {
        return res.status(400).json({ error: 'Unsupported file type' })
      }
    } catch (error) {
      console.error('Error extracting text:', error)
      return res.status(400).json({ error: 'Failed to extract text from file' })
    } finally {
      // Clean up the temp file
      fs.unlinkSync(file.filepath)
    }

    if (!text.trim()) {
      return res.status(400).json({ error: 'No text content found in file' })
    }

    // Call DeepSeek API for translation
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
            role: "user",
            content: `Translate the following text to ${targetLang}. Only return the translated text without any explanations or additional content:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API error:', errorText)
      return res.status(500).json({ error: 'Translation service error' })
    }

    const translationData = await response.json()
    if (!translationData.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: 'Invalid response from translation service' })
    }

    const translatedText = translationData.choices[0].message.content
    return res.status(200).json({ translation: translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return res.status(500).json({ 
      error: 'Translation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
