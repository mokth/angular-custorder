import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Http,Headers } from "@angular/http";

import { Custitem } from "app/entities/cust-item";
import { ShipAddr } from "app/entities/shipp-addr";
import { CanComponentDeactivate } from "app/canDeactivateGuard";
import { SalesOrder } from "app/entities/sales-order";
import { AuthserviceService } from "app/authservice.service";
import { CustSOItem } from "app/entities/so-items";

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit,CanComponentDeactivate {
  salesorder: SalesOrder;
  orderitems:Custitem[]=[];
  shipaddr:ShipAddr;
  ttltax: number = 0;
  netamt: number = 0;
  ttlamt: number = 0;
  remark: string;
  pono:string;
  message:string;
  sucessSubmit:boolean=false;
  editmode:string;
  sono:string="AUTO";
  title:string;
  columns = [
        { dataField: 'icode', caption: 'ITEM',width:120  },
        { dataField: 'idesc', caption:'DESCRIPTION',width:300 },
        // { dataField: 'image',caption:'IMAGE',width:200, cellTemplate:'cellTemplate'},
        { dataField: 'qty', caption: 'QTY',width:80 },
        { dataField: 'uom', caption:'UOM',width:60 },
        { dataField: 'price', caption: 'U/PRICE',width:100,dataType: 'number',format: 'fixedPoint', precision: 2 },
        { dataField: 'taxamt', caption: 'TAX AMT',width:100,dataType: 'number',format: 'fixedPoint', precision: 2 },
        { dataField: 'amt', caption: 'AMOUNT',width:120,dataType: 'number',format: 'fixedPoint', precision: 2 },
        { dataField: 'deldate', caption: 'DELIVER',width:120, dataType: 'date', format: 'dd/MM/yyyy' },
        { dataField: 'note', caption: 'NOTE',width:150,cellTemplate:'remTemplate' }

    ];

  constructor(private auth:AuthserviceService,
              private router:Router,
              private route: ActivatedRoute,
              private http:Http,
              @Inject('API_URL') private apiUrl:string
              ) { }

  ngOnInit() {
    let token= localStorage.getItem('_order');
    var psjons = JSON.parse(token);    
    let token2= localStorage.getItem('_shipaddr');
    var psjons2 = JSON.parse(token2);    
    let token3= localStorage.getItem('_remark');
    this.remark = JSON.parse(token3); 
    let token4= localStorage.getItem('_pono');
    this.pono = JSON.parse(token4); 
     this.route.params
      .subscribe(
        (params: Params) => {
          this.editmode = params['mode'];    
           if (this.editmode=="NEW"){
              this.title="NEW SALES ORDER";
          }else {
              let token= localStorage.getItem('_sono');
              this.sono = JSON.parse(token);  
              this.title="EDIT SALES ORDER [ "+this.sono+" ]";
          }
        }
      );
  
     
    //console.log(this.remark);
    var count=0;
    for( var itm in psjons){
         let obj= psjons[count];
         count= count+1;
         //console.log(obj);
         let item = new Custitem(
                  obj.uid,obj.icode,obj.idesc,obj.custcode,obj.uom,obj.defuom,obj.image,obj.tax,
                  obj.price,obj.psize,obj.qty,obj.amt,obj.taxamt,obj.taxper,obj.deldate,obj.note);
         this.orderitems.push(item);
     
    }
    this.shipaddr = new ShipAddr(psjons2.custcode,psjons2.name,
                                 psjons2.addr1,psjons2.addr2,
                                 psjons2.addr3,psjons2.addr4,
                                 psjons2.state,psjons2.city,
                                 psjons2.postal,psjons2.country);
    this.calculateTotal();    
  }
  
  calculateTotal(){
    this.orderitems.forEach(itm => {
      this.ttltax = this.ttltax + itm.taxamt;
      this.ttlamt = this.ttlamt + itm.amt;
    });
    this.netamt = this.ttlamt+ this.ttltax;    
  }

  onBack(){
    console.log('On confirm back '+this.editmode);
     if (this.sucessSubmit==true){
        if (this.editmode=='NEW')
           this.router.navigate(["main"]);        
        else this.router.navigate(["sohis"]);
     }else this.router.navigate(["order/"+this.editmode]);
  }
  
  onConfirm(){
    var today = new Date();
     if (this.editmode=="EDIT"){
        let token= localStorage.getItem('_sono');
        this.sono = JSON.parse(token);        
    } 
    this.salesorder = new SalesOrder();
    this.salesorder.items= this.orderitems;
    this.salesorder.shipaddr = this.shipaddr;
    this.salesorder.remark=this.remark;
    this.salesorder.custcode =  this.auth.getUserID();
    this.salesorder.agent =this.salesorder.custcode;
    this.salesorder.custname = this.shipaddr.name;
    this.salesorder.pono =this.pono;
    this.salesorder.mode="NEW";
    this.salesorder.salesOrderNo=this.sono;    
    this.salesorder.date=  today.getFullYear() + "-" +
                            (today.getMonth() + 1) + "-" +
                            today.getDate();
    var line=1;
    var soitems:CustSOItem[]=[];
    this.orderitems.forEach(itm => {
       let soitem = new CustSOItem();
       soitem.amt= itm.amt;
       soitem.deldate = itm.deldate;
       soitem.icode= itm.icode;
       soitem.idesc= itm.idesc;
       soitem.inclusice = false;
       soitem.line =line;
       soitem.note = itm.note;
       soitem.price = itm.price;
       soitem.qty = itm.qty;
       soitem.taxamt = itm.taxamt;
       soitem.taxgrp = itm.tax;
       soitem.uom = itm.uom;
       soitem.sono = this.sono;
       soitems.push(soitem);
    });
    this.salesorder.soitems = soitems;    
    this.postSalesOrder();
  }
  
  postSalesOrder() {
      let body:string = JSON.stringify(this.salesorder);      
      if (body==""){
        return;
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.auth.getAuthToken());  
      let orderurl:string;
      if (this.editmode=='NEW')
         orderurl = 'api/SalesOrder/order';
      else  orderurl = 'api/SalesOrder/updorder';   
      this.http.post(this.apiUrl+orderurl,
                    body,{ headers: headers })
        .subscribe(
        (resp)=>{
            let data =resp.json();            
            if (data.sono!=''){
                this.message ="Sales Order submited. Reference No: "+data.sono;
                this.resetData();
                this.sucessSubmit=true;
            }else this.message = data.error;
        },
        (err)=>{
          this.message ="Fail to submit Sales Order."+err
        },
      )   
  }  
  
  resetData(){
      localStorage.removeItem('_order');
      localStorage.removeItem('_shipaddr');
      localStorage.removeItem('_remark'); 
      localStorage.removeItem('_pono'); 
      this.salesorder=null;
      this.orderitems=[];
      this.shipaddr.addr1="";
      this.shipaddr.addr2="";
      this.shipaddr.addr3="";
      this.shipaddr.addr4="";
      this.shipaddr.name="";
      this.shipaddr.city="";
      this.shipaddr.state="";
      this.shipaddr.postal="";
      this.ttltax=0;
      this.netamt=0;
      this.ttlamt=0;
      this.remark="";
      this.pono="";
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
    return true;
  };
}
