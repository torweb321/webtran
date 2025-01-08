'use client'

import { useEffect, useState } from 'react'
import FileUpload from './components/FileUpload'
import AuthForm from './components/Auth/AuthForm'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {user ? (
        <>
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">File Translation App</h1>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <FileUpload />
            </div>
          </main>
        </>
      ) : (
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              File Translation App
            </h1>
            <p className="text-lg text-gray-600">
              轻松翻译您的文档。支持 TXT、PDF、DOC 和 DOCX 文件格式。
            </p>
          </div>
          
          <div className="flex justify-center">
            <AuthForm />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">多种格式</h3>
              <p className="text-gray-600">
                支持 TXT、PDF、DOC 和 DOCX 文件
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">多种语言</h3>
              <p className="text-gray-600">
                支持中文、英语、日语等多种语言
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">即时下载</h3>
              <p className="text-gray-600">
                翻译完成后立即下载
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
