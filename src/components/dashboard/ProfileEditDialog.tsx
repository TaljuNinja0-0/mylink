"use client"

import { useState, useEffect } from "react"
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
import { AlertCircle, Loader2, Pencil } from "lucide-react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const profileSchema = z.object({
  username: z.string().min(3, "3자 이상 입력해주세요").regex(/^[a-zA-Z0-9_]+$/, "영문자, 숫자, 언더스코어(_)만 사용 가능합니다"),
  displayName: z.string().min(2, "2자 이상 입력해주세요"),
  bio: z.string().max(100, "100자 이내로 입력해주세요"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileEditDialogProps {
  currentProfile: any
  userId: string
  onSave: (data: ProfileFormValues) => void
  isLoading?: boolean
}

export function ProfileEditDialog({ currentProfile, userId, onSave, isLoading = false }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [displayNameError, setDisplayNameError] = useState<string | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isCheckingDisplayName, setIsCheckingDisplayName] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
    }
  })

  // Set default values when dialog opens
  useEffect(() => {
    if (open && currentProfile) {
      reset({
        username: currentProfile.username || "",
        displayName: currentProfile.displayName || "",
        bio: currentProfile.bio || "",
      })
      setUsernameError(null)
      setDisplayNameError(null)
    }
  }, [open, currentProfile, reset])

  const usernameWatch = watch("username")
  const displayNameWatch = watch("displayName")

  // Debounced Username check
  useEffect(() => {
    const checkUsername = async () => {
      if (!usernameWatch || usernameWatch === currentProfile?.username) {
        setUsernameError(null)
        setIsCheckingUsername(false)
        return
      }
      setIsCheckingUsername(true)
      try {
        const q = query(collection(db, "users"), where("username", "==", usernameWatch))
        const querySnapshot = await getDocs(q)
        const isDuplicate = querySnapshot.docs.some(doc => doc.id !== userId)
        if (isDuplicate) {
          setUsernameError("이미 사용 중인 Username입니다")
        } else {
          setUsernameError(null)
        }
      } catch (error) {
        console.error("Username check failed", error)
      } finally {
        setIsCheckingUsername(false)
      }
    }

    setIsCheckingUsername(true)
    const timerId = setTimeout(() => {
      checkUsername()
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [usernameWatch, currentProfile?.username, userId])

  // Debounced DisplayName check
  useEffect(() => {
    const checkDisplayName = async () => {
      if (!displayNameWatch || displayNameWatch === currentProfile?.displayName) {
        setDisplayNameError(null)
        setIsCheckingDisplayName(false)
        return
      }
      setIsCheckingDisplayName(true)
      try {
        const q = query(collection(db, "users"), where("displayName", "==", displayNameWatch))
        const querySnapshot = await getDocs(q)
        const isDuplicate = querySnapshot.docs.some(doc => doc.id !== userId)
        if (isDuplicate) {
          setDisplayNameError("이미 사용 중인 이름입니다")
        } else {
          setDisplayNameError(null)
        }
      } catch (error) {
        console.error("DisplayName check failed", error)
      } finally {
        setIsCheckingDisplayName(false)
      }
    }

    setIsCheckingDisplayName(true)
    const timerId = setTimeout(() => {
      checkDisplayName()
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [displayNameWatch, currentProfile?.displayName, userId])

  const onSubmit = (data: ProfileFormValues) => {
    if (usernameError || displayNameError) return
    onSave(data)
    setOpen(false)
  }

  const isCheckingAny = isCheckingUsername || isCheckingDisplayName

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (isLoading) return;
      setOpen(val)
    }}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="shadow-sm">
          <Pencil className="mr-2 h-4 w-4" />
          프로필 편집
        </Button>
      } />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">프로필 편집</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-semibold text-foreground">Username</label>
            <Input
              id="username"
              placeholder="예: john_doe (영문, 숫자, _ 사용 가능)"
              {...register("username")}
              disabled={isLoading}
              className={errors.username || usernameError ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.username && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.username.message}
              </p>
            )}
            {usernameError && !errors.username && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {usernameError}
              </p>
            )}
            {!usernameError && !errors.username && usernameWatch && usernameWatch !== currentProfile?.username && !isCheckingUsername && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-green-600 mt-1">
                 사용 가능한 Username입니다.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-semibold text-foreground">이름 (Display Name)</label>
            <Input
              id="displayName"
              placeholder="예: 홍길동"
              {...register("displayName")}
              disabled={isLoading}
              className={errors.displayName || displayNameError ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.displayName && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.displayName.message}
              </p>
            )}
            {displayNameError && !errors.displayName && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {displayNameError}
              </p>
            )}
             {!displayNameError && !errors.displayName && displayNameWatch && displayNameWatch !== currentProfile?.displayName && !isCheckingDisplayName && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-green-600 mt-1">
                 사용 가능한 이름입니다.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-semibold text-foreground">소개글</label>
            <Input
              id="bio"
              placeholder="자신을 소개해주세요"
              {...register("bio")}
              disabled={isLoading}
              className={errors.bio ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.bio && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.bio.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isLoading} className="font-medium">
              취소
            </Button>
            <Button type="submit" className="font-bold shadow-md min-w-[80px]" disabled={isLoading || isCheckingAny || !!usernameError || !!displayNameError}>
              {isLoading || isCheckingAny ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
