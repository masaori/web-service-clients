import { ElementHandle } from 'puppeteer';
export declare class PuppeteerClient {
    private absoluteScreenshotDirectoryPath;
    private browser;
    private pageByUrl;
    private captureResultByUrl;
    constructor(absoluteScreenshotDirectoryPath: string);
    private launchBrowser;
    private clickPointWithRetry;
    openPageByUrl: (url: string) => Promise<void>;
    closePageByUrl: (url: string) => Promise<void>;
    capturePageByUrl: (url: string, options?: {
        fullPage?: boolean;
        useCache?: boolean;
    }) => Promise<{
        imageFilePath: string;
        imageWidth: number;
        imageHeight: number;
    }>;
    clickPoint: (url: string, point: {
        x: number;
        y: number;
    }) => Promise<void>;
    getElementsByPoint: (url: string, point: {
        x: number;
        y: number;
    }) => Promise<ElementHandle<Element>[]>;
}
//# sourceMappingURL=PuppeteerClient.d.ts.map