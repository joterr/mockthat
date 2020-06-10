import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './components/button/button.component';
import { LongPressDirective } from './directives/long-press.directive';

@NgModule({
    declarations: [
        HeaderNavComponent,
        FooterComponent,
        DropdownComponent,
        ButtonComponent,
        LongPressDirective
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        HeaderNavComponent,
        ButtonComponent,
        FooterComponent,
        DropdownComponent,
        LongPressDirective
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
