import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";

import { AuthserviceService } from "app/authservice.service";
import { Custitem } from "app/entities/cust-item";
import { ShipAddr } from "app/entities/shipp-addr";
import { CanComponentDeactivate } from "app/canDeactivateGuard";


@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent
  rform: FormGroup;
  custitems: Custitem[] = [];
  orderitems: Custitem[] = [];
  shipaddr: ShipAddr;
  showAddr: boolean = false;
  changesSaved: boolean = false;
  remark: string = "";
  editmode: string = 'NEW';
  title: string;
  columns = [
    { dataField: 'icode', caption: 'ITEM', allowEditing: false, sortIndex: 0, sortOrder: 'asc' },
    {
      dataField: 'idesc', caption: 'DESCRIPTION', cellTemplate: 'infoTemplate',
      allowEditing: false, allowFiltering: false
    },
    {
      dataField: 'qty', caption: 'ORDER QTY', dataType: 'number', width: 120,
      editorOptions: {
        showSpinButtons: true,
        useLargeSpinButtons: false,
        min: 0, height: 60
      }, allowFiltering: false
    },
    { dataField: 'deldate', caption: 'DELIVER', dataType: 'date', format: 'dd/MM/yyyy', allowFiltering: false },
    { dataField: 'note', caption: 'NOTE', cellTemplate: 'remTemplate', editCellTemplate: 'dataCellTemplate', allowFiltering: false }

  ];
  columns2 = [
    { dataField: 'icode', caption: '', cellTemplate: 'viewTemplate', width: 40 },
    { dataField: 'icode', caption: 'ITEM', allowEditing: false, sortIndex: 0, sortOrder: 'asc' },
    { dataField: 'uom', caption: 'DESC', cellTemplate: 'infoTemplate2' },
    { dataField: 'qty', caption: 'QTY' },
    { dataField: 'taxamt', caption: 'TAX', dataType: 'number', format: 'fixedPoint', precision: 2 },
    { dataField: 'amt', caption: 'AMT', dataType: 'number', format: 'fixedPoint', precision: 2 },
    { dataField: 'deldate', caption: 'DELIVER', dataType: 'date', format: 'dd/MM/yyyy' }

  ];

  constructor(private auth: AuthserviceService,
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    @Inject('API_URL') private apiUrl: string) { }

  ngOnInit() {
    this.route.params
      .subscribe(
      (params: Params) => {
        this.editmode = params['mode'];
        console.log("New Order EditMode" + this.editmode);
        if (this.editmode == "NEW" || this.editmode == "NEWONE") {
          this.title = "NEW ORDER";
          if (this.editmode == "NEWONE") {
            this.editmode = "NEW";
            this.clearStorage();
          }
        } else this.title = "EDIT ORDER";
      }
      );

    this.rform = new FormGroup({
      name: new FormControl(null, Validators.required),
      addr1: new FormControl(null, Validators.required),
      addr2: new FormControl(null, Validators.required),
      addr3: new FormControl(null, null),
      addr4: new FormControl(null, null),
      country: new FormControl(null, null),
      city: new FormControl(null, null),
      state: new FormControl(null, null),
      postal: new FormControl(null, null),
      remark: new FormControl(null, null)
    });

    this.getCustItems();

  }

  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    e.toolbarOptions.items.unshift({
      location: 'after',
      template: 'buttSaveGroup'
    });
    toolbarItems.forEach(item => {
      console.log(item.name);
      if (item.name === 'saveButton' || item.name == 'revertButton') {
        item.visible = false;
      }
    });
  }

  loadPrevData() {
    let token = localStorage.getItem('_order');
    var psjons = JSON.parse(token);
    let token2 = localStorage.getItem('_shipaddr');
    var psjons2 = JSON.parse(token2);
    let token3 = localStorage.getItem('_remark');
    this.remark = JSON.parse(token3);
    if (this.editmode == "EDIT") {
      let token = localStorage.getItem('_sono');
      this.title = "EDIT SALES ORDER [ " + JSON.parse(token) + " ]";
    }
    var count = 0;
    for (var itm in psjons) {
      let obj = psjons[count];
      count = count + 1;
      //console.log(obj);
      let item = new Custitem(
        obj.uid, obj.icode, obj.idesc, obj.custcode, obj.uom, obj.defuom, obj.image, obj.tax,
        obj.price, obj.psize, obj.qty, obj.amt, obj.taxamt, obj.taxper, obj.deldate, obj.note);
      this.orderitems.push(item);

    }
    this.shipaddr = new ShipAddr(psjons2.custcode, psjons2.name,
      psjons2.addr1, psjons2.addr2,
      psjons2.addr3, psjons2.addr4,
      psjons2.state, psjons2.city,
      psjons2.postal, psjons2.country);

    this.orderitems.forEach(itm => {
      console.log(itm.uid);
      console.log(this.custitems.length);
      let found = this.custitems.filter(x => x.uid == itm.uid);
      console.log(found);
      if (found.length > 0) {
        found[0].qty = itm.qty;
        found[0].deldate = itm.deldate;
        found[0].note = itm.note
      }
    });
    this.displayAddr();
  }

  getCustItems() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.auth.getAuthToken());
    this.http.get(this.apiUrl + 'api/SalesOrder/custitems?id=' + this.auth.getUserID(),
      { headers: headers })
      .subscribe(
      (resp) => {
        this.custitems = resp.json();
        if (localStorage.getItem('_order') == null) {
          this.getShipAddr();
        } else this.loadPrevData();
      },
      (err) => {
        console.log(err)
      }
      );
  }

  getShipAddr() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');      // +this.auth.getUserID()
    headers.append('Authorization', this.auth.getAuthToken());
    this.http.get(this.apiUrl + 'api/cust/shipaddr?id=' + this.auth.getUserID(),
      { headers: headers })
      .subscribe(
      (resp) => {
        this.shipaddr = resp.json();
        this.displayAddr();
      },
      (err) => {
        console.log(err)
      }
      );
  }

  displayAddr() {
    this.rform.get('name').setValue(this.shipaddr.name);
    this.rform.get('addr1').setValue(this.shipaddr.addr1);
    this.rform.get('addr2').setValue(this.shipaddr.addr2);
    this.rform.get('addr3').setValue(this.shipaddr.addr3);
    this.rform.get('addr4').setValue(this.shipaddr.addr4);
    this.rform.get('country').setValue(this.shipaddr.country);
    this.rform.get('postal').setValue(this.shipaddr.postal);
    this.rform.get('city').setValue(this.shipaddr.city);
    this.rform.get('state').setValue(this.shipaddr.state);
  }

  onRowUpdated(e) {
    console.log(e.key);
    var index = this.orderitems.findIndex(x => x.uid == e.key.uid);
    if (index > -1) { //found
      this.orderitems[index].qty = e.key.qty;
      this.orderitems[index].deldate = e.key.deldate;
      this.orderitems[index].amt = e.key.qty * e.key.price;
      this.orderitems[index].taxamt = this.calculateTax(e.key);
      this.orderitems[index].note = e.key.note;
    } else {
      e.key.amt = e.key.qty * e.key.price;
      e.key.taxamt = this.calculateTax(e.key);
      this.orderitems.push(e.key);
      //console.log(this.custitems.length);
    }
  }

  AddToOrder() {
    this.dataGrid.instance.saveEditData();
  }
  CancelOrder() {
    this.dataGrid.instance.cancelEditData();
  }

  onEditorPreparing(e) {
    if (e.dataField == "note") {
      console.log(e);
      e.editorName = "dxTextArea";
      e.editorOptions.height = 30;
      e.editorOptions.width = 100;
    }
  }

  calculateTax(item: Custitem): number {
    var taxamt: number = 0;
    if (item.taxper > 0) {
      taxamt = (item.qty * item.price) * (item.taxper / 100);
    }
    return taxamt;
  }

  OnToggleAddr() {
    this.showAddr = !this.showAddr;
  }

  haveItemOrder(): boolean {
    return this.orderitems.length > 0;
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    console.log('canDeactivate');
    if (this.haveItemOrder() && !this.changesSaved) {
      return confirm('Do you want to discard this order?');
    } else {
      return true;
    }
  };


  onCancel() {
    this.clearStorage();
    if (this.editmode == "VIEW") {
      this.changesSaved = true;
    }
    if (this.editmode == "NEW")
      this.router.navigate(['/main']);
    else {
      this.router.navigate(['/sohis']);
    }
  }

  clearStorage() {
    localStorage.removeItem('_order');
    localStorage.removeItem('_shipaddr');
    localStorage.removeItem('_remark');
    localStorage.removeItem('_sono');
  }

  OnProcessNext() {
    this.shipaddr.name = this.rform.get('name').value;
    this.shipaddr.addr1 = this.rform.get('addr1').value;
    this.shipaddr.addr2 = this.rform.get('addr2').value;
    this.shipaddr.addr3 = this.rform.get('addr3').value;
    this.shipaddr.addr4 = this.rform.get('addr4').value;
    this.shipaddr.country = this.rform.get('country').value;
    this.shipaddr.postal = this.rform.get('postal').value;
    this.shipaddr.state = this.rform.get('state').value;
    this.shipaddr.city = this.rform.get('city').value;
    this.remark = this.rform.get('remark').value;
    localStorage.setItem('_order', JSON.stringify(this.orderitems));
    localStorage.setItem('_shipaddr', JSON.stringify(this.shipaddr));
    localStorage.setItem('_remark', JSON.stringify(this.remark));
    this.changesSaved = true;
    this.router.navigate(['confirm/' + this.editmode]);
    //this.router.navigate(['confirm'], {relativeTo: this.route});

  }
  onEditingStart(editmode) {
    if (this.editmode == 'VIEW') {
      editmode.cancel = true;
    }
  }

  getImageUrl(path: string) {
    return path.replace('~', 'http://www.wincom2cloud.com/erpv4');
  }

  onValueChanged(evt: any, data: any): void {
    console.log(data);
    data.setValue(evt.value);
  }

  OnButDeleteClick(uid) {
    var index = this.orderitems.findIndex(x => x.uid == uid);
    var index2 = this.custitems.findIndex(x => x.uid == uid);
    if (index > -1) {
      this.orderitems.splice(index, 1);
      if (index2 > -1) {
        this.custitems[index2].qty = 0;
        this.custitems[index2].note = '';
        this.custitems[index2].deldate = null;
      }
    }
  }
}
