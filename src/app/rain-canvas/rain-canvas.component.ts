import { Component, ElementRef, OnInit, HostListener, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-rain-canvas',
  standalone: true,
  imports: [],
  templateUrl: './rain-canvas.component.html',
  styleUrl: './rain-canvas.component.scss',
})
export class RainCanvasComponent implements OnInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private rainDrops: RainDrop[] = [];
  private numDrops: number = 100;
  private animationFrameId: any;

  @Input() isPlaying: boolean = true;
  @Output() isPlayingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.canvas = this.elementRef.nativeElement.querySelector('#rainCanvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.resizeCanvas();
    this.createRain();
    this.animate();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private createRain(): void {
    for (let i = 0; i < this.numDrops; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const length = Math.random() * 20 + 10;
      const speed = Math.random() * 2 + 2;
      this.rainDrops.push(new RainDrop(x, y, length, speed));
    }
  }

  private animate(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let drop of this.rainDrops) {
      drop.fall(this.canvas.height);
      drop.draw(this.ctx);
    }
    if (this.isPlaying) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  }

  public togglePlayPause(): void {
    console.log('togglePlayPause');

    this.isPlaying = !this.isPlaying;
    this.isPlayingChange.emit(this.isPlaying);
    if (this.isPlaying) {
      this.animate();
    } else {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.ref.detectChanges();
  }
}

class RainDrop {
  constructor(
    public x: number,
    public y: number,
    public length: number,
    public speed: number
  ) { }

  fall(canvasHeight: number): void {
    this.y += this.speed;
    if (this.y > canvasHeight) {
      this.y = Math.random() * -20;
      this.x = Math.random() * window.innerWidth;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.length);
    ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}
