"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { formatDate } from "@/utils/date-format"

export default function BooksDetail() {
    const { id } = useParams()

    const [bookData, setBookData] = useState([])

    const {
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
                const response = await fetch("/api/get-books-data")
                if (!response.ok) {
                    throw new Error("Failed to retrieve data from database!")
                }

                const result = await response.json()
                const data = result.find((res) => res.id)
                setBookData(data)

            } catch (error) {
                return error.message
            }
        }
        fetchFromDatabase()
    }, [id])

    return (
        <div>
            <div className="z-3 max-w-7xl mx-auto w-full justify-center m-5">
                <div className="flex gap-2">
                    <img src="/images/220356.jpg" width={120}></img>
                    <h1 className="text-6xl">{title}</h1>
                </div>
                <div>
                    <p>{formatDate(created_at)}</p>
                    <p>{formatDate(updated_at)}</p>
                    {/*TODO: Display other data from the destructured objects, and implement UI style*/}
                </div>
                <p>{summary}</p>
            </div>
        </div>

    )
}