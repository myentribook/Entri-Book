class APIFeature {

    constructor(query, queryStr) {

        this.query = query

        this.queryStr = queryStr

    }

    search(fields = ['name']) {
        const keyword = this.queryStr.keyword ? {
            $or: fields.map(field => ({
                [field]: {
                    $regex: this.queryStr.keyword,
                    $options: 'i'
                }
            }))
        } : {};

        // Combine current query conditions with the new search condition
        this.query = this.query.find(keyword);

        return this;
    }
    
    category() {

        const queryStrCopy = { ...this.queryStr }

        // removing fields from query 

        const removeFields = ['keyword', 'limit', 'page']

        removeFields.forEach(fields => delete queryStrCopy[fields])

        this.query.find(queryStrCopy)

        return this

    }


}

module.exports = APIFeature