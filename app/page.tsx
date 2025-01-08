import FileUpload from './components/FileUpload'

export const metadata = {
  title: 'File Translation App',
  description: 'Translate your files using DeepSeek API',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          File Translation App
        </h1>
        <FileUpload />
      </div>
    </main>
  )
}
