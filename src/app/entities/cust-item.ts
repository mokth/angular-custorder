export class Custitem {
  constructor(
        public uid :number,
        public icode :string,
        public idesc :string,
        public custcode :string,
        public uom :string,
        public defuom :string,
        public image :string,
        public tax :string,
        public price :number,
        public psize :number,
        public qty :number,
        public amt :number,
        public taxamt :number,
        public taxper :number,
        public deldate:Date,
        public note :string
  ) {  }
}