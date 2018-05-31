import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { collections, messages } from '../../config/env-example';
import * as firebase from 'firebase';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover'

@IonicPage()
@Component({
  selector: 'page-discussion-detail',
  templateUrl: 'discussion-detail.html',
})
export class DiscussionDetailPage {
  auth             : any = firebase.auth().currentUser;  
  discussionDetail : any = {};
  userInfo         : any = {};
  comments         : any[] = [];
  id               : any = this.navParams.data.id;
  comment          : any;
  public form      : any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _FB: FormBuilder,
    public _DB: DatabaseProvider,
    private common: CommonProvider,
    public popoverCtrl: PopoverController,
    public events: Events
  ) {
    this.getDetail(this.id);
    this.form = _FB.group({
      'comment': ['', Validators.required]
    });

    this.events.subscribe("reportToSpam", () => {
      this.reportToSpam();
    })
  }

  getDetail(id: string): void{
    this.common.presentLoading();
    this._DB.getDiscussionDetail(collections.disscussion, id)
    .then((result) => {
      console.log("result ", result);
      this.discussionDetail = result;
      this.userInfo         = result.userInfo;
      this.comments         = result.comments;
      this.common.dismissLoading();
    })
    .catch((err) => {
      console.log("error")
    });
  }

  /**
   * Add comment on discussion
   * 
   * @public
   * @param {form, uid will access user email, comment timestapm}
   */
  addComment(): void{
    this.common.presentLoading();
    let currentDate = new Date();
    let comments = {
      comment : this.form.controls['comment'].value,
      uid     : this.auth.uid,
      commentDate: currentDate.getTime()
    }
    this._DB.addComment(collections.disscussion, comments, this.id)
    .then((result) => {
      let userInfo = {
        displayName: this.auth.displayName,
        photoURL: this.auth.photoURL
      }
      let cmnt = Object.assign(comments, userInfo);
      this.comments.push(cmnt);
      this.clearForm();
      this.common.dismissLoading();
    }).catch((error) => {

    })
  }

  clearForm(): void {
    this.comment = '';
  }

  /**
   * get date and month name from timestamp 
   * 
   * @public
   * @param {timestamp}
   */
  getDate(timestamp: string){
    return  this.common.getDate(timestamp);
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }

  /**
   * Report to spam the discussion
   * 
   * @public
   * @param {none}
   */
  reportToSpam(): void{
    this.common.presentLoading();
    let currentDate = new Date();
    let spam = {
      discussionId : this.discussionDetail.id,
      uid     : this.auth.email,
      commentDate: currentDate.getTime()
    }
    this._DB.addDocument(collections.spamReports, spam)
    .then((result) => {
      this.common.dismissLoading();
      this.common.showToast(messages.spamReport)
      this.clearForm();
    }).catch((error) => {

    })
  }
}
