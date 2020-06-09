import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonValidatorComponent } from './json-validator.component';
import { LocalStorageService } from 'ngx-webstorage';
import { MockLocalStorageService } from 'src/mocks/local-storage.service.mock';
import { SharedModule } from 'src/app/shared/shared.module';

describe('JsonValidatorComponent', () => {
    let component: JsonValidatorComponent;
    let fixture: ComponentFixture<JsonValidatorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule.forRoot()
            ],
            providers: [
                { provide: LocalStorageService, useClass: MockLocalStorageService }
            ],
            declarations: [ JsonValidatorComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JsonValidatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should trigger on key up', () => {
        expect(component).toBeTruthy();
    });

    it('should handle pressed tab key', () => {
        expect(component).toBeTruthy();
    });

    it('should copy beautified', () => {
        expect(component).toBeTruthy();
    });

    it('should copy stringified', () => {
        expect(component).toBeTruthy();
    });

    it('should copy key', () => {
        expect(component).toBeTruthy();
    });

    it('should copy value', () => {
        expect(component).toBeTruthy();
    });

    it('should remove node', () => {
        expect(component).toBeTruthy();
    });

    it('should remove value', () => {
        expect(component).toBeTruthy();
    });

    it('should sort array desc', () => {
        expect(component).toBeTruthy();
    });

    it('should sort array asc', () => {
        expect(component).toBeTruthy();
    });

    it('should sort object desc', () => {
        expect(component).toBeTruthy();
    });

    it('should sort object asc', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle types', () => {
        expect(component).toBeTruthy();
    });

    it('should set selected version', () => {
        expect(component).toBeTruthy();
    });

    it('should delete version history', () => {
        expect(component).toBeTruthy();
    });
});
