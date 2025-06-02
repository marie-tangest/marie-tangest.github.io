export as namespace GradientModule;

export interface GradientOptions {
    el: HTMLElement;
    isStatic?: boolean;
    disableAmbientAnimations?: boolean;
    density?: [number, number];
}

export class Gradient {
    constructor(options?: GradientOptions);

    private el: HTMLElement;
    private cssVarRetries: number;
    private maxCssVarRetries: number;
    private angle: number;
    private isLoadedClass: boolean;
    private isScrolling: boolean;
    private isIntersecting: boolean;
    private shaderFiles: any;
    private vertexShader: string;
    private sectionColors: number[];
    private computedCanvasStyle: CSSStyleDeclaration;
    private conf: GradientOptions;
    private uniforms: any;
    private t: number;
    private last: number;
    private width: number;
    private minWidth: number;
    private height: number;
    private xSegCount: number;
    private ySegCount: number;
    private mesh: any;
    private material: any;
    private geometry: any;
    private minigl: any;
    private scrollObserver: any;
    private amp: number;
    private seed: number;
    private freqX: number;
    private freqY: number;
    private freqDelta: number;
    private activeColors: number[];
    private isMetaKey: boolean;
    private isGradientLegendVisible: boolean;
    private isMouseDown: boolean;

    initGradient(selector: string): void;
    connect(): void;
    disconnect(): void;
    play(): void;
    pause(): void;
    toggleColor(index: number): void;
    updateFrequency(freq: number): void;
    private handleScroll(): void;
    private handleScrollEnd(): void;
    private resize(): void;
    private handleMouseDown(e: Event): void;
    private handleMouseUp(): void;
    private animate(): void;
    private shouldSkipFrame(): boolean;
    private initGradientColors(): void;
}
