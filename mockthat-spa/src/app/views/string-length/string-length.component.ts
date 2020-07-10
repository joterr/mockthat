import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
    selector: 'app-string-length',
    templateUrl: './string-length.component.html',
    styleUrls: [ './string-length.component.scss' ]
})
export class StringLengthComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('string') rawString: ElementRef;

    stringLength: number;
    stringLineBreaks: number;

    private subCollector: Subscription[] = [];

    ngOnInit() {
        window.setTimeout(() => {
            this.rawString.nativeElement.focus();
        });

        this.stringLength = 0;
        this.stringLineBreaks = 0;
    }

    ngAfterViewInit() {
        this.subCollector.push(
            fromEvent(this.rawString.nativeElement, 'input').subscribe(() => this.handleStringChanged())
        );
    }

    ngOnDestroy() {
        this.subCollector.forEach((s: Subscription) => s.unsubscribe());
    }

    private handleStringChanged(): void {
        const stringInput: string = this.rawString.nativeElement.value as string;
        this.stringLength = stringInput.length;
        this.stringLineBreaks = (stringInput.match(/\n/g) || []).length;
    }
}
