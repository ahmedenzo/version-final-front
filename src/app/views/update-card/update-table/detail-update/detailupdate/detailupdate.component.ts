import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardHolder } from 'app/shared/models/Cardholder';
import { reverseACS, reverseCardProcessIndicator, reversePKIIndicator, reverseRenewOption, reverseSourceCode, reverseTerritoryCode, reverseUpdateCode } from 'app/views/cruds/FormHelper';
import { UpdateCardService } from 'app/views/update-card/update-card.service';

@Component({
  selector: 'app-detailupdate',
  templateUrl: './detailupdate.component.html',
  styleUrls: ['./detailupdate.component.scss']
})
export class DetailupdateComponent implements OnInit {
  customerId: number;
  cardHolder: CardHolder;
  ccNumMissingTxt:any
  cardExpiredTxt:any
  constructor(
    private route: ActivatedRoute,
    private crudService: UpdateCardService,
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.getCardHolder();
    console.log(this.getCardHolder())
  }

  getCardHolder() {
    this.crudService.getItem(this.customerId).subscribe((data: any) => {
      this.cardHolder = data;
      this.cardHolder.cardProcessIndicator = reverseCardProcessIndicator(this.cardHolder.cardProcessIndicator);
      this.cardHolder.acs = reverseACS(this.cardHolder.acs);
      this.cardHolder.updatecode = reverseUpdateCode(this.cardHolder.updatecode);
      this.cardHolder.sourcecode = reverseSourceCode(this.cardHolder.sourcecode);
      this.cardHolder.pkiindicator = reversePKIIndicator(this.cardHolder.pkiindicator);
      this.cardHolder.territorycode = reverseTerritoryCode(this.cardHolder.territorycode);
      this.cardHolder.renewOption = reverseRenewOption(this.cardHolder.renewOption);
    });
  }
}
