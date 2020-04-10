import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class TimeseriesService {
  constructor(private httpClient: HttpClient) {}
// Http Get Request method
  get(url?: string): Observable<any> {
    return this.httpClient.get(url, { observe: "response" }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
