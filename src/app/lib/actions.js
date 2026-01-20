"use server"

import connection from "./db"
import { revalidatePath } from "next/cache"

export async function addBook(data) {
    try {
        const [lastId] = await connection.query("SELECT id FROM book ORDER BY id DESC LIMIT 1")
        const [lastbookId] = await connection.query("SELECT book_id FROM book ORDER BY book_id DESC LIMIT 1")

        let newBookId
        let id = lastId.length > 0 ? lastId[0].id + 1 : null

        if (lastbookId.length > 0) {
            const lastId = lastbookId[0].book_id
            const numPart = parseInt(lastId.replace('book_', ''))
            newBookId = `book_${String(numPart + 1).padStart(3, '0')}`
        }

        await connection.query(
            `INSERT INTO book (id, book_id, title, author, summary, cover_url, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                newBookId,
                data.title,
                data.author,
                data.summary,
                data.cover_url,
                new Date().toISOString().slice(0, 19).replace('T', ' '),
                new Date().toISOString().slice(0, 19).replace('T', ' ')

            ]
        )

        revalidatePath("/books")

        return { success: true, bookId: newBookId }
    } catch (error) {
        console.error('Error adding book:', error)
        return { success: false, error: error.message }
    }

}