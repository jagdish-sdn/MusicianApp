import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  chatWith : any = {};
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.chatWith = this.navParams.data.user;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
