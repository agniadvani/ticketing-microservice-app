import nats from "node-nats-streaming"

class NatsWrapper {
    private _client?: nats.Stan

    get client() {
        if (!this._client) {
            throw new Error('cannot access client before its initialization')
        }

        return this._client
    }

    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, { url })
        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log("Connected to NATS")
                resolve()
            })
            this.client.on('error', (err) => {
                reject(err)
            })
        })
    }
}

export const natsWrapper = new NatsWrapper()