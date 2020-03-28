import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-json-validator',
    templateUrl: './json-validator.component.html',
    styleUrls: [ './json-validator.component.scss' ]
})
export class JsonValidatorComponent implements OnInit {
    @ViewChild('rawJson') rawJson: ElementRef;
    @ViewChild('formatted') formatted: ElementRef;

    isValid: boolean;
    hasResult: boolean;

    showTypes: boolean;

    constructor() { }

    ngOnInit(): void {
        this.isValid = false;

        window.setTimeout(() => {
            this.rawJson.nativeElement.focus();
        });
    }

    rawJsonChanged(value: KeyboardEvent): void {
        const text: string = this.rawJson.nativeElement.value;
        this.hasResult = !!text;

        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            this.rawJson.nativeElement.innerHTML = JSON.stringify(text);
            this.formatted.nativeElement.innerHTML = JSON.stringify(text);
            this.isValid = true;
        } else {
            this.isValid = false;
            this.formatted.nativeElement.innerHTML = null;
        }
    }

    copyFormatted(): void {

    }

    toggleTypes(): void {
        this.showTypes = !this.showTypes;
    }
}
