export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex flex-col items-center justify-center text-center p-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-12 shadow-xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg"></div>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              박수빈
            </h1>
            <p className="text-lg font-medium tracking-tight text-zinc-500 dark:text-zinc-400">
              안녕하세요! 소프트웨어 전공 대학생입니다.
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            <button className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all">
              이력서 보기
            </button>
            <button className="rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 transition-all">
              연락하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
