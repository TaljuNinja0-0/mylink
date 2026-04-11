import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";

export default function LinkList() {
  return (
    <div className="flex flex-col items-center w-full max-w-md gap-4 mx-auto">
      {dummyLinks.map((link) => (
        <a 
          key={link.id} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] block group"
        >
          <Card className="cursor-pointer overflow-hidden border-none bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-md group-hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)] transition-all duration-300">
            <CardContent className="p-5 flex items-center justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-lg shrink-0 border border-white/20 transition-transform group-hover:scale-110">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`} 
                  alt="" 
                  className="w-7 h-7 object-contain brightness-110 contrast-110"
                />
              </div>
              <span className="font-bold text-lg tracking-tight truncate drop-shadow-sm">{link.title}</span>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
