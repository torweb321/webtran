'use client'

import { useState } from 'react'
import { API_URL } from '../config'

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

      console.log('Uploading file:', file.name)
      console.log('Target language:', targetLang)

      const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Translation failed:', data)
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
          >
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <span>Click to upload</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".txt,.pdf,.doc,.docx"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: .txt, .pdf, .doc, .docx
                </p>
              </div>
            </div>
          </label>
        </div>

        {file && (
          <div className="w-full text-center">
            <p className="text-sm text-gray-600">
              Selected file: {file.name}
            </p>
          </div>
        )}

        {error && (
          <div className="w-full text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || translating}
          className={`w-full px-4 py-2 rounded-md text-white font-medium ${
            !file || translating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {translating ? 'Translating...' : 'Translate'}
        </button>

        {result && (
          <div className="w-full">
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Translation Result
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 whitespace-pre-wrap">
                {result}
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Download Translation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
