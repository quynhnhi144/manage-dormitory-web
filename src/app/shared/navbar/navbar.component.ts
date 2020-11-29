import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { UserAuth } from '../../auth/user-auth.model';
import { User } from '../../modules/users/user.model';
import { UserService } from '../../modules/users/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'navbar-cmp',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig],
})
export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  subscription: Subscription;
  loginedUser: UserAuth;
  userAuth = new BehaviorSubject<User>(null);

  constructor(
    config: NgbDropdownConfig,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.subscription = this.authService.userAuth.subscribe((user) => {
      this.loginedUser = user;
    });
  }

  onGetProfile() {
    this.subscription = this.userService
      .getProfile(this.loginedUser.username)
      .subscribe((user: any) => {
        this.userAuth.next(user);
        this.router.navigate(['users', user.username], {
          relativeTo: this.route,
        });
      });
  }

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if (
      !body.classList.contains('sidebar-toggle-display') &&
      !body.classList.contains('sidebar-absolute')
    ) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if (this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if (this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  // toggle right sidebar
  toggleRightSidebar() {
    document.querySelector('#right-sidebar').classList.toggle('open');
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
