import { Component, OnInit } from '@angular/core';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import { map } from 'rxjs';
import { StandorteService } from '../standorte.service';

@Component({
  selector: 'app-open-map-main',
  templateUrl: './open-map-main.component.html',
  styleUrls: ['./open-map-main.component.scss']
})
export class OpenMapMainComponent implements OnInit {

  options: MapOptions = {
    center: latLng(51.05363, 13.7727),
    zoom: 11,
    layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      opacity: 0.7,
      detectRetina: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })]
  };

  layers: Array<any> = [];
  layersControl: LeafletControlLayersConfig = {
    baseLayers: {},
    overlays: {}
  }

  constructor(private standorteService: StandorteService) {
  }

  ngOnInit(): void {
    this.standorteService.getAllZugänge()
      .pipe(map(value => value.map(layer => StandorteService.ZUGANGE_GEOJSON(layer.geoJson, layer.name))))
      .subscribe(element => element.forEach(layer => this.addOverlay(layer.name, layer.geoJson)))
  }

  addOverlay(name: string, geoJson: any) {
    this.layersControl.overlays[name] = geoJson;
  }

  addLayer(geoJson: any) {
    this.layers.push(geoJson);
  }

  sortLayer() {
    this.layers.forEach(layer => {
      layer.options.hasOwnProperty("pointToLayer") ? layer.bringToFront() : layer.bringToBack();
    });
  }

}
