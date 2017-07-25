import { ShipAddr } from 'app/entities/shipp-addr';
import { Custitem } from "app/entities/cust-item";

export class SalesOrder {
  public salesOrderNo:string;
  public date:string; 
  public mode:string; 
  public remark:string; 
  public items:Custitem[];
  public shipaddr:ShipAddr;
  constructor() {
  }
}