import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { circleMarker, geoJSON, LatLng, tileLayer } from 'leaflet';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ModalHelper } from './modal-helper';

@Injectable({
  providedIn: 'root'
})
export class StandorteService {

  private $zugaenge: ReplaySubject<any> = new ReplaySubject(1);

  private $stadteile: ReplaySubject<any> = new ReplaySubject(1);

  private $wfsZugaenge: ReplaySubject<any> = new ReplaySubject(1);

  private $allZugaenge: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);

  private static ZUGAENGE_URL = [
    { name: 'Sonstiges', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1189/items' },
    { name: 'Familienhilfe', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1192/items' },
    { name: 'Kinderbetreuung, Schulen, Berufsschulen', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1179/items' },
    { name: 'Öffentliche WC-Anlagen', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1167/items' },
    { name: 'Verkehr', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1171/items' },
    { name: 'Gesundheit', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1196/items' },
    { name: 'Essen & Trinken', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1184/items' },
    { name: 'Bank & Post', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1174/items' },
    { name: 'Behörden & Botschaften', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1175/items' },
    { name: 'Freizeit & Tourismus & Kultur', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1186/items' },
    { name: 'Soziale Einrichtungen', url: 'https://kommisdd.dresden.de/net4/public/ogcapi/collections/L1191/items' }
  ]

  static FULLY_ACCESSIBLE = { fillColor: "green", "weight": 2, "opacity": 0.65, color: 'green' };

  static PARTIAL_ACCESSIBLE = { fillColor: "yellow", "weight": 2, "opacity": 0.65, color: 'orange' };

  static NOT_ACCESSIBLE = { fillColor: "red", "weight": 2, "opacity": 0.65, color: 'red' };

  static UKNOWN = { fillColor: "grey", "weight": 2, "opacity": 0.65, color: 'grey' };

  static ZUGANG_GEOJSON = (geoJson: any) => {
    return geoJSON(geoJson, {
      pointToLayer: StandorteService.zugangCirle, onEachFeature: function (feature, layer) {
        ModalHelper.addPopups(feature, layer);
      }
    });
  }

  static ZUGANGE_GEOJSON = (geoJson: any, name: string) => {
    console.log("Add layer")
    return {
      name: name,
      geoJson: geoJSON(geoJson, {
        pointToLayer: StandorteService.zugangCirle, onEachFeature: function (feature, layer) {
          ModalHelper.addPopups(feature, layer);
        }
      })
    }
  }

  static ZUGANG_WFS = (wms: any) => {
    return tileLayer.wms(wms, { layers: 'L1169' });
  }

  static RETURN_GEOJSON = (geoJson: any) => {
    return geoJSON(geoJson, { style: { "fillOpacity": 0.2 } });
  }

  static zugangCirle = (feature: any, latlng: LatLng) => {
    let zugang = feature.properties.zugang_id;
    switch (zugang) {
      case "FULLY_ACCESSIBLE":
        return circleMarker(latlng, StandorteService.FULLY_ACCESSIBLE);
      case "PARTIAL_ACCESSIBLE":
        return circleMarker(latlng, StandorteService.PARTIAL_ACCESSIBLE);
      case "NOT_ACCESSIBLE":
        return circleMarker(latlng, StandorteService.NOT_ACCESSIBLE);
      default:
        return circleMarker(latlng, StandorteService.UKNOWN);
    }
  };

  constructor(httpClient: HttpClient) {
    /*
    httpClient
      .get(StandorteService.BARRIEREFREIE_ZUGAENGE_URL)
      .subscribe((data: any) => this.$zugaenge.next(data));
    httpClient
      .get(StandorteService.STADTTEILE)
      .subscribe((data: any) => this.$stadteile.next(data));
    httpClient
      .get(StandorteService.WFS_BARRIERFREI_URL, { responseType: 'text' })
      .subscribe((data: any) => this.$wfsZugaenge.next(data));*/
    StandorteService.ZUGAENGE_URL.forEach(value => {
      httpClient.get(value.url)
        .subscribe((data: any) => {
          console.log("Push data")
          let zugaenge = this.$allZugaenge.getValue();
          let zugangeValues = [...zugaenge];
          zugangeValues.push({ 'geoJson': data, 'name': value.name })
          this.$allZugaenge.next(zugangeValues);
        })
    });
  }

  getBarrierefreieZugängeWfs() {
    return this.$wfsZugaenge;
  }

  getBarrierefreieZugänge() {
    return this.$zugaenge;
  }

  getAllZugänge() {
    return this.$allZugaenge;
  }

  getStadtteile() {
    return this.$stadteile;
  }
}
