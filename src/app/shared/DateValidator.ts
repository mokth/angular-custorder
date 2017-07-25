

import {  FormControl } from "@angular/forms";

export class DateValidators {

    static isValidDate(control: FormControl) {
        if (control.value==null)
        return null;
        var datestr:string = control.value;
        console.log(datestr);
        var datearr = datestr.split('-');
        //dd-mm-yyyy        
        let day:number= parseInt(datearr[2]);
        let mm:number = parseInt(datearr[1])-1;
        let yy:number= parseInt(datearr[0]);
        var date =new Date(yy,mm,day,0,0,0,0);
        if (date.getFullYear() < 2015){
            console.log('invalid date');
           return {"isDateValid":false};
        }
    }
}