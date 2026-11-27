export default function Search({ keyword, setKeyword }) {
    const safeValue = keyword !== undefined && keyword !== null ? keyword : ''

    const handleChange = (e) => {
        if (typeof setKeyword === 'function') {
            setKeyword(e?.target ? e.target.value : '')
        }
    }

    return (
        <input
            type="text"
            placeholder="Search products..."
            value={safeValue} // This keeps the letter in the box
            onChange={handleChange}
        />
    )
}