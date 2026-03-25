import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 font-sans dark:bg-zinc-950 selection:bg-indigo-500/30">
      {/* Background Subtle Gradients */}
      <div className="absolute top-10 -left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 dark:opacity-20" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 dark:opacity-20" />
      <div className="absolute -bottom-10 left-32 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 dark:opacity-20" />

      <main className="relative z-10 w-full max-w-5xl p-6 sm:p-12">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 rounded-[2.5rem] bg-white/70 p-8 sm:p-14 backdrop-blur-2xl shadow-2xl ring-1 ring-zinc-900/5 dark:bg-zinc-900/70 dark:ring-white/10 transition-all duration-500 hover:shadow-indigo-500/10">
          
          {/* Profile Image Container */}
          <div className="group relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-lg transition duration-500 group-hover:opacity-100 group-hover:duration-200"></div>
            <div className="relative h-56 w-56 sm:h-64 sm:w-64 overflow-hidden rounded-full ring-4 ring-white dark:ring-zinc-800 shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              <Image 
                src="/lemongrab.png" 
                alt="박수빈 프로필 사진" 
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 640px) 14rem, 16rem"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2 transition-transform duration-300 hover:scale-[1.02]">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                단순한 코딩을 넘어 가치를 만드는
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                박수빈
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Software Engineering Student
              </h2>
            </div>
            
            <p className="max-w-xl text-lg sm:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
              세련된 UI와 직관적인 UX를 설계하는 데 높은 관심을 가지고 있습니다.
              새로운 기술을 끊임없이 탐구하며, 사용자에게 최고의 경험을 제공하기 위해 고민합니다.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-8 py-3.5 font-semibold text-white bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.4)] hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-zinc-50 dark:hover:ring-offset-zinc-950">
                <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"></span>
                <span className="relative flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  이력서 보기
                </span>
              </button>
              
              <button className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-200 bg-white/50 backdrop-blur-md px-8 py-3.5 font-bold text-zinc-800 transition-all duration-300 hover:bg-zinc-50 hover:scale-105 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                연락하기
              </button>

              <a href="#" className="p-3.5 rounded-full border-2 border-zinc-200 bg-white/50 backdrop-blur-md text-zinc-600 transition-all duration-300 hover:bg-zinc-50 hover:text-indigo-600 hover:scale-110 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-indigo-400" aria-label="GitHub">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
