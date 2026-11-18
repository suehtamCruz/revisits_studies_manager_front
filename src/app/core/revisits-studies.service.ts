import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  PagedResult,
  RevisitAndStudy,
  RevisitAndStudyRequest,
  RevisitAndStudyType,
  Visit,
  VisitRequest,
} from './models';

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

  update(id: string, body: Partial<RevisitAndStudyRequest>): Observable<RevisitAndStudy> {
    return this.http.patch<RevisitAndStudy>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  listVisits(id: string, page = 1, take = 10): Observable<PagedResult<Visit>> {
    const params = new HttpParams().set('page', page).set('take', take);
    return this.http.get<PagedResult<Visit>>(`${this.baseUrl}/${id}/visits`, { params });
  }

  changeType(id: string, type: RevisitAndStudyType): Observable<RevisitAndStudy> {
    return this.http.patch<RevisitAndStudy>(`${this.baseUrl}/${id}/type`, { type });
  }

  addVisit(id: string, body: VisitRequest): Observable<Visit> {
    return this.http.post<Visit>(`${this.baseUrl}/${id}/visits`, body);
  }
}
