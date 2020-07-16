import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SHARED_CONSTANTS } from './shared/shared-constants';
import { UpdateSeoService } from './core/services/update-seo/update-seo.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
    isSmallView = true;

    constructor(
        private router: Router,
        private updateSeo: UpdateSeoService
    ) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.isSmallView = val.urlAfterRedirects
                    && val.urlAfterRedirects === `/${SHARED_CONSTANTS.ROUTES.STRING_UTILITIES_CALCULATOR}`;
                this.updateSeo.forStaticPage(val.urlAfterRedirects);
            }
        });
    }
}
