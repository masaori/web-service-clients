import { google } from '@google-cloud/vision/build/protos/protos';
export declare class GoogleCloudVisionClient {
    private googleCloudVisionClient;
    private fullTextAnnotationByImagePath;
    getFullTextAnnotation: (imagePath: string, options: {
        useCache?: boolean;
    }) => Promise<google.cloud.vision.v1.IPage>;
}
//# sourceMappingURL=GoogleCloudVisionClient.d.ts.map