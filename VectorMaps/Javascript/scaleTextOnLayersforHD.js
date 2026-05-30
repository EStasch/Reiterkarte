function scaleTextOnLayersforHD(map,searchString,dpr) {
    console.log("dpr: " + dpr);
                
    // Dynamically adjust text size based on device pixel ratio
    //const scaleLayers = ["text_surface_track","text_surface_unclassified","text_surface_path",
    //                     "poi_facilities_drinking_water","poi_facilities_watering_place","poi_facilities_fire_pit","poi_facilities_shelter","poi_facilities_picnic","poi_facilities_veterinary","poi_facilities_biergarten","poi_facilities_horse_Restaurant","poi_stables","poi_stables_stations"]
    
    
    //const prefix = "text_";
    // Get the array of all layer objects
    //const layers = map.getStyle().layers;
    //const scaleLayers = layers.filter(item => item.id.startsWith(prefix));

    // Returns an array of strings (layer IDs)
    const layerIds = map.getLayersOrder();
    //const scaleLayers = layerIds.filter(item => item.startsWith(prefix));

    
    //const searchString = "poi_|text_|Name_";
    const regex = new RegExp(`^${searchString}`, 'i'); // 'i' flag for case-insensitivity
    const scaleLayers = layerIds.filter(item => regex.test(item));

    const textProperties = ["text-size","text-offset"]


    if(dpr != 1){
        
        scaleLayers.forEach((layer,index) =>{
            let txt_size = map.getLayoutProperty(layer,'text-size');
            //console.log(layer);

            if(txt_size){
                //console.log("txt_size in:")
                //console.log(txt_size);
                /*
                // Alle Werte verdoppeln
                txt_size.stops.forEach(subArray => {
                    subArray.forEach((wert, index) => {
                        subArray[index] = wert * dpr;
                    });                    
                }); 
                */
                // stop Array [zoomlevel,text-size] -> text-size Werte verdoppeln -> stop[1]
                if(txt_size.stops){
                    txt_size.stops.forEach((stop, index) => {
                            stop[1] = stop[1] * dpr;
                        });
                }
                else{
                    txt_size = txt_size * dpr;
                }
                //console.log("txt_size out:")
                //console.log(txt_size);
                map.setLayoutProperty(layer, 'text-size', txt_size);

                let txt_offset = map.getLayoutProperty(layer,'text-offset');
                if(txt_offset){
                    if(txt_offset.stops){
                        txt_offset.stops.forEach((stop, index) => {
                            //console.log("Stop: " + stop +", index: " + index);
                            if(Array.isArray(stop[1])){
                                stop[1].forEach((value, idx) => {
                                    stop[1][idx] = value * dpr;
                                });
                            }
                            else{
                                stop[1] = stop[1] * dpr;
                            }
                        });
                    }
                    else{
                        txt_offset.forEach((value,index)=> {
                        txt_offset[index] = value * dpr
                        });
                    }
                    
                    //console.log("text-offset out:")
                    //console.log(txt_offset);
                    map.setLayoutProperty(layer, 'text-offset', txt_offset);
                }
            }

            /*
            let icn_size = map.getLayoutProperty(layer,'icon-size');
            if(icn_size){
                const scaleFactor = 10; // Beispiel: Skalierungsfaktor
                icn_size.stops.forEach((stop, index) => {
                        stop[1] = (stop[1] * dpr * scaleFactor);
                    });
                console.log("icon-size out:")
                console.log(icn_size);
            }
            */

        });
    
    }
    
}

function demoScaleTextOnLayersforHD() {
    const dpr = window.devicePixelRatio || 1;
    map.on('style.load', () => {
      // Scale text sizes based on device pixel ratio
      map.getStyle().layers.forEach((layer) => {
         if (layer.type === 'symbol') {
            layer.layout['text-size'] = dpr * 14; // Adjust the multiplier as needed
         }
      });
   });
    
}