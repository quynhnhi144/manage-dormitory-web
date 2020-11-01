import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { NgSelectModule } from '@ng-select/ng-select';

const appRoutes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: '',
    component: AdminLayoutComponent,
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
