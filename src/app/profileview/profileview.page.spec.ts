import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileviewPage } from './profileview.page';

describe('ProfileviewPage', () => {
  let component: ProfileviewPage;
  let fixture: ComponentFixture<ProfileviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
