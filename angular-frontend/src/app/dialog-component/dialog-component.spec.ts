import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-adressen-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Mitarbeitende bearbeiten</h2>
    <form [formGroup]="form" (ngSubmit)="onSave()" class="dialog-form">
      <mat-form-field appearance="outline">
        <mat-label>Vorname</mat-label>
        <input matInput formControlName="vorname">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Nachname</mat-label>
        <input matInput formControlName="nachname">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>E-Mail</mat-label>
        <input matInput formControlName="mail">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Telefon</mat-label>
        <input matInput formControlName="tel">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Straße</mat-label>
        <input matInput formControlName="strasse">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>PLZ</mat-label>
        <input matInput formControlName="plz">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Ort</mat-label>
        <input matInput formControlName="ort">
      </mat-form-field>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Abbrechen</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Speichern</button>
      </div>
    </form>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
  `]
})
export class MitarbeitendeDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MitarbeitendeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      vorname: [data.vorname || '', Validators.required],
      nachname: [data.nachname || '', Validators.required],
      mail: [data.mail || ''],
      tel: [data.tel || ''],
      strasse: [data.strasse || ''],
      plz: [data.plz || ''],
      ort: [data.ort || '']
    });
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.data, ...this.form.value });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
