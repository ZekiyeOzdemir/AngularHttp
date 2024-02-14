import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { Product } from '../model/products';
import { Subject } from 'rxjs';

@Injectable({providedIn: "root"}) 
export class ProductService {

    error = new Subject<string>(); 
    constructor(private http: HttpClient) {}


    createProduct(products: {pName: string, desc: string, price: string}) {
    // console.log(products);
    const myheaders = new HttpHeaders({'myHeaderKEY': 'procademyVALUE'});
    this.http.post<{name: string}>('https://angularbyprocademy-b823d-default-rtdb.firebaseio.com/products.json', products, {headers: myheaders})
    .subscribe((response) => {
       console.log(response);
    }, (err) => {
      this.error.next(err.message); 
    });
    }

    fetchProduct() {
      const myHeader = new HttpHeaders().set('content-type', 'application/json').set('Access-Control-Origin', '*') 
      const queryParams = new HttpParams().set('print', 'pretty');

     return this.http.get<{[key: string]: Product}>('https://angularbyprocademy-b823d-default-rtdb.firebaseio.com/products.json'
          , {'headers' : myHeader, params: queryParams})
     .pipe(map((res) => {
      const products = [];
      for(const key in res) {
        if(res.hasOwnProperty(key)){
          products.push({...res[key], id: key});
        }
      }
      return products;
     }))
    }

    deleteProduct(id: string) {
        this.http.delete('https://angularbyprocademy-b823d-default-rtdb.firebaseio.com/products/' + id + '.json')
        .subscribe();
    }

    deleteAllProducts() {
        this.http.delete('https://angularbyprocademy-b823d-default-rtdb.firebaseio.com/products.json')
        .subscribe();
    }

    updateProduct(id: string, value: Product) {
      this.http.put('https://angularbyprocademy-b823d-default-rtdb.firebaseio.com/products/' + id + '.json', value)
      .subscribe();
    }
}

/* fetchProduct(){
this.isFetching = true;
     this.http.get<{[key: string]: Product}>('https://angularbyprocademy-b823d-default-rtdb.firebaseio.com/products.json')
     .pipe(map((res) => {
      const products = [];
      for(const key in res) {
        if(res.hasOwnProperty(key)){
          products.push({...res[key], id: key});
        }
      }
      return products;
     }))
     .subscribe((products) => { 
      console.log(products);
      this.allProducts = products;

      this.isFetching = false;
     });
    } */