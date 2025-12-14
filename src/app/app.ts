import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dialog } from './dialog/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dialog],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('color-palette');
  protected readonly colorPalette = signal<{ variation: string, color: string }[]>([
    { color: 'var(--brand-color)', variation: "brand color" },
    { color: 'var(--text-strong)', variation: "text strong" },
    { color: 'var(--text-weak)', variation: "text weak" },
    { color: 'var(--stroke-strong)', variation: "stroke strong" },
    { color: 'var(--stroke-weak)', variation: "stroke weak" },
    { color: 'var(--fill)', variation: "fill" },
  ]);
  
  protected readonly mode = signal<'light' | 'dark'>("dark");
  protected readonly brandColor = signal<string>('#4da3ff'); // Default Blue

  toggleTheme() {
    const theme = this.mode() === "dark" ? "light" : "dark";
    this.mode.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  openColorPicker(input: HTMLInputElement) {
    input.click();
  }

  updateBrandColor(event: Event) {
    const hexValue = (event.target as HTMLInputElement).value;

    // 1. Update signal and CSS Variable for the specific Brand Color
    this.brandColor.set(hexValue);
    document.documentElement.style.setProperty('--brand-color', hexValue);

    // 2. Convert Hex to Hue (0-360) and update the Theme Engine
    const hue = this.getHueFromHex(hexValue);
    document.documentElement.style.setProperty('--brand-color-hue', hue.toString());
  }

  private getHueFromHex(hex: string): number {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta === 0) h = 0;
    else if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    return h;
  }
}