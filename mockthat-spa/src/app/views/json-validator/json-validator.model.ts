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
    show: boolean;

    constructor(
        public id: string,
        public key: string | number | null,
        public type: Types,
        public value: JsonType[] | string,
        show: boolean = true,
        public remove: boolean = false
    ) {
        this.setShowState(show);
    }

    setShowState(show: boolean): void {
        this.show = (this.type === Types.OBJECT || this.type === Types.ARRAY) ? show : true;
    }
}

export class JsonVersionHistory {
    constructor(
        public timestamp: string,
        public json: string
    ) { }
}
