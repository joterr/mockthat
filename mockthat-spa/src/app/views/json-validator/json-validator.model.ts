export enum Types {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    ARRAY = 'array',
    OBJECT = 'object'
}

export class JsonType {
    constructor(
        public key: string | number | null,
        public type: Types,
        public value: JsonType[] | string,
        public show: boolean = true
    ) { }
}
