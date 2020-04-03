import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit, Type } from '@angular/core';
import { JsonType, Types } from './json-validator.model';
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

    readonly jsonHistoryKey: string = 'json_validation_history';
    readonly TYPES = Types;
    readonly TAB_SIZE: number = 4;

    private subCollector: Subscription[] = [];
    private debounceBeautifyRaw: any; // NodeJS.Timeout

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
                this.addToHistory(JSON.stringify(this.checkedJson));

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
        const jsonString: string = this.localStorage.retrieve(this.jsonHistoryKey);
        if (jsonString && JSON.parse(jsonString)) {
            this.rawJson.nativeElement.value = this.beautifyJson(JSON.parse(jsonString));
            this.rawJsonChanged();
        }
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
            const isString = typeof layer[ key ] === 'string';
            const isBoolean = typeof layer[ key ] === 'boolean';
            const isNumber = typeof layer[ key ] === 'number';
            const isArray = Array.isArray(layer[ key ]);

            const type: Types = isNumber ? Types.NUMBER : isBoolean ? Types.BOOLEAN :
                isString ? Types.STRING : isArray ? Types.ARRAY : Types.OBJECT;

            jsonified.push(
                new JsonType(
                    parType && parType !== Types.ARRAY ? key : null,
                    type,
                    isString || isNumber || isBoolean ? layer[ key ] : this.dismantleJson(layer[ key ], type)
                )
            );
        });

        return jsonified;
    }

    private addToHistory(jsonString: string): void {
        this.localStorage.store(this.jsonHistoryKey, jsonString);
    }
}
