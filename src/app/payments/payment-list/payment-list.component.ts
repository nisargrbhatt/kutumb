import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth.service';
import { Payment } from 'src/app/interfaces/payment';
import { User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';
import { PaymentsService } from '../payments.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  user: User | any;

  payments: Payment[] | undefined;

  cols = 3;

  constructor(
    private paymentsService: PaymentsService,
    private auth: AuthService,
    private snackbarService: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
      if (
        this.user?.roles?.admin === true ||
        this.user?.roles?.special === true
      ) {
        this.getAllPayment();
      } else {
        this.getActivePayments();
      }
    });

    this.subs.sink = this.breakpointObserver
      .observe([
        Breakpoints.Handset,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
        Breakpoints.XSmall,
      ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = 1;
        }
        if (result.breakpoints[Breakpoints.Handset]) {
          this.cols = 1;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = 1;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = 2;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = 3;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = 3;
        }
      });
  }

  getActivePayments(): void {
    this.subs.sink = this.paymentsService
      .getPayments()
      .subscribe((payments) => {
        this.payments = payments;
      });
  }

  getAllPayment(): void {
    this.subs.sink = this.paymentsService.payments$.subscribe((payments) => {
      this.payments = payments;
    });
  }

  ngOnInit(): void {}

  deletePayment(paymentId?: string): void {
    if (paymentId) {
      this.paymentsService
        .deletePayment(paymentId)
        .then(() => {
          this.snackbarService.open('Payment deleted successfully', 'Ok', {
            duration: 2 * 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Payment deletion failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  toggleActive(active: boolean, paymentId?: string): void {
    if (paymentId) {
      this.paymentsService
        .toggleActivePayment(active, paymentId)
        .then(() => {
          this.snackbarService.open(
            'Payment status updated successfully',
            'Ok',
            {
              duration: 2 * 1000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.snackbarService.open('Payment status updation failed', 'Ok', {
            duration: 2 * 1000,
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
