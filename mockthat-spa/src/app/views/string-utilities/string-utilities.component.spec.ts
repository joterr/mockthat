import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringUtilitiesComponent } from './string-utilities.component';
import { LocalStorageService } from 'ngx-webstorage';
import { MockLocalStorageService } from 'src/mocks/local-storage.service.mock';
import { SharedModule } from 'src/app/shared/shared.module';

describe('StringUtilitiesComponent', () => {
    let component: StringUtilitiesComponent;
    let fixture: ComponentFixture<StringUtilitiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule.forRoot()
            ],
            providers: [
                { provide: LocalStorageService, useClass: MockLocalStorageService }
            ],
            declarations: [ StringUtilitiesComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StringUtilitiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
