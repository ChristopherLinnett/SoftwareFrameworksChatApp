import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  URL = 'http://10.20.61.150:80/'
  constructor(private httpClient: HttpClient) {}

  getURL(){
    return this.URL
  }

  login(username: string, password: string){
    return this.httpClient.post<any>(`${this.URL}auth`, 
    {username: username, password: password})
  }

  getGroups() {
    return this.httpClient.get<any>(`${this.URL}admin/getgroups`);
  }
  addOrDeleteRoom(name, groupid, roomid, add, creator=null) {
    return this.httpClient.post<any>(
      `${this.URL}admin/newordeleteroom`,
      {
        roomname: name,
        groupid: groupid,
        roomid: roomid,
        add: add,
      }
    );
  }

  addOrDeleteGroup(name: string, id: string, add: boolean) {
    return this.httpClient.post<any>(
      `${this.URL}admin/newordeletegroup`,
      {
        groupName: name,
        id: id,
        add: add,
      }
    );
  }
  addOrDeleteGroupAssistant(userid, groupid, add) {
    return this.httpClient.post<any>(
      `${this.URL}admin/createordeleteassist`,
      {
        userid: userid,
        groupid: groupid,
        add: add,
      }
    );
  }

  addOrRemoveGroupUser(username, groupid, add) {
    return this.httpClient.post<any>(
      `${this.URL}admin/inviteremoveuser`,
      {
        username: username,
        id: groupid,
        add: add,
      }
    );
  }

  addOrDeleteRoomUser(username, userid, groupid, roomid, add) {
    return this.httpClient.post<any>(
      `${this.URL}admin/inviteremoveroomuser`,
      {
        username: username,
        userid: userid,
        groupid: groupid,
        roomid: roomid,
        add: add,
      }
    );
  }

  updateUserRole(username, oldRole, newRole, userid) {
    return this.httpClient.post<any>(
      `${this.URL}admin/updaterole`,
      {
        username: username,
        oldRole: oldRole,
        newRole: newRole,
        userId: userid,
      }
    );
  }
  verifyUser(user) {
    return this.httpClient.post<any>(
      `${this.URL}admin/usercheck`,
      {
        username: user,
      }
    );
  }
  addOrDeleteUser(user, add) {
    if (add) {
      return this.httpClient.post<any>(
        `${this.URL}admin/newuser`,
        user
      );
    }
    return this.httpClient.post<any>(
      `${this.URL}admin/deleteuser`,
      {
        user: user,
      }
    );
  }
}
