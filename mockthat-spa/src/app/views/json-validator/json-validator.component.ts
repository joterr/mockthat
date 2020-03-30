import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JsonType, Types } from './json-validator.model';

@Component({
    selector: 'app-json-validator',
    templateUrl: './json-validator.component.html',
    styleUrls: [ './json-validator.component.scss' ]
})
export class JsonValidatorComponent implements OnInit {
    @ViewChild('rawJson') rawJson: ElementRef;
    @ViewChild('shadowedTextarea') shadowedTextarea: ElementRef;

    isValid: boolean;
    hasResult: boolean;

    showTypes: boolean;

    structuredJson: JsonType[] = [];
    checkedJson = '';

    readonly TYPES = Types;
    // tslint:disable-next-line:max-line-length
    readonly exampleJson = '{"employees":{"employee":[{"id":"1","firstName":true,"lastName":"Cruise","photo":"https://jsonformatter.org/img/tom-cruise.jpg"},{"id":"2","firstName":"Maria","lastName":"Sharapova","photo":"https://jsonformatter.org/img/Maria-Sharapova.jpg"},{"id":"3","firstName":"Robert","lastName":"Downey Jr.","photo":"https://jsonformatter.org/img/Robert-Downey-Jr.jpg"}]}}';

    constructor() { }

    ngOnInit(): void {
        window.setTimeout(() => {
            this.rawJson.nativeElement.value = this.exampleJson;
            this.rawJsonChanged(null);

            this.rawJson.nativeElement.focus();
        });
    }

    rawJsonChanged(value: KeyboardEvent): void {
        const text: string = this.rawJson.nativeElement.value;
        this.hasResult = !!text;

        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            try {
                this.checkedJson = JSON.parse(text);
                this.rawJson.nativeElement.value = JSON.stringify(this.checkedJson, null, 4);
                this.structuredJson = this.dismantleJson({ '': this.checkedJson });
                console.log(this.structuredJson);

                this.isValid = true;
            } catch (e) {
                this.isValid = false;

                // if SyntaxError
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
