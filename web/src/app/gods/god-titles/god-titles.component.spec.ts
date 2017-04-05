import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodTitlesComponent } from './god-titles.component';

describe('GodTitlesComponent', () => {
  let component: GodTitlesComponent;
  let fixture: ComponentFixture<GodTitlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodTitlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
