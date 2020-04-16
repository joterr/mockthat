import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
    declarations: [
        HeaderNavComponent,
        FooterComponent,
        DropdownComponent,
        ButtonComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        HeaderNavComponent,
        ButtonComponent,
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
