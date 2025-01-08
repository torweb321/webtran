import FileUpload from './components/FileUpload'

export const metadata = {
  title: 'File Translation App',
  description: 'Translate your files using DeepSeek API',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            File Translation App
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Easily translate your documents to multiple languages. Support for TXT, PDF, DOC, and DOCX files.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <FileUpload />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Multiple Formats</h3>
            <p className="text-gray-600">
              Support for TXT, PDF, DOC, and DOCX files
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">9+ Languages</h3>
            <p className="text-gray-600">
              Translate to English, Chinese, Spanish, and more
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Instant Download</h3>
            <p className="text-gray-600">
              Download your translated files immediately
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
