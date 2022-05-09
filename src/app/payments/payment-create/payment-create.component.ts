import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytesResumable,
  percentage,
  getDownloadURL,
} from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { finalize, map, Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { Payment } from 'src/app/interfaces/payment';
import { User } from 'src/app/interfaces/user';
import { SubSink } from 'subsink';
import { PaymentsService } from '../payments.service';

@Component({
  selector: 'app-payment-create',
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.scss'],
})
export class PaymentCreateComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  editMode = false;
  paymentId: string | any;
  paymentData: Payment | undefined;

  user: User | undefined;

  paymentForm: FormGroup;
  paymentImage: string | undefined;

  upiForm: FormGroup;
  upiQRCodeImage: string | undefined;

  bankForm: FormGroup;
  pageForm: FormGroup;

  paymentModeSelect: 'UPI' | 'BANK' | 'PAGE' = 'UPI';

  uploadPercentage: Observable<number> = of(0);
  uploadStarted = false;

  constructor(
    private auth: AuthService,
    private paymentsService: PaymentsService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private aStorage: Storage
  ) {
    this.subs.sink = this.auth.user.subscribe((user) => {
      this.user = user;
    });

    this.paymentForm = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        validators: [Validators.required],
      }),
      active: new FormControl(false),
      amount: new FormControl('', {
        validators: [Validators.pattern(/^\d+$/)],
      }),
      mode: new FormControl('UPI', {
        validators: [Validators.required],
      }),
    });
    this.upiForm = new FormGroup({
      upiId: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(/^[\w.-]+@[\w.-]+$/),
        ],
      }),
    });
    this.bankForm = new FormGroup({
      bankName: new FormControl('', {
        validators: [Validators.required],
      }),
      branchName: new FormControl('', {
        validators: [Validators.required],
      }),
      IFSC: new FormControl('', {
        validators: [Validators.required],
      }),
      accountNumber: new FormControl('', {
        validators: [Validators.required],
      }),
      holderName: new FormControl('', {
        validators: [Validators.required],
      }),
    });
    this.pageForm = new FormGroup({
      providerName: new FormControl('', {
        validators: [Validators.required],
      }),
      url: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
          ),
        ],
      }),
    });

    this.subs.sink = this.paymentForm
      .get('mode')
      ?.valueChanges.subscribe((mode) => {
        this.paymentModeSelect = mode;
      });
  }

  ngOnInit(): void {
    this.subs.sink = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.editMode = true;
        this.paymentId = paramMap.get('id');
        this.getPaymentData();
      }
    });
  }

  getPaymentData(): void {
    this.subs.sink = this.paymentsService
      .getPayment(this.paymentId)
      .pipe(take(1))
      .subscribe((payment) => {
        this.paymentData = payment;

        this.paymentForm.patchValue({
          title: payment.title,
          description: payment.description,
          active: payment.active,
          amount: payment?.amount,
          mode: payment.mode,
        });
        this.paymentImage = payment.image;
        this.paymentModeSelect = payment.mode;
        if (this.paymentData?.upi) {
          this.upiForm.patchValue({
            upiId: this.paymentData.upi?.upiId,
          });
          this.upiQRCodeImage = this.paymentData.upi?.qrCodeImage;
        }
        if (this.paymentData?.bank) {
          this.bankForm.patchValue({
            bankName: this.paymentData.bank?.bankName,
            branchName: this.paymentData.bank?.branchName,
            IFSC: this.paymentData.bank?.IFSC,
            accountNumber: this.paymentData.bank?.accountNumber,
            holderName: this.paymentData.bank?.holderName,
          });
        }
        if (this.paymentData?.page) {
          this.pageForm.patchValue({
            providerName: this.paymentData.page?.providerName,
            url: this.paymentData.page?.url,
          });
        }
      });
  }

  uploadPaymentImage(event: any): void {
    this.uploadStarted = true;
    const file = event.target.files[0];
    const filePath = `payments/${Date.now() + '-' + file.name}`;
    const fileRef = ref(this.aStorage, filePath);
    const task = uploadBytesResumable(fileRef, file);
    this.uploadPercentage = percentage(task).pipe(
      map((val) => val.progress),
      finalize(() => {
        this.uploadStarted = false;
        getDownloadURL(fileRef).then((url) => {
          this.paymentImage = url;
        });
      })
    );
  }

  uploadUpiImage(event: any): void {
    this.uploadStarted = true;
    const file = event.target.files[0];
    const filePath = `payments/${Date.now() + '-' + file.name}`;
    const fileRef = ref(this.aStorage, filePath);
    const task = uploadBytesResumable(fileRef, file);
    this.uploadPercentage = percentage(task).pipe(
      map((val) => val.progress),
      finalize(() => {
        this.uploadStarted = false;
        getDownloadURL(fileRef).then((url) => {
          this.upiQRCodeImage = url;
        });
      })
    );
  }

  formCheck(): boolean {
    if (this.paymentForm.invalid || !this.paymentImage) {
      return false;
    }

    if (this.paymentModeSelect === 'UPI') {
      if (this.upiForm.invalid || !this.upiQRCodeImage) {
        return false;
      }
    }

    if (this.paymentModeSelect === 'PAGE') {
      if (this.pageForm.invalid) {
        return false;
      }
    }

    if (this.paymentModeSelect === 'BANK') {
      if (this.bankForm.invalid) {
        return false;
      }
    }
    return true;
  }

  onPaymentFormSubmit(): void {
    if (!this.formCheck()) {
      return;
    }

    if (this.user?.uid) {
      if (this.editMode) {
        this.paymentsService
          .updatePayment(
            {
              title: this.paymentForm.value?.title,
              description: this.paymentForm.value?.description,
              image: this.paymentImage,
              active: this.paymentForm.value?.active,
              amount: this.paymentForm.value?.amount,
              mode: this.paymentForm.value?.mode,
              upi:
                this.paymentModeSelect === 'UPI'
                  ? {
                      upiId: this.upiForm.value?.upiId,
                      qrCodeImage: this.upiQRCodeImage,
                    }
                  : null,
              bank:
                this.paymentModeSelect === 'BANK'
                  ? {
                      bankName: this.bankForm.value?.bankName,
                      branchName: this.bankForm.value?.branchName,
                      IFSC: this.bankForm.value?.IFSC,
                      accountNumber: this.bankForm.value?.accountNumber,
                      holderName: this.bankForm.value?.holderName,
                    }
                  : null,
              page:
                this.paymentModeSelect === 'PAGE'
                  ? {
                      providerName: this.pageForm.value?.providerName,
                      url: this.pageForm.value?.url,
                    }
                  : null,
            },
            this.paymentId
          )
          .then(() => {
            this.snackbarService.open('Payment updated successfully', 'Ok', {
              duration: 2 * 1000,
            });
          })
          .catch((error) => {
            console.log(error);
            this.snackbarService.open('Payment updation failed', 'Ok', {
              duration: 2 * 1000,
            });
          })
          .finally(() => {
            this.router.navigate(['/payments']);
          });
      } else {
        this.paymentsService
          .addPayment({
            title: this.paymentForm.value?.title,
            description: this.paymentForm.value?.description,
            image: this.paymentImage ? this.paymentImage : '',
            active: this.paymentForm.value?.active,
            amount: this.paymentForm.value?.amount,
            mode: this.paymentForm.value?.mode,
            upi:
              this.paymentModeSelect === 'UPI'
                ? {
                    upiId: this.upiForm.value?.upiId,
                    qrCodeImage: this.upiQRCodeImage ? this.upiQRCodeImage : '',
                  }
                : null,
            bank:
              this.paymentModeSelect === 'BANK'
                ? {
                    bankName: this.bankForm.value?.bankName,
                    branchName: this.bankForm.value?.branchName,
                    IFSC: this.bankForm.value?.IFSC,
                    accountNumber: this.bankForm.value?.accountNumber,
                    holderName: this.bankForm.value?.holderName,
                  }
                : null,
            page:
              this.paymentModeSelect === 'PAGE'
                ? {
                    providerName: this.pageForm.value?.providerName,
                    url: this.pageForm.value?.url,
                  }
                : null,
            createdAt: new Date().toJSON(),
            createdBy: this.user?.uid,
          })
          .then(() => {
            this.snackbarService.open('Payment inserted successfully', 'Ok', {
              duration: 2 * 1000,
            });
          })
          .catch((error) => {
            console.log(error);
            this.snackbarService.open('Payment insertion failed', 'Ok', {
              duration: 2 * 1000,
            });
          })
          .finally(() => {
            this.router.navigate(['/payments']);
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
