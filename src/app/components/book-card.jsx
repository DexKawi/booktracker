export function BookCard({ title, author, summary, cover_url }) {
    return (
        <div>
            <div className="flex border p-2 rounded-md max-w-sm">
                <div>
                    <h1>{title}</h1>
                    <h2>{author}</h2>
                    <p>{summary}</p>
                </div>
            </div>

        </div>
    )
}