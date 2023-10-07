export class UserDTO {
    constructor(user) {
      this.email = user.email;
      this.firstName =user.firstName;
      this.lastName = user.lastName;
      this.role =user.role;
      this.cart =user.cart;
      this.status =user.status;
      this.documents =user.documents;
      this.lastConnection =user.lastConnection;
      this.id = user.id;
    }
  }
