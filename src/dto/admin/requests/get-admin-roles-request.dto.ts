export class GetAdminRolesRequest {
    constructor(
        public readonly page: string,
        public readonly limit: string
    ) { }

    toString() {
        return JSON.stringify({
            page: this.page,
            limit: this.limit
        });
    }
}
