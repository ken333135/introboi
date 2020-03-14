import React from 'react';
import q from 'q';

import {
    Table,
    Card,
} from 'antd'

import {
    _getPlayerData,
    _getWinLoss,
    _getWordCloud,
} from '../../services'

import '../../css/homepage.css'

import Heatmap from './heatmap'

const steamIds = ['39286649','84406354','101745193','302147713']

class Homescreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            playerData: [],
            winlossData: [],
            wordCloudData: [],
        }
    }

    render() {
        return (
            <Card>
                {this.renderProfileTable()}
                <Heatmap 
                    playerData={this.state.playerData}
                    winlossData={this.state.winlossData}
                    steamIds={steamIds}/>
            </Card>
        )
    }

    componentDidMount() {
        this.getPlayerData()
        this.getWinLoss()
        this.getWordCloud()
    }

    getPlayerData = () => {
        q.all(steamIds.map(_steamId => _getPlayerData({ accountId: _steamId })))
        .then(res => {
            let playerData = res.map(_playerData => _playerData.data)
            this.setState({
                playerData,
            })
        })
    }

    getWinLoss = () => {
        
        // For ea steamId
        q.all(steamIds.map(_steamId => {
            // Loop through all other steamIds other than itself
            return q.all(steamIds .map(_includedSteamId => {
                if (_includedSteamId===_steamId) {
                    return {data: {win: 0, lose: 0}}
                } else {
                    return _getWinLoss({
                        accountId: _steamId,
                        includedAccountIds: [_includedSteamId]
                    })
                }

            }))
        }))
        .then(res => {
            this.setState({
                winlossData: res
            })
        })
    }

    getWordCloud = () => {
        q.all(steamIds.map(_steamId => _getWordCloud({ accountId: _steamId })))
        .then(res => {
            let wordCloudData = res.map(_wordCloudData => _wordCloudData.data)
            console.log({wordCloudData})
            this.setState({
                wordCloudData,
            })
        })
    }

    renderProfileTable = () => {

        const { playerData } = this.state

        const columns = [
            {
                title: 'Name',
                dataIndex: 'profile',
                key: 'profile',
                render: (profile) => 
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img alt='profile-avatar' src={profile.avatar}/>
                    <p style={{marginBottom:0, marginLeft: 4}}>{profile.personaname}</p>
                </div>
            }, {
                title: 'Rank',
                dataIndex: 'competitive_rank',
                key: 'competitive_rank'
            }, {
                title: 'MMR',
                dataIndex: 'mmr_estimate',
                key: 'mmr_estimate',
                render: (mmr) => mmr.estimate
            }
        ]
        return (
            <Table 
            columns={columns} 
            dataSource={playerData} 
            pagination={false}
            rowKey={record => record.profile.account_id}/>
        )
    }

}

export default Homescreen