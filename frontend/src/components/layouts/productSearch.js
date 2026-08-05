export default function Search({ keyword, setKeyword }) {
    return (
        <input 
            type="text" 
            placeholder="Search products..." 
            value={keyword} // This keeps the letter in the box
            onChange={(e) => setKeyword(e.target.value)} 
        />
    )
}