export class AuthPayload {
    constructor(
        public readonly sub: string,
    ) { }

    toString() {
        return JSON.stringify({
            sub: this.sub,
        });
    }
}
