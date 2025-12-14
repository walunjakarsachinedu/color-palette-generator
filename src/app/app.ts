import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dialog } from './dialog/dialog';
import { ColorPalette } from './dialog/model';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dialog, NgTemplateOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly colorPalette = signal<ColorPalette[]>([
    { color: 'var(--brand-color)', variation: "brand color" },
    { color: 'var(--text-strong)', variation: "text strong" },
    { color: 'var(--text-weak)', variation: "text weak" },
    { color: 'var(--stroke-strong)', variation: "stroke strong" },
    { color: 'var(--stroke-weak)', variation: "stroke weak" },
    { color: 'var(--fill)', variation: "fill" },
  ]);
  
  protected readonly mode = signal<'light' | 'dark'>("dark");
  protected readonly brandColor = signal<string>('#4da3ff'); // Default Blue

  ngOnInit(): void {
    this.refreshPaletteValues();
  }

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

    // 3. Resolve the actual values
    this.refreshPaletteValues();
  }

  copyColor(color: string, index: number) {
    // 1. Copy to clipboard
    navigator.clipboard.writeText(color);

    // 2. Set 'isCopied' to true for THIS item only
    this.colorPalette.update(items => {
      const newItems = [...items]; // Create a shallow copy
      newItems[index] = { ...newItems[index], isCopied: true };
      return newItems;
    });

    // 3. Reset after 1 second (1000ms)
    setTimeout(() => {
      this.colorPalette.update(items => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], isCopied: false };
        return newItems;
      });
    }, 1000);
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

  private refreshPaletteValues() {
    this.colorPalette.update(palette => {
      return palette.map(item => ({
        ...item,
        resolvedValue: this.readCssVar(item.color)
      }));
    });
  }

  // TODO: optimize it to calculate color value without creating dom element 
  private readCssVar(varUsage: string): string {
    const tempEl = document.createElement('div');

    tempEl.style.backgroundColor = varUsage;
    tempEl.style.display = 'none'; 
    document.body.appendChild(tempEl);

    const rgbString = getComputedStyle(tempEl).backgroundColor;
    
    document.body.removeChild(tempEl);

    return this.rgbToHex(rgbString);
  }

  /** Helper to convert "rgb(r, g, b)" -> "#rrggbb" */
  private rgbToHex(rgb: string): string {
    // Extract the numbers from the string
    const result = rgb.match(/\d+/g);
    
    if (!result || result.length < 3) return rgb; 

    // Convert each channel to Hex and pad with zero if needed
    const r = parseInt(result[0]).toString(16).padStart(2, '0');
    const g = parseInt(result[1]).toString(16).padStart(2, '0');
    const b = parseInt(result[2]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  }
}