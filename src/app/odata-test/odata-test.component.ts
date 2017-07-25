import { Component, OnInit } from '@angular/core';
import 'devextreme/data/odata/store';

@Component({
  selector: 'app-odata-test',
  templateUrl: './odata-test.component.html',
  styleUrls: ['./odata-test.component.css']
})
export class OdataTestComponent implements OnInit {
  dataSource:any;
  store:any;
  constructor() { }

  ngOnInit() {
   
    this.dataSource = {
            store: {
                type: 'odata',
                url: 'http://localhost:23645/api/vgridIvMa',
                version:4
            }
        }

  }
  

}
