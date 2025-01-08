'use client'

import { useState } from 'react'

const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'zh': 'Chinese',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ru': 'Russian',
  'ar': 'Arabic'
}

const SUPPORTED_FILE_TYPES = [
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const SUPPORTED_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx']

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [translating, setTranslating] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [targetLang, setTargetLang] = useState('en')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileName = selectedFile.name.toLowerCase()
      
      if (!SUPPORTED_FILE_TYPES.includes(selectedFile.type) &&
          !SUPPORTED_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
        setError('Please upload a supported file type (.txt, .pdf, .doc, .docx)')
        return
      }
      
      setFile(selectedFile)
      setError('')
      setResult('')
    }
  }

  const handleDownload = () => {
    if (!result) return

    const blob = new Blob([result], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translated_${file?.name.replace(/\.[^/.]+$/, '')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setTranslating(true)
      setError('')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('targetLang', targetLang)

      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Translation failed')
      }

      setResult(data.translation)
    } catch (error) {
      console.error('Translation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to translate file')
    } finally {
      setTranslating(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Language
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <label
          htmlFor="file-upload"
          className="w-full h-32 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: .txt, .pdf, .doc, .docx
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".txt,.pdf,.doc,.docx"
          />
        </label>

        {file && (
          <div className="text-sm text-gray-500">
            Selected file: {file.name}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || translating}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {translating ? 'Translating...' : 'Translate'}
        </button>

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {result && (
          <div className="w-full mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Translation Result:</h3>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
              >
                Download
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap border border-gray-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
