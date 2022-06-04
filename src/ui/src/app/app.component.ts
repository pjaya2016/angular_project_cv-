import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  items: MenuItem[] = [];
  activeItem!: MenuItem;
  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
      { label: 'Project 1', routerLink: ['multiplayer'] },
    ];
    this.activeItem = this.items[0];

    this.primengConfig.ripple = true;
  }

}
