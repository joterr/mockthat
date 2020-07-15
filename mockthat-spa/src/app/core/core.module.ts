import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateSeoService } from './services/update-seo/update-seo.service';
import { WINDOW_PROVIDERS } from './services/window-ref.service';


@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        WINDOW_PROVIDERS,
        UpdateSeoService
    ]
})
export class CoreModule { }
