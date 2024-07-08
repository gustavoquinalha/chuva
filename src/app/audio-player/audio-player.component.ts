import { Component, ViewChild, ElementRef, signal, HostListener } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlaySolid, heroPauseSolid, heroStopSolid, heroSpeakerXMarkSolid, heroSpeakerWaveSolid, heroArrowPathRoundedSquareSolid, heroArrowTopRightOnSquareSolid } from '@ng-icons/heroicons/solid';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RainCanvasComponent } from '../rain-canvas/rain-canvas.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [NgIf, NgIconComponent, RainCanvasComponent, NgClass, NgFor, FormsModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  viewProviders: [provideIcons({ heroPlaySolid, heroPauseSolid, heroStopSolid, heroSpeakerXMarkSolid, heroSpeakerWaveSolid, heroArrowPathRoundedSquareSolid, heroArrowTopRightOnSquareSolid })]
})

export class AudioPlayerComponent {
  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;
  duration: number = 0;
  currentTime: number = 0;
  volume: number = 1;
  isPlaying = signal(false);
  isLoop = signal(true);
  mp3Url: string = 'https://lazy-days.netlify.app/assets/chuva.mp3';
  showElement = signal(true);
  private timeoutId: any;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private rainDrops: RainDrop[] = [];
  private numDrops: number = 500;
  private animationFrameId: any;

  select = [{
    name: "Rain",
    mp3: "https://lazy-days.netlify.app/assets/chuva.mp3",
  }, {
    name: "Ocean",
    mp3: "https://lazy-days.netlify.app/assets/mar.mp3",
  }, {
    name: "Fireplace",
    mp3: "https://lazy-days.netlify.app/assets/lareira.mp3",
  }]

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.showElement.set(true);
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.showElement.set(false);
    }, 3000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

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

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private createRain(): void {
    for (let i = 0; i < this.numDrops; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const length = Math.random() * 30;
      const speed = Math.random() * 30;
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

  changeSelect() {
    console.log('changeSelect', this.mp3Url);
    this.audioRef.nativeElement.src = this.mp3Url;
    this.audioRef.nativeElement.load();
    this.play();
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
    ctx.strokeStyle = 'rgba(228, 228, 231, 0.5)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}
