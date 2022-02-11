import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDateComponent } from './post-date.component';

describe('PostDateComponent', () => {
  let component: PostDateComponent;
  let fixture: ComponentFixture<PostDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
