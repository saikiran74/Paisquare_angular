import { Component, OnInit } from '@angular/core';
import { PaiService } from '../../paisa.service';
import { Profile } from 'src/app/paisa';

@Component({
  selector: 'app-advertiserdashboard',
  templateUrl: './advertiserdashboard.component.html',
  styleUrls: ['./advertiserdashboard.component.css'],
})
export class AdvertiserdashboardComponent implements OnInit {
  // Dialog visibility flags
  addFundsDialogVisible: boolean = false;
  withdrawDialogVisible: boolean = false;
  sellDialogVisible: boolean = false;
  

  // Input amounts
  addAmount: number = 0;
  withdrawAmount: number = 0;

  // Sell Coins functionality
  coinCount: number = 1; // Initial coin count
  pricePerCoin: number = 0.90; // Price per coin in rupees
  totalPrice: number = this.pricePerCoin; // Total price calculation

  // User Data
  cash: any = '';
  money = '';
  pai = '';
  remainingCredits: number = 500;
  isAdvertiser: boolean = false;
  advertisement: any[] = [];
  userData = new Profile();
  sellAmount: number = 0;
  sellPrice: number = 0.9;
  customPrice: number = 0.9;
  priceOption: string = 'fixed'; // 'fixed' or 'custom'
  totalSellPrice: number = 0;

  constructor(private _service: PaiService) {}

  ngOnInit() {
    // Fetch user data
    this._service.getUserdata(this._service.userId).subscribe(
      (data) => {
        this.userData = data;
      },
      (error) => {
        console.error('Error occurred while retrieving user data!', error);
      }
    );

    // Fetch advertisements
    this._service.getUserAdvertisements(this._service.userId).subscribe(
      (data) => {
        this.advertisement = data.slice().reverse();
      },
      (error) => {
        console.error('Error occurred while retrieving advertisements!', error);
      }
    );
  }

  // Show Add Funds Dialog
  showAddFundsDialog() {
    this.addFundsDialogVisible = true;
  }

  // Show Withdraw Funds Dialog
  showWithdrawDialog() {
    this.withdrawDialogVisible = true;
  }

  // Hide Add Funds Dialog
  hideAddFundsDialog() {
    this.addFundsDialogVisible = false;
  }

  // Hide Withdraw Funds Dialog
  hideWithdrawDialog() {
    this.withdrawDialogVisible = false;
  }

  // Add Funds logic
  onAddFunds() {
    if (this.addAmount <= 0) {
      alert('Please enter a valid amount to add.');
      return;
    }

    // Backend call to add funds
    this._service.addFunds(this.userData.userId, this.addAmount).subscribe(
      (response) => {
        alert(`₹${this.addAmount} added successfully!`);
        this.userData.paisa += this.addAmount;
        this.addFundsDialogVisible = false; // Close dialog
      },
      (error) => {
        console.error('Error adding funds:', error);
        alert('Failed to add funds. Please try again.');
      }
    );
  }

  // Withdraw Funds logic
  onWithdrawFunds() {
    if (this.withdrawAmount > Number(this.userData.paisa)) {
      alert('Insufficient balance for withdrawal!');
      return;
    }

    // Backend call to withdraw funds
    this._service.withdrawFunds(this.userData.userId, this.withdrawAmount).subscribe(
      (response: any) => {
        this.userData.paisa = Number(this.userData.paisa) - this.withdrawAmount;
        alert('Withdrawal successful!');
        this.hideWithdrawDialog();
      },
      (error: any) => {
        console.error('Error withdrawing funds:', error);
      }
    );
  }

  // Show Sell Coins Dialog
  showSellDialog() {
    this.sellDialogVisible = true;
  }

  // Hide Sell Coins Dialog
  hideSellDialog() {
    this.sellDialogVisible = false;
  }

  // Increase Coin Count
  increaseCount() {
    this.coinCount++;
    this.updateTotalPrice();
  }

  // Decrease Coin Count
  decreaseCount() {
    if (this.coinCount > 1) {
      this.coinCount--;
      this.updateTotalPrice();
    }
  }

  // Update Total Price
  updateTotalPrice() {
    this.totalPrice = this.coinCount * this.pricePerCoin;
  }

  // Handle Coin Selling
  onSellCoins() {
    if (this.pricePerCoin < 0.5 || this.pricePerCoin > 0.9) {
      alert('Price must be between ₹0.5 and ₹0.9 per coin.');
      return;
    }

    // Call backend to process selling
    this._service.sellCoins(Number(this.userData.pai), this.pricePerCoin).subscribe(
      (response) => {
        alert('Coins sold successfully!');
        this.hideSellDialog();
      },
      (error) => {
        console.error('Error selling coins:', error);
        console.log(`Selling ${this.sellAmount} coins at ₹${this.sellPrice} per coin. Total: ₹${this.totalSellPrice}`);
      }
    );
  }
  onBuyCoins() {
    alert('Redirect to Buy Coins page or show dialog!');
    // Add your logic here for buying coins (e.g., open a dialog or navigate to another page)
  }
  updateSellPrice(customPrice?: number): void {
    if (this.priceOption === 'custom') {
      this.sellPrice = this.customPrice >= 0.5 && this.customPrice <= 0.9 ? this.customPrice : 0.9;
    } else {
      this.sellPrice = 0.9; // Fixed price
    }
    this.totalSellPrice = this.sellAmount * this.sellPrice;
  }
}
