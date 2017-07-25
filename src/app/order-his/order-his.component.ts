import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Http, Headers, ResponseContentType, RequestOptions } from "@angular/http";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";

import { AuthserviceService } from "app/authservice.service";
import { CustSOHeader } from "app/entities/so-header";
import { CustSOItem } from "app/entities/so-items";
import { Custitem } from "app/entities/cust-item";
import { ShipAddr } from "app/entities/shipp-addr";


@Component({
  selector: 'app-order-his',
  templateUrl: './order-his.component.html',
  styleUrls: ['./order-his.component.css']
})
export class OrderHisComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid:DxDataGridComponent
  soheaders:CustSOHeader[]=[];
  soitems:CustSOItem[]=[];
  custitems:Custitem[]=[];
  shipaddr:ShipAddr;
  remark:string=""; 
  sono:string;
  message:string;
  editmode:string;

  columns = [
        { dataField: 'sono',width:"90", caption: 'ACTION',cellTemplate:'viewTemplate',allowEditing: false },
        // { dataField: 'sono', caption: '',cellTemplate:'editTemplate',allowEditing: false },
        // { dataField: 'sono', caption: '',cellTemplate:'cancelTemplate',allowEditing: false },
        { dataField: 'sodate', caption: 'DATE', dataType: 'date',
              format: 'dd/MM/yyyy',allowEditing: false,sortIndex: 0, sortOrder: 'desc'  },
        { dataField: 'sono', caption: 'SO NO',allowEditing: false },
        { dataField: 'status', caption: 'STATUS',allowEditing: false },
        { dataField: 'taxamt', caption: 'TAX',dataType: 'number',format: 'fixedPoint', precision: 2 ,allowEditing: false  },
        { dataField: 'amt', caption: 'AMOUNT',dataType: 'number',format: 'fixedPoint', precision: 2,allowEditing: false   },
        { dataField: 'remark', caption:'REMARK',cellTemplate:'remarkTemplate'  }
    ];  

  constructor(private auth:AuthserviceService,
              private http:Http,
              private router:Router,              
              @Inject('API_URL') private apiUrl:string) { }


  ngOnInit() {     
    this.getSoList();
  }

  getSoList() {    
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', this.auth.getAuthToken());  
     this.http.get(this.apiUrl+'api/SalesOrder/so?id='+this.auth.getUserID(),
                 { headers: headers })
                  .subscribe(
                    (resp)=>{
                     this.soheaders =resp.json();
                    },
                    (err)=>{
                      console.log(err)
                    }
            );
   }
  
  getSoItems() {    
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', this.auth.getAuthToken()); 
     this.http.get(this.apiUrl+'api/SalesOrder/soitems?id='
                   +this.auth.getUserID()
                   +'&sono='+this.sono,
                   { headers: headers })
                  .subscribe(
                    (resp)=>{
                     this.soitems =resp.json(); 
                     this.copytoCustItems(); 
                     this.viewEditOrder();
                    },
                    (err)=>{
                      console.log(err)
                    }
            );
   }

    cancelOrder() {
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', this.auth.getAuthToken()); 
     let options = new RequestOptions({ headers: headers });
     this.http.post(this.apiUrl+'api/SalesOrder/cancelso?id='+this.sono,
                    null,options)
                  .subscribe(
                    (resp)=>{
                      let respmsg = resp.json();
                      this.message = respmsg.error;
                      if (respmsg.sono==this.sono){
                          this.updateStatus();
                      }
                    },
                    (err)=>{
                      console.log(err)
                    }
            );
   }

   OnButViewClick(sono){
      this.message=null;
      this.sono=sono;
      this.editmode="VIEW";
      this.copytoShippingInfo();
      this.getSoItems();
   }

   OnButEditClick(sono){
      this.message=null;
      this.sono=sono;
      this.editmode="EDIT";
      this.copytoShippingInfo();
      this.getSoItems();
   }

   OnButCancelClick(sono){
       this.message=null;
       this.sono=sono;
       this.editmode="CANCEL";
       if (confirm('Confirm to CANCEL this order?')){
          this.cancelOrder();
       }
       
   }
   
   updateStatus(){
     let found = this.soheaders.filter(x=>x.sono==this.sono);         
     if (found.length>0){
       found[0].status="CAMCEL";
       this.dataGrid.instance.refresh();
     }
       
   }
   copytoCustItems(){
     for(var i=0;i<this.soitems.length;i++){
        let itm:Custitem = 
             new Custitem(i+1,this.soitems[i].icode,
                         this.soitems[i].idesc,this.auth.getUserID(),this.soitems[i].uom,this.soitems[i].uom,''
                         ,this.soitems[i].taxgrp,this.soitems[i].price,this.soitems[i].psize,this.soitems[i].qty,
                         this.soitems[i].amt,this.soitems[i].taxamt,0,this.soitems[i].deldate,
                         this.soitems[i].note);
      this.custitems.push(itm);
     }     
   }

   copytoShippingInfo(){
     this.soheaders.filter(x=>x.sono==this.sono)
       .map(x=>{
         this.shipaddr= new ShipAddr(this.auth.getUserID(),x.shipname,x.addr1,
         x.addr2,x.addr3,x.addr4,x.state,x.city,x.postal,x.country);
         this.remark=x.remark;
       })

   }

   viewEditOrder(){
       localStorage.setItem('_order',JSON.stringify(this.custitems));
       localStorage.setItem('_shipaddr',JSON.stringify(this.shipaddr));
       localStorage.setItem('_remark',JSON.stringify(this.remark));
       localStorage.setItem('_sono',JSON.stringify(this.sono));
       this.router.navigate(['/order/'+this.editmode]);
   }
   
   onCancel(){
      this.clearStorage();
      this.router.navigate(['/main']);    
   }

   clearStorage(){
      localStorage.removeItem('_order');
      localStorage.removeItem('_shipaddr');
      localStorage.removeItem('_remark');
      localStorage.removeItem('_sono');      
   }

   getbuttClass(status){
     if (status=='NEW'){
       return "btn-warning";
     }else  return "btn-default";
      
   }
    getbuttClass2(status){
     if (status=='NEW'){
       return "btn-danger";
     }else  return "btn-default";
      
   }

   downloadFile(data): void {
     console.log(data);
    let blob = new Blob([data.blob()], { type: "application/pdf" });
    let url = URL.createObjectURL(blob);
    console.log(url);
    window.open(url);
     var newTab = window.open('about:blank', '_blank');
     newTab.document.write("<object width='110%' height='100%' data='" + url + "' type='application/pdf' ></object>");
  }

   showFile(): void {
    this.http
      .get(this.apiUrl+'api/SalesOrder/print',{ responseType: ResponseContentType.Blob })
      .subscribe(
        data => this.downloadFile(data),
        error => alert("Error downloading file!"),
        () => console.log("OK!")
      );
  }
}