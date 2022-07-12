import { LeafletMouseEvent } from "leaflet";

export class ModalHelper {

    static createPopupInfo = (event: LeafletMouseEvent) => {
        let title = document.createElement("h3");
        const properties = { ...event.propagatedFrom.feature.properties };
        console.log(properties.einrichtung_name)
        title.textContent = event.propagatedFrom.feature.properties.einrichtung_name;
        let popupInfo = document.createElement("div");
        let popupInfoList = document.createElement("ul");
        Object.entries(properties)
            .filter((value) => value[0].endsWith("_de"))
            .filter(([_, v]) => v != null)
            .map(([_, v]) => v as string)
            .forEach((text: string) => {
                if (text) {
                    const listElement = document.createElement("li")
                    listElement.textContent = text;
                    popupInfoList.appendChild(listElement);
                }
            })
        popupInfo.appendChild(title);
        popupInfo.appendChild(popupInfoList);
        return popupInfo.outerHTML;
    }

    static addPopups = (feature: any, layer: any) => {
        let title = document.createElement("h3");
        title.textContent = feature.properties.einrichtung_name;
        let popupInfo = document.createElement("div");
        let popupInfoList = document.createElement("ul");
        Object.entries(feature.properties)
            .filter((value) => value[0].endsWith("_de"))
            .filter(([_, v]) => v != null)
            .map(([_, v]) => v as string)
            .forEach((text: string) => {
                if (text) {
                    const listElement = document.createElement("li")
                    listElement.style.wordBreak = 'break-word'
                    listElement.textContent = text;
                    popupInfoList.appendChild(listElement);
                }
            });
        popupInfo.appendChild(title);
        popupInfo.appendChild(popupInfoList);
        let element = popupInfo.outerHTML;
        layer.bindPopup(element);
    }

}
