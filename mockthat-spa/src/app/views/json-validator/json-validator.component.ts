import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-json-validator',
    templateUrl: './json-validator.component.html',
    styleUrls: [ './json-validator.component.scss' ]
})
export class JsonValidatorComponent implements OnInit {
    isValid: boolean;
    hasResult: boolean;

    constructor() { }

    ngOnInit(): void {
        this.isValid = false;
    }

}
