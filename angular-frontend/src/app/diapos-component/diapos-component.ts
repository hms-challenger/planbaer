import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { BackendService } from '../services/backend';

@Component({
  selector: 'app-diapos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './diapos-component.html',
  styleUrls: ['./diapos-component.css']
})
export class DiaposComponent implements OnInit {

  positionDataSource = new MatTableDataSource<any>([]);
  allPositionColumns = [
    { key: 'positionsid', label: 'Position-ID' },
    { key: 'position', label: 'Position' }
  ];

  constructor(
    private backendService: BackendService,
    private dialogRef: MatDialogRef<DiaposComponent>
  ) {}

  ngOnInit(): void {
    this.loadPositionen();
  }

  /** Lädt alle Positionen */
  loadPositionen(): void {
    this.backendService.getPositionen().subscribe({
      next: (res: any) => {
        console.log('Positionen geladen:', res.data);
        this.positionDataSource.data = res.data ?? [];
      },
      error: (err) => console.error('Fehler beim Laden der Positionen:', err)
    });
  }

  /** Klick auf Zeile → Position auswählen */
  onRowDoubleClick(row: any): void {
    this.dialogRef.close(row); // Gibt die gewählte Position zurück
    console.log(row);
  }

  /** Neue Position anlegen */
  onNeuePosition(): void {
    const neuePos = prompt('Neue Position eingeben:');
    if (!neuePos) return;

    this.backendService.addPosition({ position: neuePos }).subscribe({
      next: (created) => {
        this.positionDataSource.data = [...this.positionDataSource.data, created];
      },
      error: (err) => console.error('Fehler beim Anlegen der Position:', err)
    });
  }

  /** Spalten für die Tabelle */
  get displayedColumns(): string[] {
    return this.allPositionColumns.map(c => c.key);
  }
}
