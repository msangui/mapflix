import React, {PropTypes, Component} from 'react';
import {grey800, amber700} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog/Dialog';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router-dom';
import MovieAwardIcon from '../MovieAwardIcon/MovieAwardIcon';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import orderBy from 'lodash/orderBy';
import kebabCase from 'lodash/kebabCase';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';
import ceil from 'lodash/ceil';

class MovieAwards extends Component {
  static propTypes = {
    awards: PropTypes.array,
    name: PropTypes.string
  };

  static awardSizes = {
    ev0000123: 30,
    ev0000003: 40,
    ev0000292: 40
  };

  constructor() {
    super();
    this.state = {
      open: false
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  openDialog(event) {
    event.stopPropagation();
    this.setState({
      open: true
    });
  }

  closeDialog() {
    this.setState({
      open: false
    });
  }

  render() {
    const {awards = [], name} = this.props;

    const style = {
      paper: {
        display: 'inline-block',
        width: '50%',
        verticalAlign: 'top'
      },
      award: {

      }
    };

    const awardThumbnails = orderBy(awards, ['eventType', 'winner'], ['asc', 'desc'])
      .map((award, index) => (
        <span title={award.name}
              key={`award-${award.eventType}-${kebabCase(award.name)}-${index}`}>
          <MovieAwardIcon color={award.winner ? amber700 : grey800}
                          size={MovieAwards.awardSizes[award.eventType]}
                          eventType={award.eventType} />
        </span>
      ));

    const awardsElement = orderBy(awards, ['eventType', 'winner'], ['asc', 'desc']).map((award, index) => {
      const icon = (
        <Avatar size={40} backgroundColor={award.winner ? amber700 : grey800} icon={(
          <MovieAwardIcon {...award} size={40} color="white"/>
        )} />
      );

      const title = (
        <div style={style.award}>
          {award.name}
        </div>
      );

      return (
        <Link key={`award-item-${index}`}
              onClick={this.closeDialog.bind(this)}
              to={`/?awards=${award.eventType},${award.winner ? 'winner' : 'nominated'},${kebabCase(award.name)}`}>
          <ListItem title={award.name}
                    secondaryText={title}
                    disabled={true}
                    leftAvatar={icon}
                    secondaryTextLines={2}/>
        </Link>
      );
    });

    return (
      <div className="movie__awards" onClick={this.openDialog.bind(this)}>
        {awardThumbnails}
        <Dialog
          title={`Awards - ${name}`}
          modal={false}
          open={this.state.open}
          onRequestClose={this.closeDialog.bind(this)}
          autoScrollBodyContent={true}>
          <Paper className="movie__awards__list" style={style.paper} zDepth={0}>
            <List>
              {take(awardsElement, ceil(awardsElement.length / 2))}
            </List>
          </Paper>
          <Paper className="movie__awards__list" style={style.paper} zDepth={0}>
            <List>
              {takeRight(awardsElement, awards.length - ceil(awardsElement.length / 2))}
            </List>
          </Paper>
        </Dialog>
      </div>
    );
  }
}

export default MovieAwards;
