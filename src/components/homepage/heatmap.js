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

        const percentageWinLoss = parseInt( (data.win/(data.win+data.lose) || 0).toFixed(2) * 100 )
        const redColor = percentageWinLoss <= 50 ? Math.floor(((percentageWinLoss)*2/100)*255) : 0
        const greenColor = percentageWinLoss > 50 ? Math.floor(((percentageWinLoss-50)*2/100)*255) : 0
        
        return (
            <div className='heatmap-box heatmap-data' style={{backgroundColor: `rgba(${redColor},${greenColor},0,0.4)`}}>
                <p>{`${data.win}/${data.lose}`}</p>
                <p>{`${percentageWinLoss}%`}</p>
            </div>
        )
    }
}

export default Heatmap