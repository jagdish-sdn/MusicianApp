/** Provider file created for call API's
 * Created: 25-May-2018
 * Creator: Jagdish Thakre
*/
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpServiceProvider {

  constructor(
    public http: Http,
    public events: Events
  ) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json; charset=utf-8');
  }

  /**
   * Function created for deno notification test
   */

  sendDemoNotification() {  
  let body = {
      "notification":{
        "title":"New Notification has arrived",
        "body":"Notification Body",
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":"value1",
        "param2":"value2"
      },
        "to":"/topics/all",
        "priority":"high",
        "restricted_package_name":""
    }
    let headers = new Headers();
    headers.append('Authorization', 'key=AAAAb7ENC-w:APA91bGit76FvTMheAzZGOh3pqQu0J5WLaOlE-8xIu7yWGBAUAwacYMNKYCU92kZP6SBJbIvdhfi6wH3Vc1Mbp4zKJBUqkUD_M1QtDg1FCWZHCgHeXF_K08oWzQc1gVsdwwfels0G_3C');
    let options: any = {
      headers: headers
    };
    // let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,options)
      .subscribe();
  }
}
