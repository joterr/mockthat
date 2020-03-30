export enum Types {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    ARRAY = 'ARRAY',
    OBJECT = 'OBJECT'
}

export class JsonType {
    constructor(
        public key: string | number | null,
        public type: Types,
        public value: JsonType[] | string,
        public show: boolean = true
    ) { }
}
