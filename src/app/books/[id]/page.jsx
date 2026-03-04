"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { formatDate } from "@/utils/date-format"
import { BookChapter } from "@/app/components/book-chapter"
import { User, MoveLeft, Trash, Pencil } from "lucide-react"
import Link from "next/link"
import { FormAdd } from "@/app/components/form"
import { deleteBook } from "@/app/lib/actions"

export default function BooksDetail() {
    const { id: paramsId } = useParams()
    const router = useRouter()

    const [bookData, setBookData] = useState([])
    const [editBook, setEditBook] = useState(false)
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

    async function handleBookDelete(bookId) {
        try {
            const result = await deleteBook(bookId)
            console.log(bookId)
            if (result.success) {
                alert(result.message)
            }
            router.push('/books')
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="z-3 max-w-full w-full justify-center">
                <div className="flex justify-between">
                    <Link href={`/books`} className="flex gap-2"><MoveLeft /> Back</Link>
                    <div className="flex gap-2">
                        <Trash onClick={() => bookData && handleBookDelete(id)}></Trash>
                        <Pencil onClick={() => setEditBook(true)}></Pencil>
                    </div>
                    {(editBook && bookData) &&
                        <FormAdd
                            editBook={editBook}
                            bookData={bookData}
                            onClose={() => setEditBook(false)}
                        />
                    }
                </div>
                <div className="flex gap-5">
                    <div className="flex-none">
                        <img src="/images/220356.jpg" width={240} className="rounded-2xl"></img>
                    </div>
                    <div className="flex flex-col gap-5">
                        <h1 className="text-6xl">{title}</h1>
                        <div className="flex border w-fit p-2 gap-2 border-[#2c2c2c] rounded-full">
                            <p><span className="text-[#fdc200]">●</span></p>
                            <User />
                            <p>{author}</p>
                        </div>
                        <div className="flex gap-5">
                            <div>
                                <p className="tracking-widest text-sm text-[#474747]">ADDED AT</p>
                                <p className="text-xl">{formatDate(created_at)}</p>
                            </div>
                            <div>
                                <p className="tracking-widest text-sm text-[#474747]">UPDATED AT</p>
                                <p className="text-xl">{formatDate(updated_at)}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="tracking-widest text-sm text-[#474747]">SUMMARY</h2>
                            <div className="w-[-400] h-[120px] overflow-y-auto">
                                <p>{summary}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="border p-2 rounded  bg-[#1f1f1f] flex-3">
                {!loading && book_id && <BookChapter bookId={book_id} />}

            </div>
        </div>

    )
}