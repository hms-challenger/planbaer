import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../services/backend';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DialogComponent } from '../dialog-component/dialog-component';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './team-component.html',
  styleUrls: ['./team-component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TeamComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  mitarbeitendendata: any[] = [];
  selectedColumnKeys: string[] = [];
  allColumns = [
    { key: 'stammid', label: 'ID' },
    { key: 'posid', label: 'Positions-ID' },
    { key: 'statusid', label: 'Status-ID' },
    { key: 'nachname', label: 'Nachname' },
    { key: 'vorname', label: 'Vorname' },
    { key: 'positionsname', label: 'Position' },
    { key: 'statusname', label: 'Status' },
    { key: 'geburtstag', label: 'Geburtstag' },
    { key: 'mail', label: 'E-Mail' },
    { key: 'tel', label: 'Telefon' },
    { key: 'tel_p', label: 'Telefon privat' },
    { key: 'soll', label: 'Soll-Zeit' },
    { key: 'team', label: 'Team-Zeit' },
    { key: 'vorbereitung', label: 'Vorbereitungs-Zeit' }
  ];

  constructor(
    private backendService: BackendService,
    private dialog: MatDialog
  ) {}

  dialogButton = 'Aktualisieren';
  saving = false;

  ngOnInit() {
    this.selectedColumnKeys = ['nachname', 'vorname', 'position', 'status'];
    this.loadColumnsFromStorage();
    this.loadTeamView();
  }

  loadTeamView() {
    this.backendService.getMitarbeitendeView().subscribe({
      next: (res: any) => {
        this.mitarbeitendendata = res.data;
        this.dataSource.data = this.mitarbeitendendata;
      },
      error: (err) => console.error('Fehler beim Laden:', err)
    });
  }

  get displayedColumns() {
    return this.allColumns.filter(c => this.selectedColumnKeys.includes(c.key));
  }

  get displayedColumnKeys(): string[] {
    return this.displayedColumns.map(c => c.key);
  }

  onColumnsChange() {
    localStorage.setItem('teamColumns', JSON.stringify(this.selectedColumnKeys));
  }

  loadColumnsFromStorage() {
    const saved = localStorage.getItem('teamColumns');
    if (saved) {
      this.selectedColumnKeys = JSON.parse(saved);
    }
  }

  toggleColumn(key: string, event: MatCheckboxChange) {
    if (event.checked) {
      if (!this.selectedColumnKeys.includes(key)) {
        this.selectedColumnKeys.push(key);
      }
    } else {
      this.selectedColumnKeys = this.selectedColumnKeys.filter(k => k !== key);
    }
    this.onColumnsChange();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Öffnet den Dialog für ein neues Teammitglied */
  onNeuesTeammitglied() {
    this.openDialog({});
  }

  /** Öffnet den Dialog für ein bestehendes Mitglied */
  onRowDoubleClick(row: any) {
    this.openDialog(row);
  }

  /** Einheitliche Dialog-Logik */
  private openDialog(data: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      data: {
        ...data,
        dialogTitel: data.stammid ? `Mitarbeitenden-Daten` : 'Neues Teammitglied anlegen',
        dialogButton: 'Speichern'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveTeamMember(result, dialogRef);
      }
    });
  }

  /**
   * Speichert ein Teammitglied (POST wenn neu, PUT wenn bestehend)
   * @param member Das Teammitglied-Objekt
   * @param dialogRef Referenz zum Dialog, um ihn nach erfolgreichem Speichern zu schließen
   */
  private saveTeamMember(member: any, dialogRef: MatDialogRef<DialogComponent>) {
    if (!member) return;
    this.saving = true;

    // Datum für MariaDB: YYYY-MM-DD
    if (member.geburtstag) {
      const d = new Date(member.geburtstag);
      member.geburtstag = `${d.getFullYear()}-${(d.getMonth()+1)
        .toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
    }

    // Leere Strings → null
    Object.keys(member).forEach(k => {
      if (member[k] === '') member[k] = null;
    });

    // Integer-Felder korrekt konvertieren
    const payload = {
      ...member,
      posid: member.posid !== null ? Number(member.posid) : null,
      statusid: member.statusid !== null ? Number(member.statusid) : null,
      plz: member.plz !== null ? Number(member.plz) : null,
      soll: member.soll !== null ? Number(member.soll) : null,
      team: member.team !== null ? Number(member.team) : null,
      vorbereitung: member.vorbereitung !== null ? Number(member.vorbereitung) : null
    };

    if (member.stammid) {
      // PUT → Update
      this.backendService.updateMitarbeitende(member.stammid, payload).subscribe({
        next: (res: any) => {
          dialogRef.close(res.data ?? payload);
          this.loadTeamView();
          this.saving = false;
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren:', err);
          this.saving = false;
        }
      });
    } else {
      // POST → Neues Mitglied
      this.backendService.addMitarbeitende(payload).subscribe({
        next: (res: any) => {
          dialogRef.close(res.data ?? payload);
          if (res.data) {
            this.mitarbeitendendata.push(res.data);
          }
          this.dataSource.data = this.mitarbeitendendata;
          this.saving = false;
        },
        error: (err) => {
          console.error('Fehler beim Anlegen:', err);
          this.saving = false;
        }
      });
    }
  }
}
