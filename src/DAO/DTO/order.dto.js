
export class OrderfoundDTO {
  constructor(Orderfound) {
    console.log("dto",Orderfound)
      this.datetime = Orderfound.purchase_datetime;
      this.amount =Orderfound.amount;
      this.email = Orderfound.purchaser;


    }
  }