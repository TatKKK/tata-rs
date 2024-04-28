import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError, map } from "rxjs";
import { AuthService } from "../services/auth/auth.service";


@Injectable()

export class DatesInterceptor implements HttpInterceptor{
    constructor(private authService:AuthService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
        const token = this.authService.getToken();
        let request;

        if(token !=null&&req.url.includes('Appointments/get')){
            request=req.clone({
                headers:new HttpHeaders({
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                })
            });
        } else if(token === null && req.url.includes('Appointments/get')){
            request=req.clone({
                headers:new HttpHeaders({
                    'Content-Type':'application/json',
                    // 'Authorization':`Bearer ${token}`
                })
            });
        }

        if (req.url.includes('Appointments/get')) {
            return next.handle(req).pipe(
                map(event => {
                    if (event instanceof HttpResponse) {
                        if (Array.isArray(event.body)) {
                            const transformedBody = event.body.map(appointment => {
                                if (appointment.StartTime) {
                                    appointment.StartTime = new Date(appointment.StartTime + 'Z');
                                }
                                if (appointment.EndTime) {
                                    appointment.EndTime = new Date(appointment.EndTime + 'Z');
                                }
                                return appointment;
                            });
                            return event.clone({ body: transformedBody });
                        } else {
                            return event;
                        }
                    }
                    return event;
                }),
                catchError(error => {
                    console.error('Error occurred in HTTP interceptor:', error);
                    return throwError(() => new Error(error.error.message || 'Unhandled error in HTTP interceptor'));
                })
            );
        } else {
            return next.handle(req);
        }
      
    }
    
    }
