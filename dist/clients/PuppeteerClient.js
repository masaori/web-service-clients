"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerClient = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const buffer_image_size_1 = __importDefault(require("buffer-image-size"));
const read_amazon_co_jp_cookies_json_1 = __importDefault(require("../../read.amazon.co.jp.cookies.json"));
class PuppeteerClient {
    constructor(absoluteScreenshotDirectoryPath) {
        this.absoluteScreenshotDirectoryPath = absoluteScreenshotDirectoryPath;
        this.browser = null;
        this.pageByUrl = {};
        this.captureResultByUrl = {};
        this.launchBrowser = () => __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                return;
            }
            this.browser = yield puppeteer_1.default.launch({ headless: 'new' });
            // this.browser = await puppeteer.launch({ headless: false })
        });
        this.clickPointWithRetry = (page, point, retryCount = 60) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield new Promise((resolve) => setTimeout(resolve, 256));
                yield page.mouse.click(point.x, point.y);
                return;
            }
            catch (e) {
                if (retryCount === 0) {
                    throw e;
                }
                console.log(`Failed to click ${JSON.stringify(point)} ${JSON.stringify(e)}. Retry... ${retryCount}`);
                yield new Promise((resolve) => setTimeout(resolve, 256));
                yield this.clickPointWithRetry(page, point, retryCount - 1);
            }
        });
        this.openPageByUrl = (url) => __awaiter(this, void 0, void 0, function* () {
            yield this.launchBrowser();
            if (!this.browser) {
                throw new Error('[PuppeteerClient]: Failed to launch browser');
            }
            if (this.pageByUrl[url]) {
                return;
            }
            const page = yield this.browser.newPage();
            yield page.setCookie(...read_amazon_co_jp_cookies_json_1.default);
            yield page.setViewport({ width: 1600, height: 900 });
            this.pageByUrl[url] = page;
            yield page.goto(url);
            yield page.waitForNetworkIdle();
            return;
        });
        this.closePageByUrl = (url) => __awaiter(this, void 0, void 0, function* () {
            yield this.launchBrowser();
            if (!this.browser) {
                return;
            }
            if (!this.pageByUrl[url]) {
                return;
            }
            yield this.pageByUrl[url].close();
            delete this.pageByUrl[url];
            if (Object.keys(this.pageByUrl).length === 0) {
                yield this.browser.close();
                this.browser = null;
            }
        });
        this.capturePageByUrl = (url, options) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const fullPage = (_a = options === null || options === void 0 ? void 0 : options.fullPage) !== null && _a !== void 0 ? _a : true;
            const useCache = (_b = options === null || options === void 0 ? void 0 : options.useCache) !== null && _b !== void 0 ? _b : false;
            const escapedUrl = url.replace(/[^a-zA-Z0-9]/g, '_');
            const imageFilePath = path_1.default.join(this.absoluteScreenshotDirectoryPath, `${escapedUrl}.png`);
            if (useCache && this.captureResultByUrl[url]) {
                return this.captureResultByUrl[url];
            }
            yield this.launchBrowser();
            if (!this.browser) {
                throw new Error('[PuppeteerClient]: Failed to launch browser');
            }
            yield this.openPageByUrl(url);
            const page = this.pageByUrl[url];
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            yield page.screenshot({
                fullPage,
                path: imageFilePath,
            });
            const buffer = yield fs_1.default.promises.readFile(imageFilePath);
            const imageDemension = (0, buffer_image_size_1.default)(buffer);
            const result = {
                imageFilePath,
                imageWidth: imageDemension.width,
                imageHeight: imageDemension.height,
            };
            this.captureResultByUrl[url] = result;
            return result;
        });
        this.clickPoint = (url, point) => __awaiter(this, void 0, void 0, function* () {
            yield this.launchBrowser();
            if (!this.browser) {
                throw new Error('[PuppeteerClient]: Failed to launch browser');
            }
            yield this.openPageByUrl(url);
            const page = this.pageByUrl[url];
            yield this.clickPointWithRetry(page, point);
        });
        this.getElementsByPoint = (url, point) => __awaiter(this, void 0, void 0, function* () {
            yield this.launchBrowser();
            if (!this.browser) {
                throw new Error('[PuppeteerClient]: Failed to launch browser');
            }
            yield this.openPageByUrl(url);
            const page = this.pageByUrl[url];
            yield page.mouse.move(point.x, point.y);
            const hoveredElements = yield page.$$(':hover');
            return hoveredElements;
        });
        console.log(`[PuppeteerClient]: absoluteScreenshotDirectoryPath: ${absoluteScreenshotDirectoryPath}`);
        if (!fs_1.default.existsSync(this.absoluteScreenshotDirectoryPath)) {
            throw new Error(`[PuppeteerClient]: Directory does not exist: ${this.absoluteScreenshotDirectoryPath}`);
        }
    }
}
exports.PuppeteerClient = PuppeteerClient;
//# sourceMappingURL=PuppeteerClient.js.map