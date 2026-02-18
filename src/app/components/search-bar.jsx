import { Plus } from "lucide-react"
import Form from "next/form"

export function SearchBar({
    searchValue,
    setSearchValue,
    handleSearchSubmit,
    setFormState
}) {
    return (
        <div className="flex relative w-full justify-center gap-2 z-999">
            <Form onChange={handleSearchSubmit} className="flex border border-[#333333] bg-[#1f1f1f] justify-between p-2 w-full max-w-sm md:max-w-md lg:max-w-lg rounded-full">
                <input
                    type="text"
                    placeholder="Search book title..."
                    className="w-full outline-none bg-transparent ml-5"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                ></input>
            </Form >
            <div className="flex gap-2">
                <button
                    onClick={() => setFormState(true)}
                    className="flex gap-2 border border-[#424242] bg-[#1f1f1f] max-w-sm p-2 rounded-full items-center"
                >
                    <Plus />
                    <p>Add book</p>
                </button>
            </div>
        </div >
    )
}