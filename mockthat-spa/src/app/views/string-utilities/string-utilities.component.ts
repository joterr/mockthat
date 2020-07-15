import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
    selector: 'app-string-utilities',
    templateUrl: './string-utilities.component.html',
    styleUrls: [ './string-utilities.component.scss' ]
})
export class StringUtilitiesComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('string') rawString: ElementRef;

    stringLength: number;
    stringLineBreaks: number;
    stringWordCount: number;

    private subCollector: Subscription[] = [];

    ngOnInit() {
        window.setTimeout(() => {
            this.rawString.nativeElement.focus();
        });

        this.stringLength = this.stringLineBreaks = this.stringWordCount = 0;
    }

    ngAfterViewInit() {
        this.subCollector.push(
            fromEvent(this.rawString.nativeElement, 'input').subscribe(() => this.handleStringChanged())
        );
    }

    ngOnDestroy() {
        this.subCollector.forEach((s: Subscription) => s.unsubscribe());
    }

    doRemoveLineBreaks(): void {
        this.rawStringChanged((this.rawString.nativeElement.value as string).replace(/(\r\n|\n|\r)/gm, ''));
    }

    doRemoveSpaces(): void {
        this.rawStringChanged((this.rawString.nativeElement.value as string).replace(/ /gm, ''));
    }

    doUppercase(): void {
        this.rawStringChanged((this.rawString.nativeElement.value as string).toUpperCase());
    }

    doLowercase(): void {
        this.rawStringChanged((this.rawString.nativeElement.value as string).toLowerCase());
    }

    private rawStringChanged(s: string): void {
        this.rawString.nativeElement.value = s;
        this.handleStringChanged();
    }

    private handleStringChanged(): void {
        const stringInput: string = this.rawString.nativeElement.value as string;
        this.stringLength = stringInput.length;
        this.stringLineBreaks = (stringInput.match(/\n/g) || []).length;
        this.stringWordCount = stringInput.replace(/\w+/g, 'x').replace(/[^x]+/g, '').length;
    }
}
