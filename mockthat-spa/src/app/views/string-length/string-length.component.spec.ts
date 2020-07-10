import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringLengthComponent } from './string-length.component';
import { LocalStorageService } from 'ngx-webstorage';
import { MockLocalStorageService } from 'src/mocks/local-storage.service.mock';
import { SharedModule } from 'src/app/shared/shared.module';

describe('StringLengthComponent', () => {
    let component: StringLengthComponent;
    let fixture: ComponentFixture<StringLengthComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule.forRoot()
            ],
            providers: [
                { provide: LocalStorageService, useClass: MockLocalStorageService }
            ],
            declarations: [ StringLengthComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StringLengthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
