import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string){
    return this.httpClient.post<any>('http://localhost:3000/auth', 
    {username: username, password: password})
  }

  getGroups() {
    return this.httpClient.get<any>('http://localhost:3000/admin/getgroups');
  }
  addOrDeleteRoom(name, groupid, roomid, add, creator=null) {
    return this.httpClient.post<any>(
      'http://localhost:3000/admin/newordeleteroom',
      {
        roomname: name,
        groupid: groupid,
        roomid: roomid,
        add: add,
      }
    );
  }

  addOrDeleteGroup(name, id, add) {
    return this.httpClient.post<any>(
      'http://localhost:3000/admin/newordeletegroup',
      {
        groupName: name,
        id: id,
        add: add,
      }
    );
  }
  addOrDeleteGroupAssistant(userid, groupid, add) {
    return this.httpClient.post<any>(
      'http://localhost:3000/admin/createordeleteassist',
      {
        userid: userid,
        groupid: groupid,
        add: add,
      }
    );
  }

  addOrRemoveGroupUser(username, groupid, add) {
    return this.httpClient.post<any>(
      'http://localhost:3000/admin/inviteremoveuser',
      {
        username: username,
        id: groupid,
        add: add,
      }
    );
  }

  addOrDeleteRoomUser(username, userid, groupid, roomid, add) {
    return this.httpClient.post<any>(
      'http://localhost:3000/admin/inviteremoveroomuser',
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
      'http://localhost:3000/admin/updaterole',
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
      'http://localhost:3000/admin/usercheck',
      {
        username: user,
      }
    );
  }
  addOrDeleteUser(user, add) {
    if (add) {
      return this.httpClient.post<any>(
        'http://localhost:3000/admin/newuser',
        user
      );
    }
    return this.httpClient.post<any>(
      'http://localhost:3000/admin/deleteuser',
      {
        user: user,
      }
    );
  }
}
