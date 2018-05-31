import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { EditProfilePage } from '../pages/edit-profile/edit-profile'
import { NetworkListPage } from '../pages/network-list/network-list';
import { ChatListPage } from '../pages/chat-list/chat-list'

import * as firebase from 'firebase';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FCM } from '@ionic-native/fcm';
import { ENV } from '../config/env-example';
import { CommonProvider } from '../providers/common/common';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  // @ViewChild('myNav') nav
  rootPage: any;
  firstRun: boolean = true;
  profile: any = {};
  User: any = {};
  activePage: any;
  pages: Array<{ title: string, component: any, icon: any }>;  
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public events: Events,
    private photoViewer: PhotoViewer,
    private alertCtrl: AlertController,
    private fcm: FCM,
    private common: CommonProvider
  ) {
    this.pages = [
      { title: 'Discussion', component: HomePage, icon: "paper" },
      { title: 'Inbox', component: ChatListPage, icon: "mail" },
      { title: 'Network', component: NetworkListPage, icon: "people" }
    ];

    this.activePage = this.pages[0];
    
    firebase.initializeApp(ENV.firebase);
    this.events.subscribe("MusicianProfile", () => {
      this.userProfile();
    })
    if(this.User){
      this.events.publish("MusicianProfile");
    } else {}

    this.init();
    this.checkuser();
  }

  init(){
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.firstRun = false;
      this.statusBar.overlaysWebView(false);
      this.pushNotification();
      // set status bar to white
      this.statusBar.backgroundColorByHexString('#3d2c57');
    })
  }

  // ngAfterViewInit() {
    checkuser(){
      firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let DB = firebase.firestore();
        DB.collection('users').where("email", "==", user.email).get().then(function (snap) {
          if (snap.empty) {
            DB.collection('users').add({
              uid: firebase.auth().currentUser.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              userLocation: ''
            }).then(() => {
            })
          }
        })
        // User is authenticated.
        localStorage.setItem("MusicianUser", JSON.stringify(user));
        this.userProfile();
        // this.setRootPage(HomePage);
        this.nav.setRoot(HomePage)
      } else {
        // User is not authenticated.
        this.nav.setRoot(LoginPage);
      }
    });
  }

  setRootPage(page) {

    // if (this.firstRun) {

      // if its the first run we also have to hide the splash screen
      this.nav.setRoot(page)
        .then(() => this.platform.ready())
        .then(() => {

          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          this.statusBar.styleDefault();
          this.splashScreen.hide();
          this.firstRun = false;
          this.statusBar.overlaysWebView(true);
          
          // set status bar to white
          this.statusBar.backgroundColorByHexString('#3d2c57');
        });
    // } else {
    //   this.nav.setRoot(page);
    // }
  }

  userProfile() {
    this.User = localStorage.getItem("MusicianUser");
    if (this.User) {      
      this.profile = JSON.parse(this.User);
    } else {}
  }

  logOut() {
      const alert = this.alertCtrl.create({
        title: 'Logout',
        message: "Are you sure, You want to logout!",
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              localStorage.removeItem("MusicianUser");
              firebase.auth().signOut();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      alert.present();
  }

  CBINH18148117368

  editProfile() {
    this.nav.push(EditProfilePage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page){
    return page == this.activePage;
  }

  viewPhoto(url, title){
    this.photoViewer.show(url, title, {share: false});
  }

  /**
   * Get device token and notification handler
   */
  pushNotification(){
    if(this.platform.is("cordova")){
      this.fcm.subscribeToTopic('all');
      this.fcm.getToken().then(token=>{
        localStorage.setItem("device_token", token);
      })
      this.fcm.onNotification().subscribe(data=>{
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      })
      this.fcm.onTokenRefresh().subscribe(token=>{
        console.log(token);
      });
    }    
    //end notifications.
  }

  /**
   * function created for invite a friend via social share link
   * Created: 28-May-2018
   * Creator: Jagdish Thakre
   */
  share(){
    this.common.shareApp();
  }
}

