import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '../services/backend';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-component.html',
  styleUrls: ['./dialog-component.css']
})
export class DialogComponent implements OnInit {
  form!: FormGroup;
  dialogTitel: string;
  dialogButton: string;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    private backendService: BackendService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogTitel = data.dialogTitel || 'Stammdaten bearbeiten';
    this.dialogButton = data.dialogButton || 'Speichern';

    // Formular initialisieren
    this.form = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      geburtstag: [null],
      tel: [''],
      tel_p: [''],
      mail: ['', Validators.email],
      strasse: [''],
      nr: [''],
      plz: [''],
      ort: [''],
      posid: [''],
      statusid: [''],
      soll: [''],
      team: [''],
      vorbereitung: ['']
    });
  }

  ngOnInit() {
    this.loading = false; // immer von sauberem Zustand starten
    this.error = null;

    // Falls ID vorhanden → Daten laden
    if (this.data?.stammid) {
      console.log(`📡 Lade Daten für Mitarbeitenden #${this.data.stammid} ...`);
      this.loading = true;
      this.form.reset(); // <— wichtig, sonst bleiben alte Werte hängen

      this.backendService.getMitarbeitendeById(this.data.stammid).subscribe({
        next: (res) => {
          console.log('✅ Mitarbeitenden-Daten geladen:', res);
          const m = res.data ?? res;

          this.form.patchValue({
            vorname: m.vorname || '',
            nachname: m.nachname || '',
            geburtstag: m.geburtstag ? new Date(m.geburtstag) : null,
            tel: m.tel || '',
            tel_p: m.tel_p || '',
            mail: m.mail || '',
            strasse: m.strasse || '',
            nr: m.nr || '',
            plz: m.plz || '',
            ort: m.ort || '',
            posid: m.posid || '',
            statusid: m.statusid || '',
            soll: m.soll || '',
            team: m.team || '',
            vorbereitung: m.vorbereitung || ''
          });

          this.loading = false;
          this.cdr.markForCheck(); // 👈 erzwingt Template-Aktualisierung
        },
        error: (err) => {
          console.error('❌ Fehler beim Laden:', err);
          this.error = 'Fehler beim Laden der Mitarbeitendendaten.';
          this.loading = false;
        }
      });
    }
  }

  /** Speichert Änderungen und schließt den Dialog */
  onSave() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = { ...this.data, ...this.form.value };

    // Pflichtfelder prüfen
    if (!formValue.nachname || !formValue.vorname) {
      console.error('Nachname und Vorname sind Pflichtfelder!');
      return;
    }

    // Datum umformatieren YYYY-MM-DD
    if (formValue.geburtstag) {
      const d = new Date(formValue.geburtstag);
      formValue.geburtstag = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
    }

    // Leere Strings → null
    Object.keys(formValue).forEach(k => {
      if (formValue[k] === '') formValue[k] = null;
    });

    // Integer-Felder
    const intFields = ['posid', 'statusid', 'plz', 'soll', 'team', 'vorbereitung'];
    intFields.forEach(f => {
      if (formValue[f] !== null && formValue[f] !== undefined) formValue[f] = Number(formValue[f]);
    });

    // Payload nur mit DB-Feldern
    const payload = {
      vorname: formValue.vorname,
      nachname: formValue.nachname,
      mail: formValue.mail ?? null,
      tel: formValue.tel ?? null,
      tel_p: formValue.tel_p ?? null,
      geburtstag: formValue.geburtstag ?? null,
      strasse: formValue.strasse ?? null,
      nr: formValue.nr ?? null,
      plz: formValue.plz ?? null,
      ort: formValue.ort ?? null,
      posid: formValue.posid ?? null,
      statusid: formValue.statusid ?? null,
      soll: formValue.soll ?? null,
      team: formValue.team ?? null,
      vorbereitung: formValue.vorbereitung ?? null,
    };

    // POST oder PUT
    if (formValue.stammid) {
      this.backendService.updateMitarbeitende(formValue.stammid, payload).subscribe({
        next: (res) => {
          console.log('✅ Mitarbeitenden aktualisiert', res);
          this.dialogRef.close({ success: true, data: payload }); // <-- Objekt, kein true
        },
        error: (err) => {
          console.error('❌ Fehler beim Aktualisieren', err);
        }
      });
    } else {
      this.backendService.addMitarbeitende(payload).subscribe({
        next: (res) => {
          console.log('✅ Mitarbeitenden angelegt', res);
          this.dialogRef.close({ success: true, data: res.data }); // <-- Objekt
        },
        error: (err) => console.error('❌ Fehler beim Anlegen', err)
      });
    }
  }



  /** Bricht ab und schließt den Dialog ohne Änderungen */
  onCancel() {
    this.dialogRef.close();
  }
}
