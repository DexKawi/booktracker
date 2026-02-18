import Link from "next/link"

export function BookCard({ id, title, author }) {
    return (
        <div className="flex relative border border-[#333333] bg-[#1f1f1f] justify-between overflow-hidden p-2 h-32 rounded-sm">
            <Link href={`/books/${id}`}>
                <div className="z-4">
                    <h1 className="font-bold text-lg">{title}</h1>
                    <p className="text-xs text-[#a5a5a5]">{author}</p>
                </div>
                <div className="absolute right-0 -bottom-30">
                    <img
                        src={`/images/220356.jpg`}
                        width={120}
                        alt={`${title} cover`}
                        className="rounded-sm rotate-350"></img>
                </div>
            </Link>
        </div>
    )
}