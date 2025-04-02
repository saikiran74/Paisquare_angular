import { Component, OnInit } from '@angular/core';
import { PaiService } from '../../paisa.service';
import { Profile } from 'src/app/paisa';
import { HttpClient } from '@angular/common/http';
import { Payment, PaymentStatus, PaymentMethod } from '../../paisa';
@Component({
  selector: 'app-advertiserdashboard',
  templateUrl: './advertiserdashboard.component.html',
  styleUrls: ['./advertiserdashboard.component.css'],
})
export class AdvertiserdashboardComponent implements OnInit {
  // Dialog visibility flags
  
  paymentData= new Payment();
  addFundsDialogVisible: boolean = false;
  withdrawDialogVisible: boolean = false;
  sellDialogVisible: boolean = false;
  addAmount: number = 0;
  withdrawAmount: number = 0;
  payerUpiId: string = "";
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

  constructor(private _service: PaiService,private http: HttpClient) {}
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
    const urlParams = new URLSearchParams(window.location.search);
    const txnId = urlParams.get("txnId");
    const responseCode = urlParams.get("responseCode");
    const txnRef = urlParams.get("txnRef");

    if (txnId && responseCode && txnRef) {
      this.verifyPayment(txnId, responseCode, txnRef);
    }
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
  isProcessing = false;

  addFunds() {
    const addAmount = Number(this.addAmount);
    if (!this.addAmount || this.addAmount <= 0) {
      alert('Please enter a valid amount to add.'+this.addAmount);
      return;
    }

    // Disable button to prevent multiple submissions
    this.isProcessing = true;
    const upiID = "bobbilisaikiran1999@okhdfcbank"; // Replace with your UPI ID
    const payeeName = "PaiSquare";
    const amount = this.addAmount; // Amount entered by the user
    const transactionNote = "Adding Funds";
    const currency = "INR";
  
    /*const upaiUrl = `upi://pay?pa=${upiID}&pn=${payeeName}&mc=&tid=&tr=&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=${currency}`;
    const upiUrl = `upi://pay?pa=${upiID}&pn=${payeeName}&tn=Adding%20Funds&am=${amount}&cu=INR`;
     // Wait for UPI response (simulate delay as UPI does not give callbacks)
    setTimeout(() => {
      this.captureUPIResponse();
    }, 5000);
    const upiUrl = `upi://pay?pa=${this.userUpiId}&pn=${payeeName}&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=${currency}`;

    window.open(upiUrl, "_blank"); // Open in UPI App*/
    const payerUpiId = encodeURIComponent(this.payerUpiId); // ✅ Your Brother's UPI ID
    const payeeUpiId = encodeURIComponent(upiID);
    
  const paytmLink = `paytm://upi/pay?pa=${payeeUpiId}&pn=${payeeName}&am=${amount}&tn=${transactionNote}&cu=INR`;

  // Copy link to clipboard (optional)
  navigator.clipboard.writeText(paytmLink);

    alert(`Share this link with ${this.payerUpiId}. Ask them to open it in Paytm and complete the payment.`);
  }
  // Function to Extract Transaction Details from URL
  captureUPIResponse() {
    console.log("captureUPIResponse saivng")
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("txnId");
    const status = params.get("status");
    if (transactionId && status == "SUCCESS") {
      this.saveTransaction(transactionId);
    } else {
      alert("Payment Failed or Cancelled.");
    }
  }
  // Send Transaction to Backend
  saveTransaction(transactionId: string) {
    this.paymentData.transactionId=transactionId
    this.paymentData.amount= this.addAmount,
    this.paymentData.userId=this._service.userId 

    const payment: Payment = {
      userId: this._service.userId,
      orderId: "ORD-" + new Date().getTime(),
      upiId: "bobbilisaikiran1999@okhdfcbank",
      amount: this.addAmount,
      currency: "INR",
      paymentStatus: PaymentStatus.SUCCESS,
      transactionId: transactionId,
      paymentMethod: PaymentMethod.UPI,
    };
    
    this._service.addFunds(payment).subscribe(
      data=>{
        console.log(data)
        alert('Payment successful!'+data);

    },
      error=>{
        console.log("error",error)
        if (error.status === 400 && error.error === 'Payment already exists.') {
          console.warn('Duplicate payment detected:', error.error);
          alert('Payment already exists. Please check your transaction details.');
        } else {
          console.error('Error adding payment:', error);
        }
    });
    this.isProcessing = false;
  }
  verifyPayment(txnId: string, responseCode: string, txnRef: string) {
    this.http.get(`api/payments/verify?txnId=${txnId}&responseCode=${responseCode}&txnRef=${txnRef}`)
      .subscribe(response => {
        console.log("Payment Verified:", response);
        alert("Payment successful!");
      }, error => {
        console.log("Payment Verification Failed:", error);
        alert("Payment failed!");
      });
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
  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric characters
    }
  }
}
