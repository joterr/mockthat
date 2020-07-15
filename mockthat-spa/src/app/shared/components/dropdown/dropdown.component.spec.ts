import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MomentModule } from 'ngx-moment';

describe('DropdownComponent', () => {
    let component: DropdownComponent;
    let fixture: ComponentFixture<DropdownComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DropdownComponent ],
            imports: [
                MomentModule
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        de = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should expand', () => {
        component.entries = [ '2019-07-14T15:13:53.833Z', '2020-07-14T15:10:57.545Z' ];
        fixture.detectChanges();

        de.query(By.css('.current-selected')).nativeElement.click();
        fixture.detectChanges();

        expect(de.query(By.css('span')).nativeElement.innerText).toBe('07/14/2019');
        expect(component.isExpanded).toBeTruthy();
    });

    it('should emit selected entry', () => {
        spyOn(component.selected, 'emit');

        component.isExpanded = true;
        component.entries = [ '2020-07-14T15:13:53.833Z', '2020-07-14T15:10:57.545Z', '2020-07-10T12:11:42.829Z' ];
        fixture.detectChanges();

        de.query(By.css('#entry-2')).nativeElement.click();

        expect(component.selectedIndex).toBe(2);
        expect(component.selected.emit).toHaveBeenCalledWith(2);
    });

    describe('action button', () => {
        it('should show action button', () => {
            component.entries = [ '2020-07-14T15:10:57.545Z', '2020-07-10T12:11:42.829Z' ];
            component.actionText = 'TEST_ACTION';
            fixture.detectChanges();

            expect(de.query(By.css('button'))).not.toBeNull();
        });

        it('should emit action button clicked', () => {
            spyOn(component.actionClicked, 'emit');

            component.entries = [ '2020-07-14T15:10:57.545Z', '2020-07-10T12:11:42.829Z' ];
            component.actionText = 'TEST_ACTION';

            fixture.detectChanges();

            de.query(By.css('button')).nativeElement.click();
            expect(component.actionClicked.emit).toHaveBeenCalled();
        });
    });
});
