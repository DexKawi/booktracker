import Link from "next/link";

export default function Home() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <h1 className="text-2xl">Track every<span className="font-(family-name:--font-fuzzy-sans) p-1">books</span>you read.</h1>
        <Link href={`/books`}><span>Go to my books →</span></Link>
      </main>
    </div>
  );
}
