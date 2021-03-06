import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';
import { Injectable, ViewChild } from "@angular/core";
// import { Router } from "@angular/router";
// import { StorageService } from '../services/Storage_Service';
import { PartyService } from "../../Services/PartyService/PartyService";
import { LoginService } from "../../Services/login/login.service";
import { ActivatedRoute, Router } from "../../../node_modules/@angular/router";
import { EventsService } from "../../../node_modules/angular4-events";
// import { RegisterService } from "../services/app-data.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    //@ViewChild(Nav) navCtrl: Nav;
    // constructor(private registerService: RegisterService, private storageService:StorageService,private event: Events,private router: Router, private localstorageService:StorageService) { 


    // }
    // constructor(private partyService: PartyService,private event: Events,public navCtrl: NavController) { 
    constructor(private route: ActivatedRoute,
            private router: Router,private loginService: LoginService,private event: EventsService) { 

    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       // console.log(req);
        if (req.headers.get('No-Auth') == "True"){
            return next.handle(req.clone());
        }
        
            if(req.url.indexOf("/token")>0){
            var headersforTokenAPI= new HttpHeaders({'Content-Type': 'application/x-www-urlencoded'})
            return next.handle(req);
        }
        
        // if(req.method=="POST"){

        // }
        // if(req.method=="GET"){
            
        // }


        if (this.loginService.Token != null) {  
        const clonedreq = req.clone({
                // headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('userToken'))
                headers: req.headers.set("Authorization", "Bearer " + this.loginService.Token)

            });
            return next.handle(clonedreq)
                .do(
                succ => { },
                err => {
                    if (err.status === 401)
                    //this.router.navigateByUrl('/login');
                    // this.navCtrl.push(LoginPage);  
                    this.event.publish('UNAUTHORIZED');           
                    }
                );
        }
        else if(this.loginService.Token== null){
            
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer ")
            });
            return next.handle(clonedreq)
                .do(
                succ => { },
                err => {
                    if (err.status === 401)
                    //this.router.navigateByUrl('/login');
                    // this.navCtrl.push(LoginPage);  
                    this.event.publish('UNAUTHORIZED');           
                    }
                );
        } 
        else {
            //this.router.navigateByUrl('/login');
             //this.navCtrl.push(LoginPage); 
             this.router.navigate(['login']);
        }
    }
}