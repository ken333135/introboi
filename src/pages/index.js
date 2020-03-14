import React from 'react';
import q from 'q';

import {
    Table,
    Card,
    Row,
    Col
} from 'antd'

import {
    _getPlayerData,
    _getWinLoss
} from '../services'

import '../css/homepage.css'

const steamIds = ['39286649','84406354','101745193']

class Homepage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            playerData: [],
            winlossData: [],
        }
    }

    render() {
        return (
            <Card>
                {this.renderProfileTable()}
                {this.renderPartnerHeatmap()}
            </Card>
        )
    }

    componentDidMount() {
        this.getPlayerData()
        this.getWinLoss()
    }

    getPlayerData = () => {
        q.all(steamIds.map(_steamId => _getPlayerData({ accountId: _steamId })))
        .then(res => {
            let playerData = res.map(_playerData => _playerData.data)
            console.log({playerData})
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

    renderProfileTable = () => {

        const { playerData } = this.state

        const columns = [
            {
                title: 'Name',
                dataIndex: 'profile',
                key: 'name',
                render: (profile) => 
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img alt='profile-avatar' src={profile.avatar}/>
                    <p style={{marginBottom:0, marginLeft: 4}}>{profile.personaname}</p>
                </div>
            }, {
                title: 'Rank',
                dataIndex: 'competitive_rank',
                key: 'rank'
            }, {
                title: 'MMR',
                dataIndex: 'mmr_estimate',
                key: 'mmr',
                render: (mmr) => mmr.estimate
            }
        ]
        return (
            <Table 
            columns={columns} 
            dataSource={playerData} 
            pagination={false}/>
        )
    }

    renderPartnerHeatmap = () => {

        const {playerData} = this.state

        return(
            <div>
                <Row>
                    <Col span={24/(steamIds.length+1)}></Col>
                    {playerData.map(_playerData => {
                        return <Col span={24/(steamIds.length+1)}>{this.heatmapAvatar(_playerData.profile.avatar)}</Col>
                    })}
                </Row>
                {playerData.map((_playerData, index) => {
                    return this.heatmapRow(_playerData, index)
                })
                }
            </div>
        )
    }

    heatmapRow = (_playerData, index) => {

        const {winlossData} = this.state

        return (
            <Row>
                <Col span={24/(steamIds.length+1)}>{this.heatmapAvatar(_playerData.profile.avatar)}</Col>
                {winlossData[index] && winlossData[index].map(_winlossData => {
                    return <Col span={24/(steamIds.length+1)}>{this.heatmapBox(_winlossData.data)}</Col>
                })}
            </Row>
        )
    }

    heatmapAvatar = (avatarUrl) => {
        return (
            <div className='heatmap-box'>
                <img alt='profile-avatar' src={avatarUrl}/>
            </div>
        )
    }

    heatmapBox = (data) => {
        return (
            <div className='heatmap-box'>
                <p>{`${data.win}/${data.lose}`}</p>
            </div>
        )
    }
}

export default Homepage