import { metadata as mainMetadata } from "../layout"


export const metadata = {
    title: `Books | ${mainMetadata.title}`,
}

export default function Layout({ children }) {
    return (
        <section>
            {children}
        </section>
    )

}