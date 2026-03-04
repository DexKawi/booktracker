export function Input({ label, id, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="block">
                {label}
            </label>
            <input
                id={id}
                name={id}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
                {...props}
            />
        </div>
    )
}