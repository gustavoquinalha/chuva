import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainCanvasComponent } from './rain-canvas.component';

describe('RainCanvasComponent', () => {
  let component: RainCanvasComponent;
  let fixture: ComponentFixture<RainCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RainCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RainCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
