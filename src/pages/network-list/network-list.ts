import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from '../../providers/common/common'
import * as firebase from 'firebase';
import { BuddiesPage } from '../buddies/buddies';
import { ChatPage } from '../chat/chat';

@IonicPage()
@Component({
  selector: 'page-network-list',
  templateUrl: 'network-list.html',
})
export class NetworkListPage {
  public toggled      : boolean = false;
  public requests     : any[] = [];
  public friends      : any = [];
  public showMe       : boolean = false;
  public currentUser  : any = firebase.auth().currentUser;
  public reqTempArr   : any = [];
  public frndReqDocId : string;
  public frndDocId    : string;
  public tempArr      : any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _DB: DatabaseProvider,
    public common: CommonProvider
  ) {
  }

  ionViewDidLoad() {
    this.friendRequests();
    this.friendsList();
  }

  /**
   * Retrive all friend request and friends in network
   * from retrive friendReq method
   * @public
   * @param{}
   */

  friendRequests() {
    this._DB.friendReqList(this.currentUser.uid)
      .then((result) => {
        this.frndReqDocId = result.id;
        this.requests = result.sentBy;
        this.showMe = true;
        this.requests.forEach(element => {
          this.reqTempArr.push({
            sentFrom: element.sentFrom,
            isAccepted: element.isAccepted,
            tiemstamp: element.tiemstamp
          })
        });
      })
      .catch((error) => {

      });
  }

  friendsList() {
    this._DB.friendList(this.currentUser.uid)
      .then((result) => {
        this.frndDocId = result.id;
        this.friends = result.friends;
        this.requests = Object.assign(this.requests ? this.requests : [], this.friends ? this.friends : []);
        this.tempArr = this.requests;
      })
      .catch((error) => {
      });
  }

  acceptReq(uid) {
    this._DB.acceptReq(uid, this.currentUser.uid, this.reqTempArr, this.frndReqDocId)
      .then((result) => {
        var removeIndex = this.requests.map(function (item) { return item.uid; }).indexOf(uid);
        this.requests[removeIndex].isAccepted = 2;
      })
      .catch((error) => {
        console.log("error ", error)
      })
  }

  rejectReq(uid) {
    this._DB.rejectReq(uid, this.reqTempArr, this.frndReqDocId)
      .then((result) => {
        var removeIndex = this.requests.map(function (item) { return item.uid; }).indexOf(uid);
        this.requests.splice(removeIndex, 1);
      })
      .catch((error) => {
        console.log("error ", error)
      })
  }

  goToSearchUser(): void {
    this.navCtrl.push(BuddiesPage);
  }

  search(value) {
    if (!value) {
      this.returnBlank();
    } else {
      this.requests = Object.assign([], this.tempArr).filter(
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
    this.requests = Object.assign([], this.tempArr);
  }

  onClear() {
    this.returnBlank();
  }

  toggle(): void {
    this.toggled = !this.toggled;
  }

  goToChat(item){
    console.log(item)
    if(!item.isAccepted || item.isAccepted == 2){
      this.navCtrl.push(ChatPage, {user: item})
    }    
  }

}
