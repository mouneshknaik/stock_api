import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveWatchComponent } from './live-watch.component';

describe('LiveWatchComponent', () => {
  let component: LiveWatchComponent;
  let fixture: ComponentFixture<LiveWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveWatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
