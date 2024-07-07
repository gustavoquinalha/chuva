import { Component, ViewChild, ElementRef, signal, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlaySolid, heroPauseSolid, heroStopSolid, heroSpeakerXMarkSolid, heroSpeakerWaveSolid, heroArrowPathRoundedSquareSolid } from '@ng-icons/heroicons/solid';
import { NgClass, NgIf } from '@angular/common';
import { RainCanvasComponent } from '../rain-canvas/rain-canvas.component';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [NgIf, NgIconComponent, RainCanvasComponent, NgClass],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  viewProviders: [provideIcons({ heroPlaySolid, heroPauseSolid, heroStopSolid, heroSpeakerXMarkSolid, heroSpeakerWaveSolid, heroArrowPathRoundedSquareSolid })]
})

export class AudioPlayerComponent {
  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;
  duration: number = 0;
  currentTime: number = 0;
  volume: number = 1
  isPlaying = signal(false);
  isLoop = signal(true);
  mp3Url: string = 'https://lazy-days.netlify.app/assets/chuva.mp3';

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private rainDrops: RainDrop[] = [];
  private numDrops: number = 500;
  private animationFrameId: any;

  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.canvas = this.elementRef.nativeElement.querySelector('#rainCanvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.resizeCanvas();
    this.createRain();
    this.animate();
  }

  ngAfterViewInit() {
    this.audioRef.nativeElement.onloadedmetadata = () => {
      this.duration = this.audioRef.nativeElement.duration;
    };

    this.audioRef.nativeElement.ontimeupdate = () => {
      this.currentTime = this.audioRef.nativeElement.currentTime;
    };

    this.audioRef.nativeElement.onplay = () => {
      this.isPlaying.set(true);
      this.animate();
    };

    this.audioRef.nativeElement.onpause = () => {
      this.isPlaying.set(false);
      cancelAnimationFrame(this.animationFrameId);
    };

    // this.audioRef.nativeElement.onvolumechange = (value) => {
    //   console.log("value", value);
    //   value.target.volume
    // };
  }

  play() {
    this.audioRef.nativeElement.play();
  }

  pause() {
    this.audioRef.nativeElement.pause();
  }

  stop() {
    this.audioRef.nativeElement.pause();
    this.audioRef.nativeElement.currentTime = 0;
  }

  seek(event: any) {
    this.audioRef.nativeElement.currentTime = event.target.value;
  }

  changeVolume(event: any) {
    this.volume = event.target.value;
    this.audioRef.nativeElement.volume = this.volume;
  }

  mute() {
    this.volume = 0;
    this.audioRef.nativeElement.volume = this.volume;
  }

  setMaxVol() {
    this.volume = 1;
    this.audioRef.nativeElement.volume = this.volume;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  repeat() {
    this.audioRef.nativeElement.loop = !this.audioRef.nativeElement.loop;
    this.isLoop.set(this.audioRef.nativeElement.loop);
  }

  onPlayPauseChange(isPlaying: boolean): void {
    console.log('onPlayPauseChange', isPlaying);

    this.isPlaying.set(isPlaying);
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
    if (this.isPlaying()) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  }

  public togglePlayPause(): void {
    console.log('togglePlayPause');

    this.isPlaying.set(!this.isPlaying());
    if (this.isPlaying()) {
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
