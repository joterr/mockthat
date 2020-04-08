import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit, Type } from '@angular/core';
import { JsonType, Types, JsonVersionHistory } from './json-validator.model';
import { Subscription, fromEvent } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-json-validator',
    templateUrl: './json-validator.component.html',
    styleUrls: [ './json-validator.component.scss' ]
})
export class JsonValidatorComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('rawJson') rawJson: ElementRef;
    @ViewChild('shadowedTextarea') shadowedTextarea: ElementRef;

    isValid: boolean;
    hasResult: boolean;

    showTypes: boolean;

    structuredJson: JsonType[] = [];
    checkedJson = '';
    versionHistory: JsonVersionHistory[] = [];

    versionSelection: string[] = [];

    readonly TYPES = Types;

    private subCollector: Subscription[] = [];
    private debounceBeautifyRaw: any; // NodeJS.Timeout
    private debounceVersionHistory: any; // NodeJS.Timeout

    private readonly jsonHistoryKey: string = 'json_validation_history';
    private readonly TAB_SIZE: number = 4;
    private readonly versionHistoryDebounceVal = 5000;

    constructor(private localStorage: LocalStorageService) { }

    ngOnInit(): void {
        window.setTimeout(() => {
            this.rawJson.nativeElement.focus();
            this.dehydrate();
        });
    }

    ngAfterViewInit(): void {
        this.subCollector.push(
            fromEvent(this.rawJson.nativeElement, 'keyup').subscribe(() => this.rawJsonChanged()),
            fromEvent(this.rawJson.nativeElement, 'keydown').subscribe((key: KeyboardEvent) => this.handleKeyPress(key)),
        );
    }

    ngOnDestroy(): void {
        this.subCollector.forEach((s: Subscription) => s.unsubscribe());
    }

    copyBeautified(): void {
        this.doCopy(JSON.stringify(this.checkedJson, null, '\t'));
    }

    copyStringified(): void {
        this.doCopy(JSON.stringify(this.checkedJson));
    }

    toggleTypes(): void {
        this.showTypes = !this.showTypes;
    }

    selectedVersion(index: number): void {
        clearTimeout(this.debounceBeautifyRaw);
        clearTimeout(this.debounceVersionHistory);
        this.checkedJson = this.versionHistory[index].json;
        this.publishJson(this.checkedJson);

        console.log(`Selected New Version from ${this.versionHistory[index].timestamp}`);
    }

    deleteVersionHistory(): void {
        clearTimeout(this.debounceBeautifyRaw);
        clearTimeout(this.debounceVersionHistory);
        this.localStorage.clear(this.jsonHistoryKey);
        this.rawJson.nativeElement.value = '';
        this.hasResult = this.isValid = false;
        this.structuredJson = this.versionHistory = this.versionSelection = [];
    }

    private handleKeyPress(event: KeyboardEvent) {
        if (event.keyCode === 9 || event.which === 9) {
            event.preventDefault();
            document.execCommand('insertText', false, ' '.repeat(this.TAB_SIZE));
        }
    }

    private rawJsonChanged(): void {
        const text: string = this.rawJson.nativeElement.value;
        this.hasResult = !!text;

        clearTimeout(this.debounceBeautifyRaw);

        // TO DO: Optimise RegEx
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            try {
                this.isValid = true;
                this.checkedJson = JSON.parse(text);
                this.addToHistoryDebounced();

                this.structuredJson = this.dismantleJson({ '': this.checkedJson }, null);
                console.log(this.structuredJson);

                this.debounceBeautifyRaw = setTimeout(() => this.rawJson.nativeElement.value = this.beautifyJson(this.checkedJson), 300);

            } catch (e) {
                this.isValid = false;

                // TO DO: add Error Analyse for SyntaxError
                console.error(e);
            }
        } else {
            this.isValid = false;
        }
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

    private dismantleJson(layer: any, parType: Types) {
        const keys = Object.keys(layer);
        const jsonified = [];

        keys.forEach((key) => {
            const isNull = layer[ key ] === null;
            const isString = typeof layer[ key ] === 'string';
            const isBoolean = typeof layer[ key ] === 'boolean';
            const isNumber = typeof layer[ key ] === 'number';
            const isArray = Array.isArray(layer[ key ]);

            const type: Types = isNull ? Types.NULL : isNumber ? Types.NUMBER : isBoolean ? Types.BOOLEAN :
                isString ? Types.STRING : isArray ? Types.ARRAY : Types.OBJECT;

            jsonified.push(
                new JsonType(
                    parType && parType !== Types.ARRAY ? key : null,
                    type,
                    isNull || isString || isNumber || isBoolean ? layer[ key ] : this.dismantleJson(layer[ key ], type)
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
        this.versionSelection = this.versionHistory.map(({ timestamp }) => new Date(timestamp).toLocaleString());
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
