import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private baseUrl = 'http://localhost:3000/api'; // Node.js-Backend URL

  constructor(private http: HttpClient) {}

  /** 🔹 Stammdaten aller Mitarbeitenden, inkl. Joins auf Position und Status */
  getMitarbeitendeView(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/m_stamm_view`);
  }

  getMitarbeitendeAktiv(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/m_stamm_aktiv`);
  }

  /** 🔹 Stammdaten aller Mitarbeitenden */
  getMitarbeitende(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/m_stamm`);
  }

  /** 🔹 Einzelne Mitarbeiter:in per ID abrufen */
  getMitarbeitendeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/m_stamm/${id}`);
  }

  /** 🔹 Status-Liste (für Dropdown) */
  getStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/m_status`);
  }

  /** 🔹 Positionen-Liste (für Dropdown) */
  getPositionen(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/m_position`);
  }

  /** 🔹 Mitarbeitende hinzufügen */
  addMitarbeitende(mitarbeitende: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/m_stamm`, mitarbeitende);
  }
  /** 🔹 Postition hinzufügen */
  addPosition(positionen: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/m_position`, positionen);
  }
  /** 🔹 Status hinzufügen */
  addStatus(status: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/m_status`, status);
  }

  /** 🔹 Mitarbeitende aktualisieren */
  updateMitarbeitende(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/m_stamm/${id}`, data);
  }

}
