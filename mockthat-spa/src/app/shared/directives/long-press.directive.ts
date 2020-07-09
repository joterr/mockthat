import {
    Directive,
    Output,
    EventEmitter,
    HostListener,
    OnDestroy,
    OnInit,
    ElementRef,
    HostBinding
} from '@angular/core';
import { Subject, of } from 'rxjs';
import { takeUntil, delay, mergeMap } from 'rxjs/operators';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Directive({
    selector: '[appLongPress]'
})
export class LongPressDirective implements OnInit {
    @Output() longPress: EventEmitter<null> = new EventEmitter();
    @HostBinding('style') style: SafeStyle;

    public mouseUp$ = new Subject();
    public mouseDown$ = new Subject();

    private isLongClick = false;
    private readonly longPressDelay = 350;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.mouseDown$
            .asObservable()
            .pipe(
                mergeMap((e) => {
                    return of(e).pipe(
                        delay(this.longPressDelay),
                        takeUntil(this.mouseUp$),
                    );
                }),
            ).subscribe(() => {
                this.handleLongPress();
            });
    }

    @HostListener('mousedown', [ '$event' ])
    onMouseDown(event: MouseEvent): void {
        this.mouseDown$.next(event);
    }

    @HostListener('click', [ '$event' ])
    onClick(event: MouseEvent): void {
        if (this.isLongClick) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.isLongClick = false;
    }

    @HostListener('mouseup', [ '$event' ])
    onMouseUp(event: MouseEvent): void {
        this.mouseUp$.next(event);
    }

    private handleLongPress(): void {
        this.longPress.emit();
        this.isLongClick = true;

        this.style = this.sanitizer.bypassSecurityTrustStyle('opacity: 0.1');

        setTimeout(() => {
            this.style = '';
        }, 200);
    }
}
