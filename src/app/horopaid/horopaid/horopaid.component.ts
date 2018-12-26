import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { LoginService } from '../../../Services/login/login.service';
import { HoroScopeService, ServiceInfo, ServiceInformation } from '../../../Services/HoroScopeService/HoroScopeService';
import { HoroRequest } from '../../../Models/HoroScope/HoroRequest';
import { Location } from "@angular/common";
import { IgxListComponent } from 'igniteui-angular';


@Component({
    selector: 'app-horopaid',
    templateUrl: './horopaid.component.html',
    styleUrls: ['./horopaid.component.scss']
})
export class HoropaidComponent implements OnInit {

    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
    @Input()
    service: ServiceInfo;
    serviceInfo: ServiceInfo[];
    serviceInformation: ServiceInformation[];
    horoInfo: any;
    horoRequest: HoroRequest;
    checkBoxValue: boolean = false;
    FH_PDFSelected: boolean = false;
    FH_HardcopySelected: boolean = false;
    MH_PDFSelected: boolean = false;
    MH_HardcopySelected: boolean = false;
    PH_PDFSelected: boolean = false;
    PH_HardcopySelected: boolean = false;
    FH_price: number = 0;
    MH_price: number = 0;
    PH_price: number = 0;
    totalprice: number = 0;
    requireDeliveryAddress: boolean;
    PartyMastId: any;
    serviceHardCopy: ServiceInfo[];
    @ViewChildren('singleitem') Input: IgxListComponent;
    SoftCopyDifference: number;
    HardCopyDifference: number;
    itemAmount: number;
    constructor(private _location: Location, private route: ActivatedRoute, private router: Router,
        private loginService: LoginService, public horoScopeService: HoroScopeService) {

        // this.SoftCopyDifference = this.service.MRP - this.service.Amount;
        // this.HardCopyDifference = this.service.PrintMRP - this.service.PrintAmount;
        this.serviceInformation = [{ ItMastId: '', Name: 'Horo', MRP: 33, Amount: 44, Description: '', PrintMRP: 6, PrintAmount: 5 }]
    }
    // ngAfterViewInit() {
    //     this.SoftCopyDifference = this.service.MRP - this.service.Amount;
    //     this.HardCopyDifference = this.service.PrintMRP - this.service.PrintAmount;
    // }
    ngOnInit(): void {
        this.SoftCopyDifference = this.service.MRP - this.service.Amount;
        this.HardCopyDifference = this.service.PrintMRP - this.service.PrintAmount;
    }
    backClicked() {
        this._location.back();
    }
    // hardcopyRequired_Click(id) {
    //     if(this.checkBoxValue== false){
    //         this.checkBoxValue= true;
    //     }
    //     else{
    //         this.checkBoxValue= false;
    //     }
    //     var hardCopyPriceRequest={
    //         IsHardCopy:this.checkBoxValue,
    //         ItMastId: id,
    //         PartyMastId:this.PartyMastId,
    //         CountryCode:"IN"
    //     }
    //     let updateItem = this.serviceInfo.find(function (obj) { return obj.ItMastId === id });
    //     let index = this.serviceInfo.indexOf(updateItem);
    //     this.serviceInfo[index].IsHardCopy=this.checkBoxValue;
    // }
    hardcopyRequired_Click(event) {
        if (this.checkBoxValue == false) {
            this.checkBoxValue = true;
        }
        else {
            this.checkBoxValue = false;
        }
    }
    onSamplePDF(item) {
        var HoroSample = {
            ItMastId: item.ItMastId,
            LangCode: this.horoScopeService.horoRequest.LangCode
        }
        this.horoScopeService.GetSample(HoroSample).subscribe((data: any) => {
            var newBlob = new Blob([data], { type: "application/pdf" });
            const fileName: string = 'PDFSample.pdf';
            const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
            var url = window.URL.createObjectURL(newBlob);
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // this.horoScopeService.ProcessOrder().subscribe((data: any) => {
        //     var newBlob = new Blob([data], { type: "application/pdf" });
        //     const fileName: string = 'PDFSample.pdf';
        //     const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        //     var url = window.URL.createObjectURL(newBlob);
        //     a.href = url;
        //     a.download = fileName;
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a);
        //     URL.revokeObjectURL(url);
        // });
    }


    onNext(item) {
        // this.horoScopeService.itemOrdered = this.serviceInfo.find(function (obj) { return obj.ItMastId === item.ItMastId; });
        this.horoScopeService.itemOrdered = item;
        this.horoScopeService.horoRequest.ReportType=item.ItMastId;
        if (this.checkBoxValue == false) {
            this.itemAmount = item.Amount;
            this.requireDeliveryAddress = false;
            this.horoScopeService.IsDeliverable=false;
        }
        else {
            this.itemAmount = item.PrintAmount;
            this.requireDeliveryAddress = true;
            this.horoScopeService.IsDeliverable=true;
        }
        var orderModel = {
            IsDeliverable:this.checkBoxValue,
            FreeAmount: 0,
            ItemAmount: this.itemAmount,
            PartyMastId: this.loginService.PartyMastId,
            JSONData: this.horoScopeService.horoRequest,
            //JSONData: { Name: "Shamanth", Father: "Rajesh", Mother: "Leelavathi", Gothra: "Vasista", Date: "2018-12-21", EW: "W", Gender: "F", LatDeg: 17, LatMt: 24, LongDeg: 78, LongMt: 25, NS: "N", PN: "+", Time: "18:47:00", TimeFormat: "STANDARD", ZH: 5, ZM: 30 },
            //ItActId: "#SH",
            ItActId: this.horoScopeService.ItActId,
            ItMastId: '#HFH'
        }
        var DeliveryAddressRequired: boolean = this.requireDeliveryAddress;
        this.horoScopeService.CreateOrder(orderModel, (data) => {
            this.horoScopeService.OrderId=data;
            var FreePDF = {
                OrderId: this.horoScopeService.OrderId.toString()
            }
            // this.horoScopeService.ProcessOrder(FreePDF).subscribe((data: any) => {
            //     var newBlob = new Blob([data], { type: "application/pdf" });
            //     const fileName: string = 'FullHoroscope.pdf';
            //     const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
            //     var url = window.URL.createObjectURL(newBlob);
            //     a.href = url;
            //     a.download = fileName;
            //     document.body.appendChild(a);
            //     a.click();
            //     document.body.removeChild(a);
            //     URL.revokeObjectURL(url);
            // });
            // this.horoScopeService.TestById(this.horoScopeService.OrderId.toString()).subscribe((data: any) => {
            //     var newBlob = new Blob([data], { type: "application/pdf" });
            //         const fileName: string = 'FullHoroscope.pdf';
            //         const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
            //         var url = window.URL.createObjectURL(newBlob);
            //         a.href = url;
            //         a.download = fileName;
            //         document.body.appendChild(a);
            //         a.click();
            //         document.body.removeChild(a);
            //         URL.revokeObjectURL(url);
            // });
            // this.horoScopeService.ProcessOrder(FreePDF, (data) => {
            //     var newBlob = new Blob([data], { type: "application/pdf" });
            //     const fileName: string = 'FullHoroscope.pdf';
            //     const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
            //     var url = window.URL.createObjectURL(newBlob);
            //     a.href = url;
            //     a.download = fileName;
            //     document.body.appendChild(a);
            //     a.click();
            //     document.body.removeChild(a);
            //     URL.revokeObjectURL(url);
            // });
            this.router.navigate(["/services/deliveryAddress", { 'DeliveryAddressRequired': DeliveryAddressRequired }]);
        });
    }


}

