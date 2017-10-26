export class Custitem {
    constructor(
        public uid: number,
        public icode: string,
        public idesc: string,
        public custcode: string,
        public uom: string,
        public defuom: string,
        public image: string,
        public tax: string,
        public price: number,
        public psize: number,
        public qty: number,
        public amt: number,
        public taxamt: number,
        public taxper: number,
        public deldate: Date,
        public note: string
    ) { }
}
export class CustomerProfile {
    public code: string;
    public name: string;
    public addr1: string;
    public addr2: string;
    public addr3: string;
    public addr4: string;
    public state: string;
    public city: string;
    public postal: string;
    public country: string;
    public tel: string;
    public fax: string;
    public email: string;
    public website: string;
    public contact: string;
    public contacttel: string;
    public contactfax: string;
    public contactemail: string;
}
export class ShipAddr {
    constructor(
        public custcode: string,
        public name: string,
        public addr1: string,
        public addr2: string,
        public addr3: string,
        public addr4: string,
        public state: string,
        public city: string,
        public postal: string,
        public country: string
    ) { }
}
export class CustSOItem {
    public sono: string;
    public line: number;
    public icode: string;
    public idesc: string;
    public qty: number;
    public uom: string;
    public price: number;
    public psize: number;
    public amt: number;
    public taxamt: number;
    public taxgrp: string;
    public inclusice: boolean;
    public deldate: Date;
    public note: string;
    constructor() { }
}
export class SalesOrder {
    public salesOrderNo: string;
    public date: string;
    public mode: string;
    public custcode: string;
    public custname: string;
    public pono: string;
    public agent: string;
    public remark: string;
    public items: Custitem[];
    public soitems: CustSOItem[];
    public shipaddr: ShipAddr;
    constructor() {
    }
}
export class CustSOHeader {
    public sodate: Date;
    public status: string;
    public sono: string;
    public custpono: string;
    public custcode: string;
    public custname: string;
    public agent: string;
    public shipname: string;
    public addr1: string;
    public addr2: string;
    public addr3: string;
    public addr4: string;
    public state: string;
    public city: string;
    public postal: string;
    public country: string;
    public remark: string;
    public pono: string;
    public amt: number;
    public taxamt: number;
    constructor() { }
}

