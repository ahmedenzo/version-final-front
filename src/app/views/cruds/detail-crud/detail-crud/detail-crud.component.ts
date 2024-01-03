import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../../crud.service';
import { CardHolder } from 'app/shared/models/Cardholder';
import { reverseUpdateCode, reverseCardProcessIndicator, reverseACS, reverseSourceCode, reversePKIIndicator, reverseTerritoryCode, reverseRenewOption } from '../../FormHelper';
import { pbf } from 'app/shared/models/pbf';
@Component({
  selector: 'app-detail-crud',
  templateUrl: './detail-crud.component.html',
  styleUrls: ['./detail-crud.component.scss']
})
export class DetailCrudComponent implements OnInit {
  customerId: number;
  cardHolder: CardHolder;
  pbf:pbf

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService,
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.getCardHolder();
   
  }

  getCardHolder() {
    this.crudService.getItem(this.customerId).subscribe((data: any) => {
      this.cardHolder = data;
     console.log(data)
   
      this.cardHolder.updatecode = reverseUpdateCode(this.cardHolder.updatecode);
    
      this.cardHolder.territorycode = reverseTerritoryCode(this.cardHolder.territorycode);
   
    });
  }
  formatAccountNumber(accountNumber: number): string {
    return accountNumber.toString().replace(/\B(?=(\d{4})+(?!\d))/g, '-');
  }
  
  
}
