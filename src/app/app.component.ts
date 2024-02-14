import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from './model/products';
import { ProductService } from './Service/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'p_AngularHttpRequest';
  allProducts: Product[] = [];
  //101
  isFetching: boolean = false;


 @ViewChild('productsForm') form: NgForm; 
  editMode: boolean = false;
  currentProductId: string;

  //104
  errorMessage: string = null;
  errorSub: Subscription;

  //hence we are dealing with data in product.service we don't need http object anymore, we can delete it from here
  constructor(private http: HttpClient, private productService: ProductService) {}

  onProductCreate(products: {pName: string, desc: string, price: string}) {
    if(!this.editMode)
      this.productService.createProduct(products);
    else
      this.productService.updateProduct(this.currentProductId, products);
  }

  private fetchProducts() {
    this.isFetching = true;
    this.productService.fetchProduct().subscribe((products)=> {
      this.allProducts = products;
      this.isFetching = false;
    }, (err)=> {
      this.errorMessage = err.message;
    });
  }


  ngOnInit(): void {
    this.fetchProducts();

    this.errorSub =  this.productService.error.subscribe((message) => { //subscribein icine callback func veriyorsak bil ki observablein emitledigi datayi burada karsiliyoruz demektir, burada da observablein emitledigibi error mesajini alicaz
      this.errorMessage = message; //we have to unsubsribe from this observable in ondestroy func 
    })
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onProductsFetch() {
    this.fetchProducts();
  }

  onDeleteProduct(id: string) { //we dont need to subscibe this time, we are doing it on product.service.ts's function
    this.productService.deleteProduct(id);
  }

  onDeleteAllProduct() {
    this.productService.deleteAllProducts();
  }

  onEditClicked(id: string) {
    this.currentProductId = id;
    //first: get the product based on the id 
    //second: Populate the form with the product details (formda Product name kismina editleyecegimiz porductin ismi gelsin)
    //and when the Edit button clicked we want to change Add Product button to Save(Update) Product

    //we are storing all Porducts in the this.allProducts array lets access it for get the product based on this.product.id
    let currentProduct = this.allProducts.find((curr) => {return curr.id === id});
    //console.log(currentProduct);

    //console.log(this.form);
    this.form.setValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price
    });

    //button change to Update Product
    this.editMode = true;
  }

 
}
