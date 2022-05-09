import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { PaymentCreateComponent } from './payment-create/payment-create.component';
import { PaymentListComponent } from './payment-list/payment-list.component';

@NgModule({
  declarations: [PaymentCreateComponent, PaymentListComponent],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    AngularMaterialModule,
    NgbModule,
    RouterModule,
  ],
})
export class PaymentsModule {}
