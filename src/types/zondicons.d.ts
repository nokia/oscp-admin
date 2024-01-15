declare module 'svelte-zondicons' {
    import { SvelteComponent } from 'svelte';
    export class ReloadIcon extends SvelteComponent<{ size: string }> {}
    export class ExploreIcon extends SvelteComponent<{ size: string }> {}
    export class AddSolidIcon extends SvelteComponent<{ size: string; color?: string }> {}
    export class CloseSolidIcon extends SvelteComponent<{ size: string; color?: string }> {}
    export class UploadIcon extends SvelteComponent<{ class: string }> {}
    export class MapIcon extends SvelteComponent<{ class: string }> {}
    export class CheveronLeftIcon extends SvelteComponent {}
    export class DownloadIcon extends SvelteComponent {}
}
