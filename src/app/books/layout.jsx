import { metadata as mainMetadata } from "../layout"


export const metadata = {
    title: `Books | ${mainMetadata.title}`,
}

export default function Layout({ children }) {
    return (
        <div className="max-w-7xl mx-auto mt-5 mb-5 min-h-screen flex flex-col flex-1">
            {children}
        </div>
    )

}