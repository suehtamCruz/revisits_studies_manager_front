import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RevisitAndStudy, RevisitAndStudyRequest, RevisitAndStudyType } from './models';

export interface RevisitAndStudyFilter {
  dayOfWeek?: number;
  type?: RevisitAndStudyType;
}

@Injectable({ providedIn: 'root' })
export class RevisitsStudiesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/revisitAndStudies`;

  list(filter: RevisitAndStudyFilter = {}): Observable<RevisitAndStudy[]> {
    let params = new HttpParams();
    if (filter.dayOfWeek !== undefined) {
      params = params.set('dayOfWeek', filter.dayOfWeek);
    }
    if (filter.type) {
      params = params.set('type', filter.type);
    }
    return this.http.get<RevisitAndStudy[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<RevisitAndStudy> {
    return this.http.get<RevisitAndStudy>(`${this.baseUrl}/${id}`);
  }

  create(body: RevisitAndStudyRequest): Observable<RevisitAndStudy> {
    return this.http.post<RevisitAndStudy>(this.baseUrl, body);
  }

  update(id: string, body: RevisitAndStudyRequest): Observable<RevisitAndStudy> {
    return this.http.put<RevisitAndStudy>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
