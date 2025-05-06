'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function ImagePreview({ src, alt, width, height, className }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="group relative overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn(
              "transition-transform duration-300 ease-in-out group-hover:scale-110",
              className
            )}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-30" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 h-[90vh] rounded bg-card">
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: 'contain' }}
            sizes="90vw"
            priority
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}