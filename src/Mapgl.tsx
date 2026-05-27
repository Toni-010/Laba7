import { useEffect } from 'react';
import { load } from '@2gis/mapgl';
import { useMapglContext } from './MapglContext';
import { Clusterer } from '@2gis/mapgl-clusterer';
import { RulerControl } from '@2gis/mapgl-ruler';
import { Directions } from '@2gis/mapgl-directions';
import { useControlRotateClockwise } from './useControlRotateClockwise';
import { ControlRotateCounterclockwise } from './ControlRotateConterclockwise';
import { MapWrapper } from './MapWrapper';


import dtpData from './data/dtp-data.json';


export const MAP_CENTER = [39.89071, 57.625966];

export default function Mapgl() {
    const { setMapglContext } = useMapglContext();

    useEffect(() => {
        let map: mapgl.Map | undefined = undefined;
        let directions: Directions | undefined = undefined;
        let clusterer: Clusterer | undefined = undefined;

        load().then((mapgl) => {
            if (!mapgl) return;
            
            map = new mapgl.Map('map-container', {
                center: MAP_CENTER as [number, number],
                zoom: 15,
                key: '4fae9145-ecc4-4c7c-b77e-944123094e45',
                style: 'ac66677e-bf72-40b6-b90b-49d16a95f22e',
            });

            if (!map) return;

            map.on('click', (e) => console.log(e));

            

            // 1. Создаём источник данных из GeoJSON файла
            const source = new mapgl.GeoJsonSource(map, {
                data: dtpData as any,
                attributes: {
                    dataType: 'dtp',
                },
            });

            
            const pointsLayer: any = {
                id: 'dtp-points-layer',
                filter: ['match', ['sourceAttr', 'dataType'], ['dtp'], true, false],
                type: 'point',
                style: {
                    iconImage: 'road-accident',
                    iconWidth: 18,
                    textField: ['get', 'category'],
                    textFont: ['Noto_Sans'],
                    textColor: '#D5A2AA',
                    textHaloColor: '#ffffff',
                    textHaloWidth: 2,
                    textSize: 12,
                    iconPriority: 100,
                    textPriority: 110,
                },
            };

            
            const heatmapLayer: any = {
                id: 'dtp-heatmap-layer',
                filter: ['match', ['sourceAttr', 'dataType'], ['dtp'], true, false],
                type: 'heatmap',
                style: {
                    color: [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(0, 0, 0, 0)',
                        0.2, '#EDE5CF',
                        0.4, '#D5A2AA',
                        0.6, '#D39C83B2',
                        0.8, '#A65461',
                        1, '#541F3F'
                    ],
                    radius: 25,
                    intensity: 0.6,
                    opacity: 0.7,
                    downscale: 1,
                },
            };

            // 4. Добавляем слой на карту
            map.on('styleload', () => {
                if (map) {
                    //map.addLayer(heatmapLayer);
                    map.addLayer(pointsLayer);
                }
            });

            // ========== ПЛАГИНЫ ==========

            const rulerControl = new RulerControl(map, { position: 'centerRight' });

            clusterer = new Clusterer(map, {
                radius: 60,
            });

            const markers = [
                { coordinates: [55.27887, 25.21001] as [number, number] },
                { coordinates: [55.30771, 25.20314] as [number, number] },
                { coordinates: [55.35266, 25.24382] as [number, number] },
            ];
            clusterer.load(markers);

            directions = new Directions(map, {
                directionsApiKey: 'rujany4131',
            });

            directions.carRoute({
                points: [
                    [55.28273111108218, 25.234131928828333] as [number, number],
                    [55.35242563034581, 25.23925607042088] as [number, number],
                ],
            });

            setMapglContext({
                mapglInstance: map,
                rulerControl,
                mapgl,
            });
        });

        return () => {
            directions && directions.clear();
            clusterer && clusterer.destroy();
            map && map.destroy();
            setMapglContext({ mapglInstance: undefined, mapgl: undefined });
        };
    }, [setMapglContext]);

    useControlRotateClockwise();

    return (
        <>
            <MapWrapper />
            <ControlRotateCounterclockwise />
        </>
    );
}