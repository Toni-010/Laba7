// src/declarations.d.ts
declare module '*.json' {
    const value: any;
    export default value;
}

declare module '@2gis/mapgl' {
    export function load(): Promise<any>;
}

declare module '@2gis/mapgl-clusterer' {
    export class Clusterer {
        constructor(map: any, options: any);
        load(markers: any[]): void;
        destroy(): void;
    }
}

declare module '@2gis/mapgl-ruler' {
    export class RulerControl {
        constructor(map: any, options: any);
        getRuler(): any;
    }
}

declare module '@2gis/mapgl-directions' {
    export class Directions {
        constructor(map: any, options: any);
        carRoute(options: any): void;
        clear(): void;
    }
}