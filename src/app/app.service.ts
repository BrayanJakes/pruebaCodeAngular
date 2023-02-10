import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {}

  postPlatos(body: any){
    const uri = `http://localhost:4000/api/platos`;
    return this.http.post(uri, body)
  }

  listarPlatos(){
    const uri = `http://localhost:4000/api/platos`;
    return this.http.get(uri)
  }

  actualizarPlatos(id: string, body: any){
    const uri = `http://localhost:4000/api/platos/${id}`;
    return this.http.put(uri, body)
  }

  deletePlatos(id: string){
    const uri = `http://localhost:4000/api/platos/${id}`;
    return this.http.delete(uri)
  }
}
