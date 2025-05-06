'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const VIDEO_ID = 'qGC3DJH8rVU' // Replace with your desired YouTube video ID

let openModalFunction: (() => void) | null = null

export function openYoutubeModal() {
  if (openModalFunction) {
    openModalFunction()
  }
}

export function YoutubeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    openModalFunction = () => setIsOpen(true)
    return () => {
      openModalFunction = null
    }
  }, [])

  const closeModal = () => setIsOpen(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[720px] bg-transparent border-none [&>button:last-child]:hidden">
        <div className="relative pt-[56.25%]">
          {isOpen && (
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          )}
        </div>
        <DialogClose className="absolute top-[-20px] right-4 text-red-600 text-2xl hover:text-red-800 focus:ring focus:ring-red-400">
          ✖
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

