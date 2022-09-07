import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
})
export class SelectionPage implements OnInit {
  groups: any[];
  userPath;
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  navigateaway(){
    console.log('testing')
    this.router.navigate(['tabs/tabs/chat']);
  }

  async ngOnInit() {
    this.checkUser();
  }

  checkRole(){
    return this.authService.getRole()
  }

  checkUser(){
    this.userPath = JSON.parse(localStorage.getItem('savedUser')).access.groups
  }
    
  
}
