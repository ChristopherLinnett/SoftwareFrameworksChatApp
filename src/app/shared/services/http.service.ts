import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  PORT = '80';
  IP = '192.168.238.95';
  URL = 'http://' + this.IP + `:${this.PORT}/`;

  loadingObserver: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  loadingRequestMap: Map<string, boolean> = new Map<string, boolean>();
  constructor(private httpClient: HttpClient) {}

  /**
   * It takes a roomid as a parameter and returns a post request to the server with the roomid as the
   * body.
   * </code>
   * @param roomid - the id of the room
   * @returns An observable.
   */
  getRoomMessages(roomid) {
    return this.httpClient.post(this.URL + 'roomMessage', { roomid });
  }
  /**
   * It takes an image, and sends it to the server
   * @param img - is the image file
   * @returns The response from the server.
   */
  uploadImage(img) {
    return this.httpClient.post(this.URL + 'profile/updatephoto', img);
  }
  /**
   * It returns the URL of the current page.
   * @returns The URL property of the object.
   */
  getURL() {
    return this.URL;
  }
  /**
   * If the loading parameter is true, then add the url to the loadingRequestMap and emit true to the
   * loadingObserver. If the loading parameter is false and the url is in the loadingRequestMap, then
   * remove the url from the loadingRequestMap. If the loadingRequestMap is empty, then emit false to
   * the loadingObserver
   * @param {boolean} loading - boolean - true if the request is loading, false if it's done loading
   * @param {string} url - The URL of the request
   */
  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided');
    }
    if (loading === true) {
      this.loadingRequestMap.set(url, loading);
      this.loadingObserver.next(true);
    } else if (loading === false && this.loadingRequestMap.has(url)) {
      this.loadingRequestMap.delete(url);
    }
    if (this.loadingRequestMap.size === 0) {
      this.loadingObserver.next(false);
    }
  }

  /**
   * This function takes in a username and password, and returns an observable of type any.
   * @param {string} username - string, password: string
   * @param {string} password - string
   * @returns The return value is an Observable of type any.
   */
  login(username: string, password: string) {
    return this.httpClient.post<any>(`${this.URL}auth`, {
      username: username,
      password: password,
    });
  }

  /**
   * It returns an observable of type any, which is the result of an HTTP GET request to the URL
   * specified in the URL variable, with the path /admin/getgroups appended to it.
   * @returns An Observable of type any.
   */
  getGroups() {
    return this.httpClient.get<any>(`${this.URL}admin/getgroups`);
  }
  /**
   * It takes in a room name, group id, room id, add, and creator and returns a post request to the
   * server
   * @param name - the name of the room
   * @param groupid - the id of the group
   * @param roomid - the id of the room you want to delete
   * @param add - boolean
   * @param [creator=null] - the user who created the room
   * @returns The return value is a promise.
   */
  addOrDeleteRoom(name, groupid, roomid, add, creator = null) {
    return this.httpClient.post<any>(`${this.URL}admin/newordeleteroom`, {
      roomname: name,
      groupid: groupid,
      roomid: roomid,
      creator: creator,
      add: add,
    });
  }

  /**
   * It takes a group name, an id, and a boolean value, and returns a post request to the server.

   **/
  addOrDeleteGroup(name: string, id: string, add: boolean) {
    return this.httpClient.post<any>(`${this.URL}admin/newordeletegroup`, {
      groupName: name,
      id: id,
      add: add,
    });
  }

  /**
   * It takes a userid, groupid, and a boolean value and sends it to the backend.
   * @param userid - the id of the user you want to add or delete
   * @param groupid - the id of the group
   * @param add - boolean
   * @returns The response from the server.
   */
  addOrDeleteGroupAssistant(userid, groupid, add) {
    return this.httpClient.post<any>(`${this.URL}admin/createordeleteassist`, {
      userid: userid,
      groupid: groupid,
      add: add,
    });
  }

  /**
   * It takes a username, groupid, and a boolean value and sends a post request to the server.
   * @param username - username of the user to be added or removed
   * @param groupid - the id of the group
   * @param add - true or false
   * @returns {
   *     "success": true,
   *     "message": "User added to group"
   * }
   */
  addOrRemoveGroupUser(username, groupid, add) {
    return this.httpClient.post<any>(`${this.URL}admin/inviteremoveuser`, {
      username: username,
      id: groupid,
      add: add,
    });
  }

  /**
   * It takes a groupid and roomid as parameters and returns an array of users.
   * @param {string} groupid - the id of the group
   * @param {string} roomid - the id of the room
   */
  getRoomUsers(groupid: string, roomid: string) {
    return this.httpClient.post<any>(`${this.URL}admin/getroomusers`, {
      groupid: groupid,
      roomid: roomid,
    });
  }

  /**
   * It takes in a username, userid, groupid, roomid, and add (boolean) and returns a post request to
   * the server
   * @param username - username of the user to be added or deleted
   * @param userid - the user id of the user you want to add or delete
   * @param groupid - the id of the group
   * @param roomid - the id of the room
   * @param add - true or false
   * @returns The return value is a promise.
   */
  addOrDeleteRoomUser(username, userid, groupid, roomid, add) {
    return this.httpClient.post<any>(`${this.URL}admin/inviteremoveroomuser`, {
      username: username,
      userid: userid,
      groupid: groupid,
      roomid: roomid,
      add: add,
    });
  }

  /**
   * It takes in a username, oldRole, newRole, and userid and returns a post request to the backend.
   * @param username - username of the user
   * @param oldRole - the role the user currently has
   * @param newRole - string;
   * @param userid - the id of the user whose role is being updated
   * @returns The response from the server.
   */
  updateUserRole(username, oldRole, newRole, userid) {
    return this.httpClient.post<any>(`${this.URL}admin/updaterole`, {
      username: username,
      oldRole: oldRole,
      newRole: newRole,
      userId: userid,
    });
  }

  /**
   * It takes a username as a parameter and sends a post request to the server with the username as the
   * body.
   * @param user - string
   * @returns The response from the server.
   */
  verifyUser(user) {
    return this.httpClient.post<any>(`${this.URL}admin/usercheck`, {
      username: user,
    });
  }

  /**
   * If add is true, then add the user, otherwise delete the user.
   * @param user - {
   * @param add - boolean
   * @returns The return value is the observable.
   */
  addOrDeleteUser(user, add) {
    if (add) {
      return this.httpClient.post<any>(`${this.URL}admin/newuser`, user);
    }
    return this.httpClient.post<any>(`${this.URL}admin/deleteuser`, {
      user: user,
    });
  }
}
