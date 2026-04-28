"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { type LinkItem as LinkType } from "@/data/links"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Trash2, 
  Pencil, 
  Check, 
  X, 
  AlertCircle,
  Loader2 
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

const linkSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  url: z.string().url("올바른 주소(https://...) 형식을 입력해주세요").min(1, "주소를 입력해주세요"),
})

type LinkFormValues = z.infer<typeof linkSchema>

interface DashboardLinkItemProps {
  link: LinkType
  onUpdate: (id: string, title: string, url: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isUpdating?: boolean
}

export function DashboardLinkItem({ link, onUpdate, onDelete, isUpdating = false }: DashboardLinkItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isInternalUpdating, setIsInternalUpdating] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    }
  })

  const onEditToggle = () => {
    if (isEditing) {
      reset({ title: link.title, url: link.url })
    }
    setIsEditing(!isEditing)
  }

  const handleUpdate = async (data: LinkFormValues) => {
    setIsInternalUpdating(true)
    try {
      await onUpdate(link.id, data.title, data.url)
      setIsEditing(false)
    } finally {
      setIsInternalUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsInternalUpdating(true)
    try {
      await onDelete(link.id)
      setShowDeleteModal(false)
    } finally {
      setIsInternalUpdating(false)
    }
  }

  const isLoading = isUpdating || isInternalUpdating

  return (
    <Card className="flex flex-col gap-3 p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
      {isEditing ? (
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4 w-full">
          <div className="space-y-3">
            <div className="space-y-1">
              <Input
                {...register("title")}
                placeholder="제목"
                disabled={isLoading}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-[10px] font-medium text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Input
                {...register("url")}
                placeholder="https://..."
                disabled={isLoading}
                className={errors.url ? "border-destructive" : ""}
              />
              {errors.url && (
                <p className="text-[10px] font-medium text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.url.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={onEditToggle}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" /> 취소
            </Button>
            <Button 
              type="submit" 
              size="sm"
              disabled={isLoading}
              className="min-w-[60px]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-5">
          <div className="bg-linear-to-br from-muted to-muted/50 p-3 rounded-md shrink-0 border border-border">
            <img 
              src={`https://www.google.com/s2/favicons?domain=${(() => {
                try { return new URL(link.url).hostname; } 
                catch { return ""; }
              })()}&sz=64`} 
              alt="" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg truncate text-foreground">{link.title}</h4>
            <p className="text-sm text-muted-foreground truncate font-medium">{link.url}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={onEditToggle}
              disabled={isLoading}
              className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full h-9 w-9"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => setShowDeleteModal(true)}
              disabled={isLoading}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full h-9 w-9"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription className="pt-2">
              <span className="font-semibold text-foreground">"{link.title}"</span> 링크를 삭제합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium text-destructive flex items-center gap-2 bg-destructive/5 p-3 rounded-lg border border-destructive/10">
              <AlertCircle className="h-4 w-4" /> 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
              className="font-bold shadow-sm min-w-[80px]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
