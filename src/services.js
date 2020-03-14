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