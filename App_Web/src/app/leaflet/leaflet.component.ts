import { AppService } from './../app-service';
import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

declare let L;
// declare let Fire;
import * as M from '../../assets/materialize/js/materialize.min.js';
import { FireGeo } from '../fireGeo';

const URL = 'https://fire.iconx.app/api/pictures/';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.css']
})
export class LeafletComponent implements OnInit {

  currentGeo; // координаты пользователя
  fireGeo: FireGeo; // координаты пожара
  map: any;
  sessionId;
  result = 'Для получения результата загрузите координаты пожара, а затем фото для распознавания.';

  // file loader
  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    console.log('fileOverBase');
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
    console.log('fileOverAnother');
  }

  // end file loader

  constructor(private appService: AppService) {

  }



  ngOnInit() {

    //
    document.addEventListener('DOMContentLoaded', function () {
      const elems = document.querySelectorAll('.modal');
      const instances = M.Modal.init(elems);
    });
    //
    document.addEventListener('DOMContentLoaded', function () {
      const elems = document.querySelectorAll('.parallax');
      const instances = M.Parallax.init(elems);
    });

    let marker; // маркер пожара

    navigator.geolocation.getCurrentPosition(position => {

      this.currentGeo = position; // получаем текущие координаты
      console.log('текущие координаты', this.currentGeo);

      const latitude = this.currentGeo.coords.latitude;
      const longitude = this.currentGeo.coords.longitude;

      this.map = L.map('map').setView([latitude, longitude], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      L.circle([latitude, longitude]).addTo(this.map)
        .bindPopup('You are here')
        .openPopup();

      const self = this;

      // обработка клика на карте - ставим маркер пожара
      this.map.on('click', function (e) {

        if (marker) {
          self.map.removeLayer(marker); // удаляем старый маркер
        }

        marker = L.circle([e.latlng.lat, e.latlng.lng], { // ставим маркер по координатам клика
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 15
        }).addTo(self.map)
          .bindPopup('Метка пожара')
          .openPopup();

        self.appService.coordinatesStorage.latitude = e.latlng.lat;
        self.appService.coordinatesStorage.longitude = e.latlng.lng;
        console.log('fire', self.appService.coordinatesStorage); // координаты поставленной точки пожара
        // добавить точку куда-то...
      });
    });


  }

  // Добаввление полигонов на карту
  private addPolygones() {

    // this.appService.GetData().subscribe(
    //   (d: any) => {
    //     console.log(d); // получаем полигон

    //     let polyg = [];

    //     const keys = Object.keys(d);
    //     d.array.forEach(key => {
    //       polyg.push(d.key);
    //     });
    //     // expected output: Array ["a", "b", "c"]
    //   }
    // );

    const data = [
      [55.76488919564486, 37.583707704221766],
      [55.76427352520776, 37.58585373201755],
      [55.762595472110796, 37.58415818454733],
      [55.76304215516818, 37.57926470577249]
    ];
    const data2 = [
      [55.75952287837797, 37.58537650108338],
      [55.75885279140071, 37.58496880531312],
      [55.758889012612755, 37.58666396141053]
    ];
    const data3 = [
      [55.7596858707666, 37.57219076156617],
      [55.758418134231974, 37.571310997009284],
      [55.758732053784215, 37.57590293884278]
    ];

    const commonData = new Array<any>();
    commonData.push(data);
    commonData.push(data2);
    commonData.push(data3);


    console.log(commonData);

    for (let i = 0; i < commonData.length; i++) { // добавить все полигоны
      const element = commonData[i];
      const polygon = L.polygon(element, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
      }).addTo(this.map);
      polygon.bindPopup('<p>Скорость ветра: 2м/c</p><p>Направление ветра: <i class="fas fa-long-arrow-alt-left"></i></p>');
    }

    // добавление полигонов
    // const polygon = L.polygon(...commonData).addTo(this.map);
    // const polygon2 = L.polygon(data2).addTo(this.map);
    // polygon.bindPopup('I am a polygon.');
  }

  // Отправить серверу данные - свои координаты + координаты отмеченного пожара
  private sendData() {

    // console.log('sessionId', this.sessionId);

    const coordinates = {
      userLatitude: +this.currentGeo.coords.latitude.toFixed(3),
      userLongitude: +this.currentGeo.coords.longitude.toFixed(3),
      fireLatitude: +this.appService.coordinatesStorage.latitude.toFixed(3),
      fireLongitude: +this.appService.coordinatesStorage.longitude.toFixed(3)
    };

    console.log(coordinates);

    this.appService.SendData(coordinates).subscribe(
      (data: any) => {
        console.log(data);

        const idURL = `https://fire.iconx.app/api/pictures/${data.id}`;
        console.log(idURL);

        this.uploader = new FileUploader({ url: idURL });

        // Add in the other upload form parameters.
        // this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        //   form.append('picture' , fileItem);
        //  };

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('ImageUpload:uploaded:', item, status);
          // если все загружено нормально то отправляем юзеру окошко с инфой предикта
          // if (status === 200) {
            // console.log(response);
            // document.getElementById('modalBtn').click();
            // document.getElementById('imgFire').setAttribute('src', '‪../../../../../src/img/fire.jpg');
            // this.result = response;
            // this.result = 'Это пожар на 0.91';
          // }
        };

      },
      error => {
        console.log(error);
      }
    );
  }


  // добавления множества попапов с ифнормацией
  // const popupLocation1 = new L.LatLng(55.76488919564486, 37.583707704221766);
  // const popupLocation2 = new L.LatLng(55.76304215516818, 37.57926470577249);

  // const popupContent1 = '<p>Hello world!<br />This is a nice popup.</p>',
  //   popup1 = new L.Popup();

  // popup1.setLatLng(popupLocation1);
  // popup1.setContent(popupContent1);

  // const popupContent2 = '<p>Hello world!<br />This is a nice popup.</p>',
  //   popup2 = new L.Popup();

  // popup2.setLatLng(popupLocation2);
  // popup2.setContent(popupContent2);

  // map.addLayer(popup1).addLayer(popup2);



}
