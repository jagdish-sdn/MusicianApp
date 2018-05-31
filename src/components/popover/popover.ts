import { Component } from '@angular/core';
import { PopoverController, ViewController, Events } from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  constructor(
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public events: Events
  ) {
  }

  close(){
    this.events.publish("reportToSpam");
    this.viewCtrl.dismiss();
  }
}
