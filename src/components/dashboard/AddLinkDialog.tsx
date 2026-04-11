"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, AlertCircle } from "lucide-react"

// Zod 스키마 정의
const linkSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  url: z.string().url("올바른 주소(https://...) 형식을 입력해주세요").min(1, "주소를 입력해주세요"),
})

type LinkFormValues = z.infer<typeof linkSchema>

interface AddLinkDialogProps {
  onAdd: (title: string, url: string) => void
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    }
  })

  const onSubmit = (data: LinkFormValues) => {
    onAdd(data.title, data.url)
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) reset()
    }}>
      <DialogTrigger render={<Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add New Link</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700">Title</label>
            <Input
              id="title"
              placeholder="e.g. My Website"
              {...register("title")}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.title && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-semibold text-gray-700">URL</label>
            <Input
              id="url"
              placeholder="https://example.com"
              {...register("url")}
              className={errors.url ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.url && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.url.message}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="font-medium">
              Cancel
            </Button>
            <Button type="submit" className="font-bold shadow-md">
              Add Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
