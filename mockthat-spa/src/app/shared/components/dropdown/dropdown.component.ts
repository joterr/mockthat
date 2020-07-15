import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';


@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: [ './dropdown.component.scss' ]
})
export class DropdownComponent implements OnInit, OnDestroy {
    @Input() entries: string[];
    @Input() actionText: string;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    @Output() actionClicked: EventEmitter<null> = new EventEmitter<null>();

    isExpanded: boolean;
    selectedIndex = 0;

    private updateInterval: any; // NodeJS.Timeout

    constructor(
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.updateInterval = setInterval(() => {
            this.cd.markForCheck();
        }, 60 * 60 * 1000);
    }

    ngOnDestroy() {
        clearInterval(this.updateInterval);
    }

    handleSelfClicked(index: number) {
        this.isExpanded = false;
        this.selectedIndex = index;
        this.selected.emit(index);
        this.cd.markForCheck();
    }

    actionCallback(): void {
        this.actionClicked.emit();
    }
}
