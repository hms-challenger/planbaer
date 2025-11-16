import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../services/backend';
import { ZelleComponent } from '../zelle-component/zelle-component';

@Component({
  selector: 'app-dienstplan',
  standalone: true,
  imports: [CommonModule, FormsModule, ZelleComponent],
  templateUrl: './dienstplan-component.html',
  styleUrls: ['./dienstplan-component.css']
})
export class DienstplanComponent implements OnInit {
  dienstplan: any[] = [];
  tage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  aktiveMitarbeitende: any[] = [];
  adminPlan: any = {};
  loading = false;
  error: string | null = null;

  constructor(private backend: BackendService) {}

  ngOnInit() {
    this.ladeMitarbeitende();
  }

  ladeMitarbeitende() {
    this.loading = true;
    this.backend.getMitarbeitendeAktiv().subscribe({
      next: (res: any) => {
        const daten = res.data ?? res;
        this.aktiveMitarbeitende = daten;
        this.dienstplan = daten.map((m: any) => ({
          stammid: m.stammid,
          vorname: m.vorname,
          nachname: m.nachname,
          soll: m.soll,
          team: m.team,
          vorbereitung: m.vorbereitung,
          tage: {
            Montag: this.leeresTagFeld(),
            Dienstag: this.leeresTagFeld(),
            Mittwoch: this.leeresTagFeld(),
            Donnerstag: this.leeresTagFeld(),
            Freitag: this.leeresTagFeld()
          },
          geleistet: 0,
          rest: 0
        }));
        for (const zeile of this.dienstplan) {
          this.berechneGesamtstunden(zeile);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Fehler beim Laden der Mitarbeitenden:', err);
        this.error = 'Fehler beim Laden der Mitarbeitenden.';
        this.loading = false;
      }
    });
  }

  /** Template für einen Tag */
  private leeresTagFeld() {
    return {
      expanded: false,
      start: null,
      ende: null,
      pauseStart: null,
      pauseEnde: null,
      pause: 0,
      stunden: 0,
      teamStunden: 0,
      vorbereitungStunden: 0
    };
  }

  /** Toggle Input-Felder pro Zelle */
  toggleExpand(tagFeld: any) {
    tagFeld.expanded = !tagFeld.expanded;

    // Beispielwerte für Anzeige
    if (tagFeld.expanded) {
      tagFeld.teamStunden = 2;
      tagFeld.vorbereitungStunden = 3;
    }
  }
  /** Stunden berechnen */
  berechneStunden(tagFeld: any, zeile?: any) {
    // 1️⃣ Pausen berechnen
    let pause = 0;
    if (tagFeld.pauseStart && tagFeld.pauseEnde) {
      const pStart = this.parseTime(tagFeld.pauseStart);
      const pEnde = this.parseTime(tagFeld.pauseEnde);
      pause = (pEnde - pStart) / 60;
      if (pause < 0) pause = 0;
      tagFeld.pause = pause;
    } else {
      tagFeld.pause = 0;
    }

    // 2️⃣ Arbeitszeit berechnen (abzüglich Pause)
    if (tagFeld.start && tagFeld.ende) {
      const start = this.parseTime(tagFeld.start);
      const ende = this.parseTime(tagFeld.ende);
      let arbeitszeit = (ende - start) / 60 - pause;

      if (arbeitszeit < 0) arbeitszeit = 0;
      tagFeld.stunden = Number(arbeitszeit.toFixed(2));
    } else {
      tagFeld.stunden = 0;
    }

    // 3️⃣ Wenn Mitarbeiterzeile mitgegeben wurde: neu summieren
    if (zeile) {
      this.berechneGesamtstunden(zeile);
    }
  }

  /** Summiert Stunden über alle Tage und berechnet Rest */
  berechneGesamtstunden(zeile: any) {
    // 1️⃣ Summe aller geleisteten Stunden berechnen
    let summe = 0;
    for (const tag of this.tage) {
      summe += zeile.tage[tag].stunden || 0;
    }
    zeile.geleistet = Number(summe.toFixed(2));

    zeile.geleistet = summe;
    const soll = Number(zeile.soll) || 0;
    zeile.rest = Math.max(soll - zeile.geleistet, 0);

    zeile.rest = Number(zeile.rest.toFixed(2));

    // 4️⃣ Ansicht aktualisieren (wichtig für Angular Change Detection)
    this.dienstplan = [...this.dienstplan];
  }


  /** Zeitstring zu Minuten */
  private parseTime(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  /** Zelle löschen */
  loeschen(tagFeld: any, zeile: any) {
    if (confirm('Wirklich löschen?')) {
      Object.assign(tagFeld, this.leeresTagFeld());
      this.berechneGesamtstunden(zeile);
    }
  }

  /** Admin-Auswahl */
  adminSelect(tag: string, stammid: number) {
    console.log(`Admin für ${tag}:`, stammid);
    this.adminPlan[tag] = stammid;
  }

  /** Dienstplan speichern */
  speichern() {
    const payload = this.dienstplan.map((zeile) => {
      const tageData: any = {};
      for (const tag of this.tage) {
        const feld = zeile.tage[tag];
        if (feld.start || feld.ende || feld.pauseStart || feld.pauseEnde) {
          tageData[tag] = { ...feld };
        }
      }
      return { stammid: zeile.stammid, team: zeile.team, tage: tageData };
    });

    console.log('💾 Dienstplan speichern:', payload);
    // TODO: Backend-Speicherung
  }
}
