"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, LayoutDashboard, Globe, Copy, ExternalLink, ChevronDown } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { toast } from "sonner"

export function Navbar() {
  const { user, login, logout, loading } = useAuth()
  const pathname = usePathname()
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    if (user) {
      const fetchUsername = async () => {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUsername(docSnap.data().username || "")
        }
      }
      fetchUsername()
    }
  }, [user])

  // 메인 페이지(/)이면서 로그인이 안 된 상태일 때는 헤더의 로그인 버튼을 숨김
  const showLoginButton = pathname !== "/" || user

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${username}`
    navigator.clipboard.writeText(url)
    toast.success("내 페이지 링크가 복사되었습니다!", {
      description: url,
    })
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:inline-block">
            MyLink
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex font-medium text-gray-600 hover:text-primary">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  대시보드
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <button className="flex items-center gap-2 rounded-full border-2 border-primary/20 p-0.5 pr-2 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <div className="h-7 w-7 overflow-hidden rounded-full shadow-sm">
                      <img 
                        src={user.photoURL || "https://github.com/shadcn.png"} 
                        alt="Profile" 
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>
                } />
                <DropdownMenuContent className="w-56">
                  <div className="flex flex-col space-y-1 p-3 pb-2">
                    <p className="text-sm font-bold leading-none text-gray-900">
                      {user.displayName || username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    내 페이지
                  </div>
                  <DropdownMenuItem onClick={() => window.open(`/${username}`, "_blank")}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    내 페이지 미리보기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    내 페이지 링크 복사
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="text-destructive hover:bg-destructive/5 focus:bg-destructive/5"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : showLoginButton ? (
            <Button 
              size="sm" 
              onClick={login}
              className="font-bold shadow-md shadow-primary/10 transition-all hover:scale-105 active:scale-95"
            >
              Google로 시작하기
            </Button>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
