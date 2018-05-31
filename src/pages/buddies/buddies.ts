import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from '../../providers/common/common'
import * as firebase from 'firebase';
import { collections } from "../../config/env-example";

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  buddies: any = [];
  tempArr: any = [];
  auth: any = firebase.auth().currentUser;
  showMe: boolean = false;
  searchText: any;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _DB: DatabaseProvider,
    public common: CommonProvider
  ) {
    // this._DB.getAllFriends(this.auth.uid).then((res)=>{
    //   console.log("friends ", res)
    // })
  }

  ionViewDidLoad() {
    this.retrieveBuddies();
  }

  /**
     * Retrieve all buddies from the users collection using the
     * getAllBuddies method of the DatabaseProvider service
     *
     * @public
     * @method retrieveBuddies
     * @return {none}
     */
  retrieveBuddies() {
    this.common.presentLoading()
    this._DB.getAllBuddies(this.auth.uid)
      .then((data) => {
        console.log(data)
        this.buddies = data;
        this.tempArr = data;
        this.showMe = true;
        this.common.dismissLoading();
      })
      .catch((err) => {
        this.showMe = true;
      });
  }

  search(value) {
    if (!value) {
      this.returnBlank();
    } else {
      this.buddies = Object.assign([], this.tempArr).filter(
        item => {
          if (item.displayName.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return true;
          } else {
            return false;
          }
        })
    }
  }

  returnBlank() {
    this.buddies = Object.assign([], this.tempArr);
  }

  onClear() {
    this.returnBlank();
  }

  sendRequest(uid){
    this._DB.sendReq(this.auth.uid, uid)
    .then((result) =>{
      var removeIndex = this.buddies.map(function(item) { return item.uid; }).indexOf(uid);
      this.buddies.splice(removeIndex, 1);      
      this.common.showToast("success",);
    })
    .catch((error) => {
      console.log(error)
    })
  }
}
