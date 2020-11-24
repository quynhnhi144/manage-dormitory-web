import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'sidebar-cmp',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  public uiBasicCollapsed = false;
  public samplePagesCollapsed = false;
  userSub: Subscription;
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.userAuth.subscribe((user) => {
      console.log(user);
      if (
        user &&
        user.authorities.length == 1 &&
        user.authorities.includes('ROLE_USER')
      ) {
        this.isAuthenticated = !user;
      } else if (
        user &&
        user.authorities.length == 2 &&
        user.authorities.includes('ROLE_ADMIN')
      ) {
        this.isAuthenticated = !!user;
      }
    });
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
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userSub.unsubscribe();
  }
}
