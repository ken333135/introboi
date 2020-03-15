import axios from 'axios'

export const _getPlayerData = ({accountId}) => axios({
    method: 'get',
    url: `https://api.opendota.com/api/players/${accountId}`,
})

export const _getWinLoss = ({accountId, includedAccountIds}) => axios({
    method: 'get',
    url: `https://api.opendota.com/api/players/${accountId}/wl`,
    params: {
        included_account_id: includedAccountIds
    }
})

export const _getWordCloud = ({accountId}) => axios({
    method: 'get',
    url: `https://api.opendota.com/api/players/${accountId}/wordcloud`,
})

export const _getHeroData = ({accountId}) => axios({
    method: 'get',
    url: `https://api.opendota.com/api/players/${accountId}/heroes`,
})

export const _getHeroes = () => axios({
    method: 'get',
    url: `https://api.opendota.com/api/heroes`,
})