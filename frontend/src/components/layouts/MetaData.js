import { Helmet } from "react-helmet-async"

export default function MetaData({ title }) {
    const resolvedTitle = title !== undefined && title !== null ? String(title) : ""

    return (
        <Helmet>
            <title>{`${resolvedTitle}`}</title>
        </Helmet>
    )
}