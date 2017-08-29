import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BetFormPage } from './bet-form';

@NgModule({
  declarations: [
    BetFormPage,
  ],
  imports: [
    IonicPageModule.forChild(BetFormPage),
  ],
})
export class BetFormPageModule {}
