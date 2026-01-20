"use client"

import { useState, useEffect } from "react"
import { BookCard } from "../components/book-card"
import { SearchBar } from "../components/search-bar"
import { useDebounce } from "../hooks/custom-hooks/debounce"

export default function Books() {
    const [bookData, setBookData] = useState([])
    const [error, setError] = useState(null)
    const [searchValue, setSearchValue] = useState("")
    const [filteredValue, setFilteredValue] = useState([])
    const [formState, setFormState] = useState(false)
    const debouncedSearch = useDebounce(searchValue)

    let dataToDisplay

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

    useEffect(() => {
        if (bookData && debouncedSearch) {
            const filteredBook = bookData.filter((book) => book.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
            setFilteredValue(filteredBook)
        } else {
            setFilteredValue([])
        }
    }, [bookData, debouncedSearch])

    function handleSearchSubmit(e) {
        e.preventDefault()
        console.log(`You're searching for ${debouncedSearch}`)
    }


    if (searchValue) {
        dataToDisplay = filteredValue
    } else {
        dataToDisplay = bookData
    }


    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                {error}
            </div>
        )
    }

    return (
        <div>
            <div className="flex fixed z-3 max-w-7xl mx-auto w-full justify-center bottom-0 inset-x-0 m-5">
                <SearchBar
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    handleSearchSubmit={handleSearchSubmit}
                    formState={formState}
                    setFormState={setFormState}
                />
            </div>

            {dataToDisplay.length === 0 && debouncedSearch ? (
                <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
                    Book not found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dataToDisplay.map((data, index) => {
                        return (
                            <div key={index}>
                                <BookCard {...data}
                                />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )

}