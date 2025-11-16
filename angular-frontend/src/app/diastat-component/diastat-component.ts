import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { BackendService } from '../services/backend';

@Component({
  selector: 'app-diastat-component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './diastat-component.html',
  styleUrls: ['./diastat-component.css'], // korrigiert
})
export class DiastatComponent implements OnInit {
  statusDataSource = new MatTableDataSource<any>([]);
  allStatusColumns = [
    { key: 'statusid', label: 'Status-ID' },
    { key: 'status', label: 'Status' },
  ];

  constructor(
    private backendService: BackendService,
    private dialogRef: MatDialogRef<DiastatComponent>
  ) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus() {
    this.backendService.getStatus().subscribe({
      next: (res: any) => {
        console.log('Status geladen:', res.data);
        this.statusDataSource.data = res.data ?? [];
      },
      error: (err) => console.error('Fehler beim Laden des Status:', err)
    });
  }

  // Spalten für die Tabelle
  get displayedColumns(): string[] {
    return this.allStatusColumns.map(c => c.key);
  }

  /** Klick auf Zeile → Status auswählen */
  onRowDoubleClick(row: any): void {
    this.dialogRef.close(row); // Gibt den gewählten Status zurück
  }

  /** Optional: Neue Status anlegen */
  onNeuerStatus(): void {
    const neuerStat = prompt('Neuen Status eingeben:');
    if (!neuerStat) return;

    this.backendService.addStatus({ status: neuerStat }).subscribe({
      next: (created) => {
        this.statusDataSource.data = [...this.statusDataSource.data, created];
      },
      error: (err) => console.error('Fehler beim Anlegen des Status:', err)
    });
  }
}
