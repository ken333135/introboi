import React from 'react';

import {
    Row,
    Col
} from 'antd'

class Heatmap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            colSpan: Math.floor(24/(this.props.steamIds.length+1))
        }
    }

    render() {

        const {playerData} = this.props
        const {colSpan} = this.state

        return(
            <div>
                <Row>
                    <Col span={colSpan}></Col>
                    {playerData.map(_playerData => {
                        return <Col span={colSpan}>{this.heatmapAvatar(_playerData.profile.avatar)}</Col>
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

        const {winlossData} = this.props
        const {colSpan} = this.state

        return (
            <Row>
                <Col span={colSpan}>{this.heatmapAvatar(_playerData.profile.avatar)}</Col>
                {winlossData[index] && winlossData[index].map(_winlossData => {
                    return <Col span={colSpan}>{this.heatmapBox(_winlossData.data)}</Col>
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

        const percentageWinLoss = (data.win/(data.win+data.lose) || 0).toFixed(2) * 100

        return (
            <div className='heatmap-box heatmap-data'>
                <p>{`${data.win}/${data.lose}`}</p>
                <p>{`${percentageWinLoss}%`}</p>
            </div>
        )
    }
}

export default Heatmap