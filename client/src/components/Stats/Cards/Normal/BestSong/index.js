import React from 'react';
import { Tooltip, Paper } from '@material-ui/core';
import s from './index.module.css';
import API from '../../../../../services/API';
import IntervalModifier from '../../../../IntervalModifier';
import DataDisplayer from '../../../DataDisplayer';

class BestSong extends DataDisplayer {
  onInterChange = (field, value) => {
    this.setState({
      [field]: value,
    }, this.refresh);
  }

  refresh = async (cb) => {
    const { start, end } = this.state;

    const { data } = await API.mostListened(start, end, 'all');

    console.log(data);

    this.setState({
      stats: data,
    }, cb);
  }

  componentDidMount() {
    const { loaded } = this.props;

    this.refresh(loaded);
  }

  render() {
    const { stats } = this.state;

    if (!stats) return null;

    let name;
    let background;
    let counts;

    if (!stats.length || !stats[0].tracks.length) {
      name = 'No data';
      background = '/no_data.png';
      counts = 0;
    } else {
      name = stats[0].tracks[0].name;
      background = stats[0].tracks[0].album.images[0].url;
      counts = stats[0].counts[0];
    }

    return (
      <Paper className={s.root} style={{ backgroundImage: `url(${background})` }}>
        <IntervalModifier
          onStartChange={date => this.onInterChange('start', date)}
          onEndChange={date => this.onInterChange('end', date)}
          autoAbsolute
        />
        <Tooltip
          arrow
          placement="bottom"
          enterDelay={250}
          title={`You listened to this song ${counts} times`}
        >
          <div className={s.content}>
            <div className={s.text}>
              <div className={s.desc}>Best song</div>
              <div className={s.title}>{name}</div>
            </div>
          </div>
        </Tooltip>
      </Paper>
    );
  }
}

export default BestSong;
