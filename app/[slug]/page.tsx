import LinkList from "@/components/LinkList";

interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  
  return (
    <main className="flex min-h-screen flex-col items-center py-20 px-4 bg-background">
      <div className="mb-10 text-center w-full max-w-md">
        <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 border-2 border-border flex items-center justify-center text-muted-foreground">
          {resolvedParams.slug.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">@{resolvedParams.slug}</h1>
        <p className="text-muted-foreground mt-2">Welcome to my links page!</p>
      </div>
      
      <LinkList />
    </main>
  );
}
