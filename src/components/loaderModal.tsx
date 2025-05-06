"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { Loader2 } from 'lucide-react'

interface LoaderProps {
  isLoading: boolean
}

export function LoaderModal({ isLoading }: LoaderProps) {
  return (
    <Dialog open={isLoading} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <div className="flex items-center justify-center space-x-2">
          {/* <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg font-semibold">Uploading</p> */}
          <Image src={'/uploadAnimation.gif'} alt="hi" height={200} width={200}/>
        </div>
      </DialogContent>
    </Dialog>
  )
}

