import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BetOverviewPage } from './bet-overview';

@NgModule({
  declarations: [
    BetOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(BetOverviewPage),
  ],
})
export class BetOverviewPageModule {}
