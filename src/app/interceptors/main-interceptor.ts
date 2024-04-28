import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable()

export class MainInterceptor implements HttpInterceptor{
    constructor(private router:Router,
        private authService:AuthService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        let request: HttpRequest<any> = req; 

        if (token) {
            if (req.body instanceof FormData) {
                request = req.clone({
                    setHeaders: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                request = req.clone({
                    setHeaders: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } else if (!(req.body instanceof FormData)) {
            request = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json'
                }
            });
        }
      
        return next.handle(request).pipe(
            catchError(res => {
                if (res.status === 401 && this.router.url !== '/login') {
                    this.router.navigate(['/login']);
                    return throwError(() => new Error('Unauthorized'));
                } else {
                    alert(res.error);
                    console.error(res.error); 
                    return throwError(() => new Error(res.error));
                }
            })
        );
    }
}