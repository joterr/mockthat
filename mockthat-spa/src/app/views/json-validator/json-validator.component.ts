import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    OnDestroy,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject
} from '@angular/core';
import { JsonType, Types, JsonVersionHistory } from './json-validator.model';
import { Subscription, fromEvent } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import * as urlRegex from 'url-regex';
import { v4 as uuidv4 } from 'uuid';
import { orderBy } from 'natural-orderby';
import { WINDOW } from 'src/app/core/services/window-ref.service';


@Component({
    selector: 'app-json-validator',
    templateUrl: './json-validator.component.html',
    styleUrls: [ './json-validator.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonValidatorComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('rawJson') rawJson: ElementRef;
    @ViewChild('shadowedTextarea') shadowedTextarea: ElementRef;

    isValid: boolean;
    hasResult: boolean;

    showTypes: boolean;
    allCollapsed: boolean;
    isEditorSpaceOpen: boolean;

    structuredJson: JsonType[] = [];
    checkedJson = '';
    versionHistory: JsonVersionHistory[] = [];

    versionSelection: string[] = [];
    editorNumerationCount = 0;
    isJsonParsing = true;

    readonly TYPES = Types;

    private subCollector: Subscription[] = [];
    private debounceBeautifyRaw: any; // NodeJS.Timeout
    private debounceVersionHistory: any; // NodeJS.Timeout

    private readonly jsonHistoryKey: string = 'json_validation_history';
    private readonly TAB_SIZE: number = 4;
    private readonly versionHistoryDebounceVal = 5000;
    // tslint:disable-next-line:max-line-length
    private readonly base64RegEx: RegExp = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

    constructor(
        private localStorage: LocalStorageService,
        private cd: ChangeDetectorRef,
        @Inject(WINDOW) private window: Window
    ) { }

    ngOnInit() {
        this.window.setTimeout(() => {
            this.rawJson.nativeElement.focus();
            this.dehydrate();
        });
    }

    ngAfterViewInit() {
        this.subCollector.push(
            fromEvent(this.rawJson.nativeElement, 'input').subscribe(() => this.rawJsonChanged()),
            fromEvent(this.rawJson.nativeElement, 'keydown').subscribe((key: KeyboardEvent) => this.handleKeyPress(key)),
        );
    }

    ngOnDestroy() {
        this.subCollector.forEach((s: Subscription) => s.unsubscribe());
    }

    changeIsEditorSpaceOpen(openOnly: boolean, event?: MouseEvent): void {
        this.isEditorSpaceOpen = openOnly ? true : !this.isEditorSpaceOpen;

        if (event) {
            event.stopPropagation();
        }
    }

    copyBeautified(): void {
        this.doCopy(JSON.stringify(this.checkedJson, null, '\t'));
    }

    copyStringified(): void {
        this.doCopy(JSON.stringify(this.checkedJson));
    }

    copyValue(value: string): void {
        this.doCopy(value);
    }

    toggleTypes(): void {
        this.showTypes = !this.showTypes;
    }

    toggleFoldState(): void {
        this.allCollapsed = !this.allCollapsed;

        this.recursiveManipulateViewState(this.structuredJson, !this.allCollapsed);
        this.structuredJson[ 0 ].setShowState(true);
    }

    selectedVersion(index: number): void {
        this.isJsonParsing = true;
        clearTimeout(this.debounceBeautifyRaw);
        clearTimeout(this.debounceVersionHistory);
        this.checkedJson = this.versionHistory[ index ].json;
        this.publishJson(this.checkedJson);

        console.log(`Selected New Version from ${this.versionHistory[ index ].timestamp}`);
    }

    deleteVersionHistory(): void {
        clearTimeout(this.debounceBeautifyRaw);
        clearTimeout(this.debounceVersionHistory);
        this.localStorage.clear(this.jsonHistoryKey);
        this.versionHistory = this.versionSelection = [];
        this.clearEditor();
    }

    sortNode(id: string, ascending = true): void {
        this.isJsonParsing = true;
        this.cd.markForCheck();

        setTimeout(() => {
            const part: JsonType = this.findJsonPartById(this.structuredJson, id);

            if (part.type === Types.OBJECT) {
                part.value = orderBy(
                    part.value as JsonType[],
                    [ v => v.key ],
                    [ ascending ? 'asc' : 'desc' ]
                );
            }

            this.publishJson(
                JSON.stringify(
                    this.buildJson(this.structuredJson, true)
                )
            );
        });
    }

    removeNode(id: string): void {
        this.isJsonParsing = true;
        this.cd.markForCheck();

        setTimeout(() => {
            const part: JsonType = this.findJsonPartById(this.structuredJson, id);
            part.remove = true;

            const stringifiedJson: string = JSON.stringify(this.buildJson(this.structuredJson, true));
            this.publishJson(stringifiedJson);
        });
    }

    clearEditor(): void {
        this.rawJson.nativeElement.value = '';
        this.hasResult = this.isValid = false;
        this.structuredJson = [];
    }

    private calcEditorNumerationCount(json: string): void {
        this.editorNumerationCount = (JSON.stringify(json, null, '\t').match(/\n/g) || []).length + 1;
    }

    private recursiveManipulateViewState(json: JsonType[], show: boolean): void {
        json.forEach((j: JsonType) => {
            j.setShowState(show);

            if (j.value instanceof Object && j.value[ 0 ] instanceof JsonType) {
                this.recursiveManipulateViewState(j.value as JsonType[], show);
            }
        });
    }

    private findJsonPartById(jsonTypes: JsonType[], id: string): JsonType {
        const node: JsonType = jsonTypes.find((j: JsonType) => j.id === id);

        if (node) {
            return node;
        }

        for (const j of jsonTypes.filter((json: JsonType) => json.type === Types.ARRAY || json.type === Types.OBJECT)) {
            const propNode: JsonType = this.findJsonPartById(j.value as JsonType[], id);
            if (propNode) {
                return propNode;
            }
        }
    }

    private handleKeyPress(event: KeyboardEvent) {
        if (event.keyCode === 9 || event.which === 9) {
            event.preventDefault();
            document.execCommand('insertText', false, ' '.repeat(this.TAB_SIZE));
        }
    }

    private rawJsonChanged(): void {
        this.isJsonParsing = true;
        const text: string = this.rawJson.nativeElement.value;
        this.hasResult = !!text;

        if (!this.hasResult) {
            this.structuredJson = [];
        }

        this.cd.markForCheck();

        clearTimeout(this.debounceBeautifyRaw);

        // TO DO: Optimise RegEx
        setTimeout(() => {
            if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                try {
                    this.isValid = true;
                    this.checkedJson = JSON.parse(text);
                    this.addToHistoryDebounced();

                    this.structuredJson = this.dismantleJson({ '': this.checkedJson }, null);
                    this.calcEditorNumerationCount(this.checkedJson);
                    console.log(this.structuredJson);

                    this.debounceBeautifyRaw = setTimeout(() => {
                            this.rawJson.nativeElement.value = this.beautifyJson(this.checkedJson);
                            this.cd.markForCheck();
                        }, 300);

                    this.isJsonParsing = false;
                    this.cd.markForCheck();
                } catch (e) {
                    this.isValid = false;
                    this.cd.markForCheck();

                    // TO DO: add Error Analyse for SyntaxError
                    console.error(e);
                }
            } else {
                this.isValid = false;
                this.cd.markForCheck();
            }
        });
    }

    private beautifyJson(json: string): string {
        return JSON.stringify(json, null, this.TAB_SIZE);
    }

    private dehydrate(): void {
        const latestVersion: JsonVersionHistory = this.getLatestVersionFromHistory();
        if (latestVersion && JSON.parse(latestVersion.json)) {
            this.publishJson(latestVersion.json);
        }
    }

    private publishJson(json: string): void {
        this.rawJson.nativeElement.value = this.beautifyJson(JSON.parse(json));
        this.rawJsonChanged();
    }

    private doCopy(text: any): void {
        this.shadowedTextarea.nativeElement.value = text.toString();
        this.shadowedTextarea.nativeElement.select();
        this.shadowedTextarea.nativeElement.setSelectionRange(0, 99999);
        document.execCommand('copy');
    }

    private buildJson(structuredJson: JsonType[], first: boolean = false): string {
        let json: any = {};

        if (first && typeof structuredJson[ 0 ].value === 'object') {
            json = this.buildJson(structuredJson[ 0 ].value);
        } else {
            structuredJson.filter((j: JsonType) => !j.remove).forEach((child: JsonType) => {
                if (typeof child.value === 'object' && child.type === Types.OBJECT) {
                    const object: string = this.buildJson(child.value);
                    if (child.key) {
                        json[ child.key ] = object;
                    } else {
                        json = object;
                    }
                } else if (typeof child.value === 'object' && child.type === Types.ARRAY) {
                    const childArray: any[] = [];
                    child.value.forEach((c: JsonType) => {
                        childArray.push(
                            typeof child.value === 'object' ?
                                this.buildJson(child.value) :
                                child.value
                        );
                    });

                    if (child.key) {
                        json[ child.key ] = childArray;
                    } else {
                        json = childArray;
                    }
                } else {
                    json[ child.key ] = child.value;
                }
            });
        }

        return json;
    }

    private dismantleJson(layer: any, parType: Types): JsonType[] {
        const keys = Object.keys(layer);
        const jsonified: JsonType[] = [];

        keys.forEach((key) => {
            const isNull = layer[ key ] === null;
            const isString = typeof layer[ key ] === 'string';
            const isBoolean = typeof layer[ key ] === 'boolean';
            const isNumber = typeof layer[ key ] === 'number';
            const isArray = Array.isArray(layer[ key ]);

            const type: Types = isNull ? Types.NULL : isNumber ? Types.NUMBER : isBoolean ? Types.BOOLEAN : isString ? (
                urlRegex().test(layer[ key ]) ? Types.URL : (layer[ key ].match(this.base64RegEx) ? Types.DATA_BASE64 : Types.STRING))
                : isArray ? Types.ARRAY : Types.OBJECT;

            jsonified.push(
                new JsonType(
                    uuidv4(),
                    parType && parType !== Types.ARRAY ? key : null,
                    type,
                    isNull || isString || isNumber || isBoolean ? layer[ key ] : this.dismantleJson(layer[ key ], type)
                )
            );
        });

        return jsonified;
    }

    private getLatestVersionFromHistory(): JsonVersionHistory {
        this.versionHistory = this.deserialiseJsonVersionHistory(
            this.localStorage.retrieve(this.jsonHistoryKey)
        );

        this.updateSelection();
        return this.versionHistory[ 0 ];
    }

    private updateSelection(): void {
        this.versionSelection = this.versionHistory.map(({ timestamp }) => timestamp); // new Date(timestamp).toLocaleString()
    }

    private addToHistoryDebounced(): void {
        clearTimeout(this.debounceVersionHistory);

        this.debounceVersionHistory = setTimeout(
            () => this.executeAddToHistory(), this.versionHistoryDebounceVal);
    }

    private executeAddToHistory(): void {
        const newEntry: string = JSON.stringify(this.checkedJson);

        if (this.versionHistory.length > 0 && this.versionHistory.find((v: JsonVersionHistory) => v.json === newEntry)) {
            return;
        }

        this.versionHistory.push(
            new JsonVersionHistory(
                new Date().toISOString(),
                newEntry)
        );

        this.versionHistory
            .sort((a: JsonVersionHistory, b: JsonVersionHistory) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


        if (this.versionHistory.length > 10) {
            this.versionHistory.pop();
        }

        this.localStorage.store(
            this.jsonHistoryKey,
            this.versionHistory
        );

        this.updateSelection();
    }

    private deserialiseJsonVersionHistory(storage: any): JsonVersionHistory[] {
        const deserialised: JsonVersionHistory[] = [];

        try {
            (storage as any[]).forEach((entry: any) => {
                deserialised.push(
                    new JsonVersionHistory(
                        entry.timestamp,
                        entry.json
                    )
                );
            });
        } catch (e) {
            return [];
        }

        return deserialised;
    }
}
