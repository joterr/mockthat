import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { JsonType, Types } from './json-validator.model';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-json-validator',
    templateUrl: './json-validator.component.html',
    styleUrls: [ './json-validator.component.scss' ]
})
export class JsonValidatorComponent implements OnInit, OnDestroy {
    @ViewChild('rawJson') rawJson: ElementRef;
    @ViewChild('shadowedTextarea') shadowedTextarea: ElementRef;

    isValid: boolean;
    hasResult: boolean;

    showTypes: boolean;

    structuredJson: JsonType[] = [];
    checkedJson = '';

    readonly jsonHistoryKey: string = 'json_validation_history';
    readonly TYPES = Types;

    private subCollector: Subscription[] = [];

    constructor(private localStorage: LocalStorageService) { }

    ngOnInit(): void {
        window.setTimeout(() => {
            this.rawJson.nativeElement.focus();
            this.dehydrate();
        });
    }

    ngOnDestroy(): void {
        this.subCollector.forEach((sub: Subscription) => sub.unsubscribe());
    }

    rawJsonChanged(value: KeyboardEvent): void {
        const text: string = this.rawJson.nativeElement.value;
        this.hasResult = !!text;

        // TO DO: Optimise RegEx
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            try {
                this.checkedJson = JSON.parse(text);
                this.rawJson.nativeElement.value = this.beautifyJson(this.checkedJson);
                this.localStorage.store(this.jsonHistoryKey, JSON.stringify(this.checkedJson));

                this.structuredJson = this.dismantleJson({ '': this.checkedJson });
                console.log(this.structuredJson);

                this.isValid = true;
            } catch (e) {
                this.isValid = false;

                // TO DO: add Error Analyse for SyntaxError
                console.error(e);
            }
        } else {
            this.isValid = false;
        }
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

    private beautifyJson(json: string): string {
        return JSON.stringify(json, null, 4);
    }

    private dehydrate(): void {
        const jsonString: string = this.localStorage.retrieve(this.jsonHistoryKey);
        if (jsonString && JSON.parse(jsonString)) {
            this.rawJson.nativeElement.value = this.beautifyJson(JSON.parse(jsonString));
            this.rawJsonChanged(null);
        }
    }

    private doCopy(text: any): void {
        this.shadowedTextarea.nativeElement.value = text.toString();
        this.shadowedTextarea.nativeElement.select();
        this.shadowedTextarea.nativeElement.setSelectionRange(0, 99999);
        document.execCommand('copy');
    }

    private dismantleJson(nextLvl: any) {
        const keys = Object.keys(nextLvl);
        const jsonified = [];

        keys.forEach((key) => {
            const isString = typeof nextLvl[ key ] === 'string';
            const isBoolean = typeof nextLvl[ key ] === 'boolean';
            const isNumber = typeof nextLvl[ key ] === 'number';
            const isArray = Array.isArray(nextLvl[ key ]);

            jsonified.push(
                new JsonType(
                    !key.match(/[0-9]/g) ? key : null,
                    isNumber ? Types.NUMBER : isBoolean ? Types.BOOLEAN : isString ? Types.STRING : isArray ? Types.ARRAY : Types.OBJECT,
                    isString || isNumber || isBoolean ? nextLvl[ key ] : this.dismantleJson(nextLvl[ key ])
                )
            );
        });

        return jsonified;
    }
}
