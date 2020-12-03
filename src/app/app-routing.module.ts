import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomePageComponent } from './layout/home-page/home-page.component';

const appRoutes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: '',
    component: HomePageComponent,
    children: [
      { path: '', redirectTo: '/news', pathMatch: 'full' },
      {
        path: 'news',
        loadChildren: () =>
          import('./news/new.module').then((m) => m.NewsModule),
      },

      {
        path: 'notification',
        loadChildren: () =>
          import('./notification/notification.module').then(
            (m) => m.NotificationModule
          ),
      },

      {
        path: 'find-room',
        loadChildren: () =>
          import('./find-room/find-room.module').then((m) => m.FindRoomModule),
      },

      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: 'manage',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashBoardModule
          ),
      },
      {
        path: 'rooms',
        loadChildren: () =>
          import('./modules/rooms/rooms.module').then((m) => m.RoomsModule),
      },
      {
        path: 'students',
        loadChildren: () =>
          import('./modules/students/students.module').then(
            (m) => m.StudentsModule
          ),
      },
      {
        path: 'power-bills',
        loadChildren: () =>
          import('./modules/power-bills/power-bills.module').then(
            (m) => m.PowerBillsModule
          ),
      },
      {
        path: 'vehicles',
        loadChildren: () =>
          import('./modules/vehicles/vehicles.module').then(
            (m) => m.VehiclesModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'remaining-rooms',
        loadChildren: () =>
          import('./modules/remaining-rooms/remaining-rooms.module').then(
            (m) => m.RemainingRoomsModule
          ),
      },
      {
        path: 'price-list',
        loadChildren: () =>
          import('./modules/price-list/price-list.module').then(
            (m) => m.PriceListModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule, FormsModule],
})
export class AppRoutingModule {}
