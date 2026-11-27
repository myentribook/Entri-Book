class APIFeature {
    constructor(query, queryStr = {}) {
        this.query = query;
        this.queryStr = queryStr && typeof queryStr === 'object' ? queryStr : {};
    }

    search(fields = ['name']) {
        const rawKeyword = this.queryStr.keyword;
        const hasKeyword = typeof rawKeyword === 'string' && rawKeyword.trim().length > 0;
        const validFields = Array.isArray(fields) ? fields.filter(Boolean) : [];

        let keyword = {};

        if (hasKeyword && validFields.length > 0) {
            const escapedKeyword = rawKeyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            keyword = {
                $or: validFields.map(field => ({
                    [field]: {
                        $regex: escapedKeyword,
                        $options: 'i'
                    }
                }))
            };
        }

        // Combine current query conditions with the new search condition
        this.query = this.query.find(keyword);

        return this;
    }

    category() {
        const queryStrCopy = { ...this.queryStr };

        // removing fields from query
        const removeFields = ['keyword', 'limit', 'page'];

        removeFields.forEach(field => {
            delete queryStrCopy[field];
        });

        // Prevent prototype pollution keys from entering filter queries
        delete queryStrCopy.__proto__;
        delete queryStrCopy.constructor;
        delete queryStrCopy.prototype;

        this.query = this.query.find(queryStrCopy);

        return this;
    }
}

module.exports = APIFeature;