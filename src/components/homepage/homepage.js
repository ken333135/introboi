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
    _getHeroData,
    _getHeroes
} from '../../services'

import '../../css/homepage.css'

import Heatmap from './heatmap'

const steamIds = ['39286649','84406354','101745193','302147713','297366026']

class Homescreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            playerData: [],
            winlossData: [],
            wordCloudData: [],
            heroData: [],
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
        // this.getWordCloud()
        this.getHeroData()
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

    getHeroData = () => {

        _getHeroes()
        .then(_heroes => {
            console.log({_heroes})
            // Create dict for id:heroName
            const heroes = {}
            _heroes.data.map(_hero => heroes[_hero.id] = _hero.localized_name)
            
            return this.setState({
                heroes
            })
        })
        .then(res => {
            
            q.all(steamIds.map(_steamId => _getHeroData({ accountId: _steamId })))
            .then(res => {
                let heroData = res.map(_heroData => _heroData.data)
                // Sort Hero Data for each player by most games and highest win rate
                heroData = heroData.map(_playerHeroData => {

                    let highestWinrate = {games: 1, win: 0}
                    let mostWins = { win: 0 }

                    _playerHeroData.map(_heroData => {
                        // check for mostWins
                        if (_heroData.win > mostWins.win) {
                            mostWins = _heroData
                        }
                        // check for highestWinRate (min 30 games)
                        if ( (_heroData.games > 30) && (_heroData.win / _heroData.games) > (mostWins.win / mostWins.games)) {
                            highestWinrate = _heroData
                        }
                    })
                    // append hero name
                    highestWinrate = {
                        ...highestWinrate,
                        heroName: this.state.heroes[highestWinrate.hero_id]
                    }

                    mostWins = {
                        ...mostWins,
                        heroName: this.state.heroes[mostWins.hero_id]
                    }

                    console.log({ highestWinrate, mostWins })

                    return {
                        highestWinrate,
                        mostWins
                    }
                    
                })

                console.log({heroData})
                this.setState({
                    heroData,
                })
            })

        })

    }

    renderProfileTable = () => {

        const { playerData, heroData } = this.state

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
            }, {
                title: 'Most Wins',
                dataIndex: 'profile',
                render: (profile, record, index) => 
                <div>
                    <p>{heroData[index] && heroData[index].mostWins.heroName}</p>
                    <p>{heroData[index] && heroData[index].mostWins.win}</p>
                </div> 
            }, {
                title: 'Highest Win Rate',
                dataIndex: 'profile',
                render: (profile, record, index) => 
                <div>
                    <p>{heroData[index] && heroData[index].highestWinrate.heroName}</p>
                    <p>{heroData[index] && heroData[index].highestWinrate.win/heroData[index].highestWinrate.games}</p>
                </div> 
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