import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BetDetailPage } from './bet-detail';

@NgModule({
  declarations: [
    BetDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BetDetailPage),
  ],
})
export class BetDetailPageModule {}
