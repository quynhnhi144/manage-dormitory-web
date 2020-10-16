import { Component } from '@angular/core';

// //Metadata
// export interface RouteInfo {
//   path: string;
//   title: string;
//   type: string;
//   collapse?: string;
//   icontype: string;
//   // icon: string;
//   children?: ChildrenItems[];
// }

// export interface ChildrenItems {
//   path: string;
//   title: string;
//   ab: string;
//   type?: string;
// }

// //Menu Items
// export const ROUTES: RouteInfo[] = [
//   // dashboard
//   {
//     path: '/dashboard',
//     title: 'Overview',
//     type: 'link',
//     icontype: 'fa fa-pie-chart',
//   },
//   {
//     path: '/checkins',
//     title: 'Check-Ins',
//     type: 'link',
//     icontype: 'fa fa-users',
//   },
//   {
//     path: '/manage',
//     title: 'Manage Application',
//     type: 'link',
//     icontype: 'fa fa-cog',
//   },
//   {
//     path: '/notifications',
//     title: 'Manage Notification',
//     type: 'link',
//     icontype: 'fa fa-exclamation-triangle',
//   },
//   {
//     path: '/users',
//     title: 'Manage Users',
//     type: 'link',
//     icontype: 'fa fa-user',
//   },
//   {
//     path: '/admins',
//     title: 'Admins',
//     type: 'link',
//     icontype: 'fa fa-address-card-o',
//   },
//   // {
//   //   path: '/permissions',
//   //   title: 'Admins',
//   //   type: 'link',
//   //   icontype: 'fa fa-address-card-o',
//   // },
// ];

@Component({
  selector: 'sidebar-cmp',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  public uiBasicCollapsed = false;
  public samplePagesCollapsed = false;

  constructor() {}

  ngOnInit() {
    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }
}
