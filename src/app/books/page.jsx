"use client"

import { useState, useEffect } from "react"
import { Form } from "../components/form";
import { BookCard } from "../components/book-card";

export default function Books() {
    const [bookData, setBookData] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/get-books-data");

                if (!response.ok) {
                    throw new Error("Failed to fetch data from database!")
                }
                const result = await response.json()
                setBookData(result)

            }
            catch (error) {
                setError(error.message)
            }
        }
        fetchData()
    }, [])

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                {error}
            </div>
        )
    }

    return (
        <div>
            <p>Hi.</p>
            <div className="grid grid-cols-4 grid-rows-4 gap-3">
                {bookData.map((data, index) => {
                    return (
                        <div key={index}>
                            <BookCard
                                title={data.title}
                                author={data.author}
                                summary={data.summary}
                                cover_url={data.cover_url}
                            />
                            {console.log(data)}
                        </div>
                    )
                })}
            </div>

        </div>
    )

}