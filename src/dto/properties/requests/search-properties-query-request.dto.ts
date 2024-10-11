export class SearchPropertiesQueryRequest {
    constructor(
        public readonly query: string,
        public readonly bedroom: string,
        public readonly washroom: string,
        public readonly purpose: string,
        public readonly status: string,
        public readonly completionStatus: string,
        public readonly propertyType: string,
        public readonly minPrice: string,
        public readonly maxPrice: string,
        public readonly from: string,
        public readonly size: string,
    ) { }

    toString() {
        return JSON.stringify({
            query: this.query,
            bedroom: this.bedroom,
            washroom: this.washroom,
            purpose: this.purpose,
            status: this.status,
            completionStatus: this.completionStatus,
            propertyType: this.propertyType,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            from: this.from,
            size: this.size
        });
    }
}
