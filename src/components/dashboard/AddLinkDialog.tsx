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
import { Plus, AlertCircle, Loader2 } from "lucide-react"

// Zod 스키마 정의
const linkSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  url: z.string().url("올바른 주소(https://...) 형식을 입력해주세요").min(1, "주소를 입력해주세요"),
})

type LinkFormValues = z.infer<typeof linkSchema>

interface AddLinkDialogProps {
  onAdd: (title: string, url: string) => void
  isLoading?: boolean
}

export function AddLinkDialog({ onAdd, isLoading = false }: AddLinkDialogProps) {
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
      if (isLoading) return;
      setOpen(val)
      if (!val) reset()
    }}>
      <DialogTrigger render={
        <Button 
          disabled={isLoading}
          className="w-full font-bold shadow-sm h-auto py-6 text-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          링크 추가하기
        </Button>
      } />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">새 링크 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-foreground">제목</label>
            <Input
              id="title"
              placeholder="예: 내 웹사이트"
              {...register("title")}
              disabled={isLoading}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.title && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-semibold text-foreground">주소 (URL)</label>
            <Input
              id="url"
              placeholder="https://example.com"
              {...register("url")}
              disabled={isLoading}
              className={errors.url ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.url && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.url.message}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isLoading} className="font-medium">
              취소
            </Button>
            <Button type="submit" className="font-bold shadow-md min-w-[80px]" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "추가하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
