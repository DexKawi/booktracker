import Form from "next/form"
import { useRef } from "react"
import { Input } from "./input"
import { addBook, updateBook } from "../lib/actions"
import { useRouter } from 'next/navigation'
import { Button } from "./button"
import { X } from "lucide-react"

export function FormAdd({ editBook, bookData, onClose }) {
    const formRef = useRef(null)
    const router = useRouter()

    async function handleSubmit(formData) {
        if (editBook) {
            const result = await updateBook({
                id: bookData.id,
                title: formData.get("title"),
                author: formData.get("author"),
                summary: formData.get("summary"),
                cover_url: formData.get("cover_url")
            })
            if (result.success) {
                alert(result.message)
                formRef.current?.reset()
                router.refresh()
            } else {
                alert(`Error: ${result.error}`)
            }
        }
        else {
            const result = await addBook({
                title: formData.get("title"),
                author: formData.get("author"),
                summary: formData.get("summary"),
                cover_url: formData.get("cover_url")
            })

            if (result.success) {
                alert(`Book: ${result.title}, successfully added!`)
                formRef.current?.reset()
                router.refresh()
            } else {
                alert(`Error: ${result.error}`)
            }
        }
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="border border-[#313131] bg-[#1d1d1d] w-fit p-2 rounded-sm">
                <div className="flex justify-between">
                    <h3 className="font-semibold mb-2 flex-1">{editBook ? "Edit Book" : "Add Books"}</h3>
                    <X onClick={onClose} />
                </div>
                <Form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
                    <Input label="Book Title" id="title" name="title" type="text" placeholder="e.g. The Great Gatsby" defaultValue={bookData?.title} />
                    <Input label="Author" id="author" name="author" type="text" placeholder="e.g. F.Scott Fitzgerald" defaultValue={bookData?.author} />
                    <Input label="Summary" id="summary" name="summary" type="text" placeholder="e.g. I've read chapter..." defaultValue={bookData?.summary} />
                    <Input label="Cover" id="cover_url" name="cover_url" type="url" placeholder="e.g. Image URL" defaultValue={bookData?.cover_url} />
                    <Button><button type="submit">{editBook ? "Update Book" : "Add Book"}</button></Button>
                </Form>
            </div>
        </div>
    )
}