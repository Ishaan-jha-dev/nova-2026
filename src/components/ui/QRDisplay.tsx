'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'

interface QRDisplayProps {
  value: string
  size?: number
  label?: string
  downloadName?: string
}

export function QRDisplay({ value, size = 200, label, downloadName = 'nova-qr' }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: '#FF3366', // Nova Primary Pink
        light: '#ffffff', // White background
      },
      errorCorrectionLevel: 'H',
    })
  }, [value, size])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${downloadName}.png`
    a.click()
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="rounded-2xl overflow-hidden bg-white shadow-[0_8px_25px_rgba(255,51,102,0.15)] border border-[#FF3366]/10 p-2">
        <canvas ref={canvasRef} style={{ display: 'block' }} className="rounded-xl" />
      </div>
      {label && <p className="text-[#FF3366] font-display font-bold text-sm uppercase tracking-wider text-center mt-2">{label}</p>}
      
      <button
        onClick={handleDownload}
        className="flex items-center justify-center gap-2 bg-[#FF3366]/5 border border-[#FF3366]/20 rounded-xl px-5 py-2.5 mt-1 w-full hover:bg-[#FF3366] hover:text-white text-[#FF3366] transition-all duration-300 group"
      >
        <Download size={16} />
        <span className="font-bold uppercase tracking-wider text-xs">Download QR</span>
      </button>
    </div>
  )
}


