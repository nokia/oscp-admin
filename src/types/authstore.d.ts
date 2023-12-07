declare module '@oarc/scd-access/authstore.js' {
    import type { Readable } from 'svelte/store';
    const authStore: {
        init: (authDomain: string, authClientId: string, authAudience: string, authScope: string) => any;
        getToken: () => Promise<string>;
    };
    export type AuthStore = typeof authStore;
    const authenticated: Readable<boolean>;
    const loading: Readable<boolean>;
}

declare module '@oarc/ssd-access/authstore.js' {
    import type { Readable } from 'svelte/store';
    const authStore: {
        init: (authDomain: string, authClientId: string, authAudience: string, authScope: string) => any;
        getToken: () => Promise<string>;
    };
    const authenticated: Readable<boolean>;
    const loading: Readable<boolean>;
}

declare module '@oarc/ssd-access' {
    function setSsdUrl(url: string): any;
    function postScrFile(url: string, inputValue: string, file: File, token: string): any;
    type SSR_SERVICE = {
        id: string;
        type: string;
        url: string;
        title: string;
        description: string;
        properties: { type: string; value: string }[];
    };
    type Geometry = {
        coordinates: [number, number][][];
        type: string;
        bbox: (number | string)[];
    };
    const ssr_empty: SSR_EMPTY;
    type SSR_EMPTY = {
        type: string;
        services: SSR_SERVICE[];
        geometry: Geometry;
        altitude?: number;
    };
    function validateSsr(input: any): Promise<boolean>;
    function postService(countryCode: string, data: any, token: string): Promise<any>;
    const ssr_service: SSR_SERVICE;
    const availableServiceTypes: string[];
    const supportedCountries: string;
    function postSsrFile(url: string, inputValue: string, file: File, token: string): any;
}

declare module '@oarc/scd-access' {
    export type FormContent = {
        id: string;
        type: string;
        provider: string;
        timestamp?: number;
        tenant: any;
    } & SCD;
    export type Pose = { position: { lat: number; lon: number; h: number }; quaternion: { x: number; y: number; z: number; w: number } };
    export type SCD = {
        content: {
            geopose: Pose;
            refs: any;
            size?: string;
            bbox?: string;
            description?: string;
            placekey?: string;
            id: string;
            type: string;
            title: string;
            keywords: string[];
            definitions: { type: string; value: string }[];
        };
    };
    type SCR_EMPTY = {
        type: string;
        content: {
            id: string;
            type: string;
            title: string;
            refs: [];
            definitions: [];
            geopose: Pose;
        };
    };
    const scr_definition: { type: string; value: string };
    const scr_reference: { contentType: string; url: string };
    const scr_empty: SCR_EMPTY;
    function validateScr(scr: string): Promise<boolean>;
    function postContent(url: string, topic: string, scr: string, token: string): Promise<string>;
    function deleteWithId(url: string, topic: string, scr: string, token: string): Promise<string>;
    function putContent(url: string, topic: string, scr: string, id: string, token: string): Promise<string>;
    function searchContentsForTenant(oscpScdUrl: string, topicElement: string, token: string): string;
    function getContentWithId(oscpScdUrl: string, topic: string, id: string): Promise<FormContent>;
    function postScrFile(url: string, inputValue: string, file: File, token: string): any;
}
