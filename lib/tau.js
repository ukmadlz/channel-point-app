import Fetch from 'node-fetch'

export class Tau {
    baseUrl;
    broadcasterId;

    constructor({baseUrl, broadcasterId}) {
        this.baseUrl = baseUrl || 'https://ukmadlz-tau.onrender.com/api/twitch/helix/';
        this.broadcasterId = broadcasterId || Number(process.env.CHANNEL_OWNER_ID);
    }

    async tauFetch(method, path, body) {
        try {
            const response = await Fetch(`${this.baseUrl}${path}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${process.env.TAU_WS_TOKEN}`
                },
                body: body ? JSON.stringify(body) : undefined,
            });
            try {
                return await response.json();
            } catch (e) {
                return response;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    /**
     * isFollower
     * @param {string} userId
     * @returns {Boolean}
     */
    async isFollower(channelUserId, commandUserId) {
        const followerUserData = await this.tauFetch('GET', `users/follows?format=json&from_id=${channelUserId}&to_id=${commandUserId}`);

        return Boolean(followerUserData.total)
    }

    async listClips(paginationCursor) {
        return await this.tauFetch('GET', `clips?broadcaster_id=${this.broadcasterId}&after=${paginationCursor}`);
    }

    async getClip(clipId) {
        return await this.tauFetch('GET', `clips?id=${clipId}`);
    }

    async ListChannelPointRedemptions() {
        return await this.tauFetch('GET', `channel_points/custom_rewards?broadcaster_id=${this.broadcasterId}`);
    }

    async CreateChannelPointRedemption(title, prompt, cost, colour) {
        return await this.tauFetch('POST', `channel_points/custom_rewards?broadcaster_id=${this.broadcasterId}`, {
            title,
            prompt,
            cost,
            colour,
        });
    }

    async DeleteChannelPointRedemption(id) {
        return await this.tauFetch('DELETE', `channel_points/custom_rewards?broadcaster_id=${this.broadcasterId}&id=${id}`);
    }
}