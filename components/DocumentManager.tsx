'use client'

import { useState, useRef, useCallback } from 'react'
import { StoredDocument } from '@/lib/types'
import { getDocuments, saveDocument, deleteDocument, generateId } from '@/lib/store'
import { estimateTokens } from '@/lib/chunker'

interface DocumentManagerProps {
  documents: StoredDocument[]
  onUpdate: () => void
}

export default function DocumentManager({ documents, onUpdate }: DocumentManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    setUploadError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al procesar el archivo')
      }

      const data = await res.json()

      // Determinar tipo de archivo
      const ext = file.name.split('.').pop()?.toLowerCase()
      let fileType: 'pdf' | 'txt' | 'md' = 'txt'
      if (ext === 'pdf') fileType = 'pdf'
      else if (ext === 'md') fileType = 'md'

      // Guardar documento en localStorage
      const doc: StoredDocument = {
        id: data.docId,
        name: file.name,
        size: file.size,
        fileType,
        uploadedAt: new Date().toISOString(),
        chunks: data.chunks,
        pageCount: data.pageCount,
        charCount: data.charCount,
      }

      saveDocument(doc)
      onUpdate()
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error al subir el archivo')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) await processFile(file)
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await processFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = (docId: string) => {
    deleteDocument(docId)
    onUpdate()
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (iso: string) => {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  }

  const totalChunks = documents.reduce((sum, d) => sum + d.chunks.length, 0)
  const totalTokens = documents.reduce(
    (sum, d) => sum + d.chunks.reduce((s, c) => s + estimateTokens(c.content), 0),
    0
  )

  return (
    <div>
      {/* Zona de drag & drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-blue bg-blue-light'
            : 'border-border hover:border-blue-mid hover:bg-blue-light/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div>
            <div className="w-10 h-10 border-3 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-text-mid font-medium">Procesando documento...</p>
            <p className="text-text-soft text-sm mt-1">Extrayendo texto y creando chunks</p>
          </div>
        ) : (
          <div>
            <svg className="w-10 h-10 mx-auto mb-3 text-text-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-text-mid font-medium">Arrastra un archivo aquí o haz clic para seleccionar</p>
            <p className="text-text-soft text-sm mt-1">PDF, TXT o MD — máximo 10MB</p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {uploadError}
        </div>
      )}

      {/* Estadísticas de contexto */}
      {documents.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-blue-light rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue">{documents.length}</p>
            <p className="text-xs text-text-mid">Documentos</p>
          </div>
          <div className="bg-blue-light rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue">{totalChunks}</p>
            <p className="text-xs text-text-mid">Chunks</p>
          </div>
          <div className="bg-blue-light rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue">~{(totalTokens / 1000).toFixed(1)}k</p>
            <p className="text-xs text-text-mid">Tokens aprox.</p>
          </div>
        </div>
      )}

      {/* Tabla de documentos */}
      {documents.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-text-mid font-medium">Nombre</th>
                <th className="text-left py-3 px-2 text-text-mid font-medium">Tipo</th>
                <th className="text-left py-3 px-2 text-text-mid font-medium">Tamaño</th>
                <th className="text-left py-3 px-2 text-text-mid font-medium">Chunks</th>
                <th className="text-left py-3 px-2 text-text-mid font-medium">Fecha</th>
                <th className="text-right py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} className="border-b border-border/50 hover:bg-blue-light/30 transition">
                  <td className="py-3 px-2 font-medium text-text truncate max-w-[200px]">{doc.name}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 bg-blue-light text-blue text-xs rounded-full uppercase">
                      {doc.fileType}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-text-mid">{formatSize(doc.size)}</td>
                  <td className="py-3 px-2 text-text-mid">{doc.chunks.length}</td>
                  <td className="py-3 px-2 text-text-mid text-xs">{formatDate(doc.uploadedAt)}</td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-400 hover:text-red-600 transition p-1"
                      title="Eliminar documento"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {documents.length === 0 && (
        <div className="mt-6 text-center text-text-soft text-sm">
          No hay documentos cargados. Sube pólizas y documentos para que el chatbot pueda responder consultas.
        </div>
      )}
    </div>
  )
}
