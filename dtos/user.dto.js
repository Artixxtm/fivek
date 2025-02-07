module.exports = class UserDto {
    constructor(model) {
      this.id = model.id;
      this.email = model.email;
      this.isActivated = model.isActivated;
      this.name = model.name;
      this.walletAddress = model.walletAddress;
      this.isAdmin = model.isAdmin;
      this.bids = model.bids
      this.orders = model.orders
      this.refreshToken = model.refreshToken
    }
  }
  