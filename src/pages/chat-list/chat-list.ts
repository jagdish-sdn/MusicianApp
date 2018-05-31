import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from '../../providers/common/common'
import * as firebase from 'firebase';
import { collections } from "../../config/env-example";

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _DB: DatabaseProvider,
    public common: CommonProvider
  ) {
  }

  ionViewDidLoad() {
    
  }

}
