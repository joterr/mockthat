import { LocalStorageService } from 'ngx-webstorage';

export class MockLocalStorageService extends LocalStorageService {

    constructor() { super(null); }

    store(raw: string, value: any): void { }
    retrieve(raw: string): void { return null; }
    clear(raw?: string): void { }
    isStorageAvailable(): boolean { return false; }
}
