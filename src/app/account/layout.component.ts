import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '@app/_services';
import { Toaster } from 'ngx-toast-notifications';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent {
    constructor(
        private router: Router,
        private accountService: AccountService,
        private toaster : Toaster 
    ) {
        // redirect to home if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(['/']);
            this.toaster.open({text: 'Login Successfully', duration: 4000, type: 'success', position : 'top-right'});
        }

    }
}