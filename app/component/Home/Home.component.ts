import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

declare var Horizon: any;

export enum FieldType {
  Header,
  Text,
  Image,
  Link
}

export class Field {
  Type: FieldType;
  Value: any;

  constructor(Type: FieldType, Value: any) {
    this.Type = Type;
    this.Value = Value;
  }
}

export class Post {
  Title: string;
  Date: Date;
  Fields: any[];

  constructor(Title: string, ...fields: Field[]) {
    this.Title = Title;
    this.Date = new Date();
    this.Fields = fields;
  }
}

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'Home.component.html',
  styleUrls: ['Home.component.css']
})
export class HomeComponent implements OnInit {

  hz = new Horizon();
  posts: Post[] = [];
  fieldType = FieldType;

  constructor() { }

  ngOnInit() {
    this.hz('posts').order('Date', 'descending').watch().subscribe(posts => this.posts = <Post[]>posts);
    this.hz('posts').store([
      new Post('How to store a cool post!',
        new Field(FieldType.Header, 'Show me the money!'),
        new Field(FieldType.Text, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto optio deserunt vel aperiam quas officia eligendi nihil dolorum quis maxime, amet aliquam, dicta provident modi blanditiis laboriosam fuga dolor adipisci est? Eos dolorum consequuntur nisi officiis. Corrupti ad fugiat aut, excepturi amet quos voluptas distinctio perferendis, commodi non, repudiandae impedit.'),
        new Field(FieldType.Header, 'Now to the meat!'),
        new Field(FieldType.Text, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil dolores error, inventore, placeat neque consectetur est at quasi, cupiditate quia vel pariatur repellat facere unde dolorum, commodi. Nisi tempora ducimus et! Totam, quis aliquid aspernatur accusantium eveniet suscipit non ipsam, quas, consequatur, dicta a cumque. Exercitationem, expedita quidem magni porro. Sint rem unde sit dolorem, quas totam esse repellat veritatis magnam delectus cupiditate nesciunt praesentium nostrum iure enim, dicta asperiores id, nam voluptatibus doloribus repudiandae.'),
        new Field(FieldType.Text, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, ad totam neque praesentium aut doloribus cupiditate vel asperiores consectetur minus officiis, laudantium pariatur, libero exercitationem quaerat, excepturi incidunt soluta explicabo!'),
        new Field(FieldType.Header, 'Thanks!'),
        new Field(FieldType.Link, {url: 'google.com', value: 'let me google that for you!'})
        // new Field(FieldType.Image, 'temp/build/img/profile.jpg'),
        // new Field(FieldType.Text, 'temp/build/img/profile.jpg')
      )]
    );
  }

  formatDate(date: Date) {
    return moment(date).format('MMMM DD, YYYY');
  }
}
