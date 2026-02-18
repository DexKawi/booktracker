"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { formatDate } from "@/utils/date-format"
import { BookChapter } from "@/app/components/book-chapter"

export default function BooksDetail() {
    const { id: paramsId } = useParams()

    const [bookData, setBookData] = useState([])
    const [loading, setLoading] = useState(true)

    const {
        id,
        book_id,
        title,
        author,
        summary,
        cover_url,
        created_at,
        updated_at
    } = bookData

    useEffect(() => {
        async function fetchFromDatabase() {
            try {
                setLoading(true)
                const response = await fetch("/api/get-books-data")
                if (!response.ok) {
                    throw new Error("Failed to retrieve data from database!")
                }

                const result = await response.json()
                const data = result.find((res) => res.id === Number(paramsId))
                setBookData(data)

            } catch (error) {
                return error.message
            } finally {
                setLoading(false)
            }
        }
        fetchFromDatabase()
    }, [paramsId])

    return (
        <div className="flex flex-col gap-2">
            <div className="z-3 max-w-7xl w-full justify-center">
                <div className="flex gap-2 justify-between">
                    <img src="/images/220356.jpg" width={120}></img>
                    <div className="flex-2 p-5">
                        <h1 className="text-6xl">{title}</h1>
                        <p>{author}</p>
                        <div>
                            <p>Added at: {formatDate(created_at)}</p>
                            <p>Updated at: {formatDate(updated_at)}</p>
                        </div>
                    </div>
                    <div className="flex-3 lg:border-l pl-5">
                        <p>Summary</p>
                        <p>{summary}</p>
                    </div>

                </div>
            </div>
            <div className="border p-2 rounded bg-[#747474] flex-3">
                {!loading && book_id && <BookChapter bookId={book_id} />}

            </div>
        </div>

    )
}