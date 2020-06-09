export enum Types {
    NULL = 'null',
    STRING = 'string',
    DATA_BASE64 = 'data_base64',
    URL = 'url',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    ARRAY = 'array',
    OBJECT = 'object'
}

export class JsonType {
    constructor(
        public id: string,
        public key: string | number | null,
        public type: Types,
        public value: JsonType[] | string,
        public show: boolean = true,
        public remove: boolean = false
    ) { }
}

export class JsonVersionHistory {
    constructor(
        public timestamp: string,
        public json: string
    ) { }
}
