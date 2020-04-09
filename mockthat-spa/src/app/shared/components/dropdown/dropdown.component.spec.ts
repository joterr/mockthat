import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DropdownComponent', () => {
    let component: DropdownComponent;
    let fixture: ComponentFixture<DropdownComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DropdownComponent ]
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
        component.entries = [ 'TEST', 'TEST2' ];
        fixture.detectChanges();

        de.query(By.css('.current-selected')).nativeElement.click();
        fixture.detectChanges();

        expect(de.query(By.css('span')).nativeElement.innerText).toBe('TEST');
        expect(component.isExpanded).toBeTruthy();
    });

    it('should emit selected entry', () => {
        spyOn(component.selected, 'emit');

        component.isExpanded = true;
        component.entries = [ 'TEST', 'TEST2', 'TEST3' ];
        fixture.detectChanges();

        de.query(By.css('#entry-2')).nativeElement.click();

        expect(component.selectedIndex).toBe(2);
        expect(component.selected.emit).toHaveBeenCalledWith(2);
    });

    describe('action button', () => {
        it('should show action button', () => {
            component.entries = [ 'TEST', 'TEST2' ];
            component.actionText = 'TEST_ACTION';
            fixture.detectChanges();

            expect(de.query(By.css('button'))).not.toBeNull();
        });

        it('should emit action button clicked', () => {
            spyOn(component.actionClicked, 'emit');

            component.entries = [ 'TEST', 'TEST2' ];
            component.actionText = 'TEST_ACTION';

            fixture.detectChanges();

            de.query(By.css('button')).nativeElement.click();
            expect(component.actionClicked.emit).toHaveBeenCalled();
        });
    });
});
