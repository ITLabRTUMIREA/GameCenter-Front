import { Component, OnInit } from '@angular/core';

// прототип получаемых данных
import { IPickedGames, ITop, ILast} from '../DataInterface';
////

// сервис для операций с данными
import {UserService} from '../user.service';
////

// уведомления
import { ToastrService } from 'ngx-toastr';
////

// связь с другими пользователями
import { HubService } from '../hub.service';
////

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  constructor(
    private _userServise: UserService, // переменная для обращения к сервису
    private toastr: ToastrService, // уведомления
    private _hubService: HubService, // связь с другими пользователями
    ) { }
    pickedGames: IPickedGames[]; // массив выбранных игр  типа интерфейса IData[]
    Top: ITop[];
    Last: ILast[];
    private loadPickedGames() {// подгружаем все игры
      this._userServise.getAllPicked().subscribe((data: IPickedGames []) => {// забираем данные из переменной в наш массив
        this.pickedGames = data; // присваиваем данные массиву игр
        // если выбранных игр больше 4 и меньше 9 , то устанавливаем двуслайдовую анимацию
        if (this.pickedGames.length > 4 && this.pickedGames.length <= 8 ) {
          document.getElementById('game_top_area').style.animation = '10s twoSlides infinite';
          document.getElementById('game_last_area').style.animation = '10s twoSlides infinite';
        }
       // если выбранных игр больше 8 и меньше 13 , то устанавливаем двуслайдовую анимацию
       if (this.pickedGames.length > 8 && this.pickedGames.length <= 12 ) {
        document.getElementById('game_top_area').style.animation = '15s threeSlides infinite';
        document.getElementById('game_last_area').style.animation = '15s threeSlides infinite';
       }
       // если выбранных игр больше 12 и меньше 17 , то устанавливаем двуслайдовую анимацию
       if (this.pickedGames.length > 12 && this.pickedGames.length <= 16 ) {
        document.getElementById('game_top_area').style.animation = '20s fourSlides infinite';
        document.getElementById('game_last_area').style.animation = '20s fourSlides infinite';
       }

    });
  }
  public loadTop() {
  //  for (let i = 0; i < this.pickedGames.length; i++) {
  //    this.pickedGames.map(g => this._userServise.loadCurrentTop(g.gameId).subscribe((data: ITop) => {
   //     this.Top.push(data);
   //   }));
  //  }
    this._userServise.getTop().subscribe((data: ITop[]) => {
      this.Top = data;
      console.log(`top in top page ${this.Top}`);
    });
  }
  public loadLast() {
    //  for (let i = 0; i < this.pickedGames.length; i++) {
    //    this.pickedGames.map(g => this._userServise.loadCurrentTop(g.gameId).subscribe((data: ITop) => {
     //     this.Top.push(data);
     //   }));
    //  }
      this._userServise.getLast().subscribe((data: ILast[]) => {
        this.Last = data;
        console.log(`top in top page ${this.Top}`);
      });
    }

  ngOnInit() {
    this.loadPickedGames(); // подгружаем все выбранные игры
    this.loadTop();
    this.loadLast();
    // SignalR || Связь с другими пользователями
    this._hubService.pickNotifier.subscribe( // подписываемся на событие выбора игры,совершенного другим пользователем
      n => this.loadPickedGames(),
      err => console.log(err),
      () => console.log('_hubService.pickNotifier complete')
    );
    this._hubService.unpickNotifier.subscribe( // подписываемся на событие удаления игры из выбранных игр,совершенного другим пользователем
      n => this.loadPickedGames(),
      err => console.log(err),
      () => console.log('_hubService.unpickNotifier complete')
    );
    this._hubService.deleteNotifier.subscribe( // подписываемся на событие удаления игры,совершенного другим пользователем
      n => this.loadPickedGames(),
      err => console.log(err),
      () => console.log('_hubService.deleteNotifier complete')
    );
    ////
  }


}
