import { useState, useEffect, Suspense } from "react"
import { ChevronRight, ChevronLeft, Plus, Trash, Pencil } from "lucide-react"
import { ChapterForm } from "./chapter-form"
import { deleteChapter } from "../lib/actions"

export function BookChapter({ bookId }) {
    const [summaryData, setSummaryData] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [formStatus, setFormStatus] = useState(false)
    const [editingChapter, setEditingChapter] = useState(null)

    useEffect(() => {
        async function fetchSummary() {
            try {
                setLoading(true)
                const response = await fetch(`/api/get-user-summary`)
                if (!response.ok) {
                    throw new Error("Failed to retrieve data from database!")
                }

                const result = await response.json()
                setSummaryData(result)
            } catch (error) {
                return error.message
            } finally {
                setLoading(false)
            }
        }
        fetchSummary()
    }, [bookId])

    const filtered = summaryData.filter((res) => {
        const bookNumber = parseInt(bookId.replace('book_', ''))
        return Number(res.book_id) === bookNumber
    })

    const sortedChapters = [...filtered].sort((a, b) => a.chapter_num - b.chapter_num)
    const currentChapter = sortedChapters[currentIndex]

    function goToNext() {
        if (currentIndex < sortedChapters.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    function goToPrev() {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    function DataLoadWait() {
        return <div>Loading...</div>
    }

    async function handleChapterDelete(chapterNum) {
        const result = await deleteChapter(chapterNum)
        if (result.success) {
            setSummaryData(summaryData.filter((data) => data.id !== chapterNum))
            if (currentIndex >= sortedChapters.length - 1) {
                setCurrentIndex(Math.max(0, currentIndex - 1))
            }
            alert(result.message)
        } else {
            alert(result.error)
        }

    }

    return (
        <div>
            {loading ? <DataLoadWait /> :
                <div>
                    <Suspense fallback={<DataLoadWait />}>
                        <div className="flex justify-between">
                            <Plus onClick={() => setFormStatus(true)} />
                            <div className="flex gap-2">
                                <Trash onClick={() =>
                                    currentChapter && handleChapterDelete(currentChapter.id)}
                                    className={!currentChapter ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                />
                                <Pencil onClick={() =>
                                    currentChapter && setEditingChapter(currentChapter)}
                                    className={!currentChapter ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                />
                            </div>
                        </div>
                        {(formStatus || editingChapter) && (
                            <ChapterForm
                                bookId={bookId}
                                editData={editingChapter}
                                onClose={() => { setFormStatus(false); setEditingChapter(null); }}
                            />
                        )}
                        {currentChapter ? (
                            <div>
                                <div>
                                    <div className="flex justify-between">
                                        <div className="flex">
                                            <ChevronLeft
                                                onClick={goToPrev}
                                                className={currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                            />
                                            <p>Chapter {currentChapter.chapter_num}</p>
                                            <ChevronRight
                                                onClick={goToNext}
                                                className={currentIndex === sortedChapters.length - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                            />
                                        </div>
                                    </div>
                                    <p>{currentChapter.chapter_summary}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No chapters found</p>
                        )}
                    </Suspense>
                </div>
            }
        </div>

    )
}