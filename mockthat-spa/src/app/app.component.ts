import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SHARED_CONSTANTS } from './shared/shared-constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
    isSmallView = true;

    constructor(private router: Router) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.isSmallView = val.url && val.url === `/${SHARED_CONSTANTS.ROUTES.STRING_LENGTH}`;
            }
        });
    }
}
