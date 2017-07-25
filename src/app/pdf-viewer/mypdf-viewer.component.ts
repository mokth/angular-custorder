import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Http, Headers, ResponseContentType } from "@angular/http";
import { Router } from "@angular/router";
import { AuthserviceService } from "app/authservice.service";
import { WindowRef } from "app/shared/window-ref";


@Component({
  selector: 'myapp-pdf-viewer',
  templateUrl: './mypdf-viewer.component.html',
  styleUrls: ['./mypdf-viewer.component.css']
})
export class MyPdfViewerComponent implements OnInit {
  pdfSrc: string = '/assets/sss.pdf';
  page: number = 1;
  constructor(private auth:AuthserviceService,
              private http:Http,
              private router:Router,   
              private winRef: WindowRef,           
              @Inject('API_URL') private apiUrl:string) { }


  ngOnInit() {
    this.showFile();
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
