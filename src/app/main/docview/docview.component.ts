import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docview',
  templateUrl: './docview.component.html',
  styleUrls: ['./docview.component.scss']
})
export class DocviewComponent implements OnInit {

  urlInput = '';
  viewEmbed = false;
  info = 'ZkZleHhmN3IxYnpFZld1M0hLd2Y=';

  constructor() { }

  ngOnInit(): void {
  }

  processUrl(frameRef: any) {
    if (this.viewEmbed) {
      this.viewEmbed = false;
    }
    else {
      // orig https://www.scribd.com/document/358552495/Teknik-Informatika
      let docIdIdx = -1;
      const docSplit = this.urlInput.split('/');
      const docId = docSplit.filter((x, i) => {
        // docIdIdx = i;
        if (x && !isNaN(Number(x))) {
          docIdIdx = i;
          return true;
        }
        return false;
       }
      )[0];
      
      console.log('isId?', docId);
      console.log('isIndex?', docIdIdx);

       if (docSplit.length > 1 && docIdIdx !== -1) {
        if (docSplit[docIdIdx-1].indexOf('doc') == -1) {
          alert('Sorry, currently documents supported');
        }
       }

      const target = `https://www.scribd.com/embeds/95168102/content?start_page1&view_mode=scroll&access_key=kkey=${atob(this.info)}`
      frameRef.src = target;
      this.viewEmbed = true;
    }
  }

}
