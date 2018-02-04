import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BetCreateFormPage } from './bet-create-form';

@NgModule({
  declarations: [
    BetCreateFormPage,
  ],
  imports: [
    IonicPageModule.forChild(BetCreateFormPage),
  ],
})
export class BetCreateFormPageModule {}
