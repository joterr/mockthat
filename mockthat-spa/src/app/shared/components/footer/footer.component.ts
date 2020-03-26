import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: [ './footer.component.scss' ]
})
export class FooterComponent {
    showPrivacy: boolean;
    showLegalNotice: boolean;

    constructor() { }

    togglePrivacy() {
        this.showPrivacy = !this.showPrivacy;
    }

    toggleLegalNotice() {
        this.showLegalNotice = !this.showLegalNotice;
    }
}
