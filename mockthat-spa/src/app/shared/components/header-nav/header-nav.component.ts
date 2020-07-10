import { Component } from '@angular/core';
import { SHARED_CONSTANTS } from '../../shared-constants';

@Component({
    selector: 'app-header-nav',
    templateUrl: './header-nav.component.html',
    styleUrls: [ './header-nav.component.scss' ]
})
export class HeaderNavComponent {

    ROUTES: any = SHARED_CONSTANTS.ROUTES;

}
