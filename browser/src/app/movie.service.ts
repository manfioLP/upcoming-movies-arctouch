import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Movie, Genre } from '../model/Movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private api_url = 'http://localhost:1968/api';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  constructor(
    private http: HttpClient) { 
    }
  
  

  getUpcomingMovies(page: number): Observable<any> {
    return this.http.get<Movie[]>(`${this.api_url}/upcoming?page=${page}`)
      .pipe(
        tap(res => {}))
  }

  getMovie(id: number): Observable<any> {    
    return this.http.get<Movie[]>(`${this.api_url}/details/${id}`)
      .pipe(
        tap(res => {})
      )
  }

  getGenres(): Observable<any> {    
    return this.http.get<Genre[]>(`${this.api_url}/genres`)
      .pipe(
        tap(res => {})
      )
  }

}
