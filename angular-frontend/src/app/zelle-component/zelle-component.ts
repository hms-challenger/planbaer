import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zelle-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zelle-component.html',
  styleUrl: './zelle-component.css',
})
export class ZelleComponent {
  @Input() tagData: any; // zeile.tage[tag]
  @Output() stundenGeaendert = new EventEmitter<any>();
  @Output() geloescht = new EventEmitter<any>();

  berechneStunden() {
    // Wenn du die Berechnung im Parent machen willst, emitten
    this.stundenGeaendert.emit(this.tagData);
  }

  loeschen() {
    this.geloescht.emit(this.tagData);
  }
}
