import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: [ './dropdown.component.scss' ]
})
export class DropdownComponent {
    @Input() entries: string[];
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    isExpanded: boolean;
    selectedIndex = 0;

    handleSelfClicked(index: number) {
        this.isExpanded = false;
        this.selectedIndex = index;
        this.selected.emit(index);
    }
}
