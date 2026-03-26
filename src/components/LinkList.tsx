import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LinkList() {
  return (
    <div className="flex flex-col items-center w-full max-w-md gap-4 mx-auto">
      {dummyLinks.map((link) => (
        <a 
          key={link.id} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full transition-transform hover:scale-105 active:scale-95 block"
        >
          <Card className="hover:bg-accent hover:text-accent-foreground cursor-pointer overflow-hidden border border-muted bg-card shadow-sm transition-all">
            <CardContent className="p-5 flex items-center justify-center text-center">
              <span className="font-medium text-lg tracking-tight">{link.title}</span>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
