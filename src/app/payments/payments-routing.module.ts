import { NgModule } from '@angular/core';
import { AuthGuard } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../core/admin.guard';
import { SpecialGuard } from '../core/special.guard';
import { PaymentCreateComponent } from './payment-create/payment-create.component';
import { PaymentListComponent } from './payment-list/payment-list.component';

const routes: Routes = [
  {
    path: 'create',
    component: PaymentCreateComponent,
    canActivate: [AuthGuard, SpecialGuard, AdminGuard],
  },
  {
    path: 'update/:id',
    component: PaymentCreateComponent,
    canActivate: [AuthGuard, SpecialGuard, AdminGuard],
  },
  {
    path: '',
    component: PaymentListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AdminGuard, SpecialGuard, AuthGuard],
})
export class PaymentsRoutingModule {}
