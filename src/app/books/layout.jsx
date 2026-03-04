import { metadata as mainMetadata } from "../layout"
import { Header } from "../components/header"



export const metadata = {
    title: `Books | ${mainMetadata.title}`,
}

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <div className="max-w-full mt-15 mb-5 min-h-screen flex flex-col flex-1">
                {children}
            </div>
        </>
    )

}