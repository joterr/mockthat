import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        HeaderNavComponent,
        FooterComponent,
        DropdownComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        HeaderNavComponent,
        FooterComponent,
        DropdownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}
