import { ShipAddr } from 'app/entities/shipp-addr';
import { Custitem } from "app/entities/cust-item";
import { CustSOItem } from "app/entities/so-items";

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
  public soitems:CustSOItem[];
  public shipaddr: ShipAddr;
  constructor() {
  }
}