"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantClient = void 0;
const js_client_rest_1 = require("@qdrant/js-client-rest");
class QdrantClient {
    constructor() {
        this.client = new js_client_rest_1.QdrantClient({
            url: 'http://localhost:6333',
        });
        this.getCollections = (...args) => this.client.getCollections(...args);
        this.createCollection = (...args) => this.client.createCollection(...args);
        this.deleteCollection = (...args) => this.client.deleteCollection(...args);
        this.createPayloadIndex = (...args) => this.client.createPayloadIndex(...args);
        this.search = (...args) => this.client.search(...args);
        this.scroll = (...args) => this.client.scroll(...args);
        this.retrieve = (...args) => this.client.retrieve(...args);
        this.upsert = (...args) => this.client.upsert(...args);
        this.delete = (...args) => this.client.delete(...args);
    }
}
exports.QdrantClient = QdrantClient;
//# sourceMappingURL=QdrantClient.js.map