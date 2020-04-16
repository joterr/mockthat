import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ButtonType, ButtonLevel } from './button.model';
import { Observable, merge } from 'rxjs';
import { debounceTime, mapTo } from 'rxjs/operators';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: [ './button.component.scss' ]
})
export class ButtonComponent implements OnInit {

    @Input() level: ButtonLevel;
    @Input() type: ButtonType = null;
    @Input() active: boolean;
    @Input() text: string;
    @Input() feedbackText: string = null;

    @Output() action: EventEmitter<null> = new EventEmitter<null>();

    enabledIcon: string;
    disabledIcon: string;
    showMicroFeedback$: Observable<boolean>;

    constructor() { }

    ngOnInit(): void {
        this.setIcons();

        const showBubble$ = this.action.pipe(mapTo(true));
        const hideBubble$ = this.action.pipe(
            debounceTime(400),
            mapTo(false)
        );
        this.showMicroFeedback$ = merge(showBubble$, hideBubble$);
    }

    triggerAction(): void {
        this.action.emit();
    }

    private setIcons(): void {
        switch (this.type) {
            case ButtonType.TOGGLE_VISIBILITY:
                this.enabledIcon = 'far fa-eye';
                this.disabledIcon = 'far fa-eye-slash';
                break;
        }
    }
}
