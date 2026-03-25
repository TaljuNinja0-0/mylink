import Image from "next/image";

export default function Home() {
  const links = [
    {
      title: "GitHub 저장소",
      url: "https://github.com",
      bgClass: "bg-zinc-800 hover:bg-zinc-700",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Tistory 기술 블로그",
      url: "https://tistory.com",
      bgClass: "bg-amber-900 hover:bg-amber-950",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 20 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: "포트폴리오 이력서",
      url: "#",
      bgClass: "bg-[#bef264] hover:bg-[#a3e635]",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "이메일 연락하기",
      url: "mailto:contact@example.com",
      bgClass: "bg-[#d4d4d8] hover:bg-[#a1a1aa]",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen py-16 px-6 bg-[#fde047] font-sans text-black selection:bg-black selection:text-[#fde047] w-full flex flex-col items-center">
      
      <main className="w-full max-w-[460px] flex flex-col items-center mx-auto space-y-12">
        
        {/* Profile Image & Bio */}
        <div className="flex flex-col items-center text-center w-full bg-white border-4 border-black p-8 shadow-[12px_12px_0px_#000] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[16px_16px_0px_#000]">
          
          <div className="relative w-[120px] h-[120px] overflow-hidden rounded-full border-4 border-black shadow-[6px_6px_0px_#000] mb-8 bg-[#fef08a] shrink-0">
            <Image 
              src="/lemongrab.png" 
              alt="프로필 아바타" 
              fill
              priority
              className="object-cover object-top"
              sizes="120px"
            />
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter text-black mb-3 uppercase">
            박수빈
          </h1>
          <p className="text-xl font-black bg-black text-[#fde047] px-4 py-1.5 mb-6 border-2 border-black inline-block transform -skew-x-6">
            AI Data Science / DL
          </p>
          <p className="text-base text-black font-bold border-t-4 border-black pt-6 leading-relaxed">
            데이터 사이언스 연구실에서 학부연구생으로 활동 중입니다. 주력 언어는 Python이며, 특히 딥러닝(NLP, LLM 활용) 분야에 깊은 관심을 가지고 학습하고 있습니다.
          </p>
        </div>

        {/* Links List (Colorful Neobrutalism) */}
        <div className="w-full flex flex-col gap-6 pb-12">
          {links.map((link, idx) => (
            <a 
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center p-4 w-full min-h-[88px] border-4 border-black shadow-[8px_8px_0px_#000] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-[4px_4px_0px_#000] ${link.bgClass}`}
            >
              <div className="flex items-center justify-center p-3 border-4 border-black mr-6 text-black group-hover:scale-110 transition-transform duration-200 bg-white shadow-[4px_4px_0px_#000]">
                {link.icon}
              </div>
              
              <div className="flex-1 flex justify-start text-left">
                <span className="font-black text-xl text-black uppercase tracking-tight bg-white px-3 py-1 border-4 border-black shadow-[4px_4px_0px_#000]">
                  {link.title}
                </span>
              </div>
              
              <div className="text-white font-black text-4xl group-hover:translate-x-2 transition-transform duration-200 drop-shadow-[2px_2px_0px_#000] drop-shadow-black" style={{ filter: 'drop-shadow(2px 2px 0px #000)' }}>
                →
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
