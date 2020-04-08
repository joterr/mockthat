import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: [ './dropdown.component.scss' ]
})
export class DropdownComponent {
    @Input() entries: string[];
    @Input() actionText: string;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    @Output() actionClicked: EventEmitter<null> = new EventEmitter<null>();

    isExpanded: boolean;
    selectedIndex = 0;

    handleSelfClicked(index: number) {
        this.isExpanded = false;
        this.selectedIndex = index;
        this.selected.emit(index);
    }

    actionCallback(): void {
        this.actionClicked.emit();
    }
}
