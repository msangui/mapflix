import React, {PropTypes, Component} from 'react';
import {grey800, amber700} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog/Dialog';
import {List, ListItem} from 'material-ui/List';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router-dom';
import MovieAwardIcon from '../MovieAwardIcon/MovieAwardIcon';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class MovieAwards extends Component {
  static propTypes = {
    awards: PropTypes.array,
    name: PropTypes.string
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

    const awardThumbnails = _.orderBy(awards, ['eventType', 'winner'], ['asc', 'desc'])
      .filter(award => award.eventType !== 'ev0000123')
      .map((award, index) => (
        <span title={award.name}
              key={`award-${award.eventType}-${_.kebabCase(award.name)}-${index}`}>
          <MovieAwardIcon color={award.winner ? amber700 : grey800}
                          size={50}
                          eventType={award.eventType} />
        </span>
      )).concat(
        _.orderBy(awards, ['eventType', 'winner'], ['asc', 'desc'])
          .filter(award => award.eventType === 'ev0000123')
          .map((award, index) => (
            <span title={award.name}
                  key={`award-${award.eventType}-${_.kebabCase(award.name)}-${index}`}>
              <MovieAwardIcon color={award.winner ? amber700 : grey800}
                          size={30}
                          eventType={award.eventType} />
        </span>
        ))
      );

    const awardsElement = _.orderBy(awards, ['eventType', 'winner'], ['asc', 'desc']).map((award, index) => {
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
              to={`/?awards=${award.eventType},${award.winner ? 'winner' : 'nominated'},${_.kebabCase(award.name)}`}>
          <ListItem title={award.name}
                    secondaryText={title}
                    disabled={true}
                    leftAvatar={icon}
                    secondaryTextLines={1}/>
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
          <Paper style={style.paper} zDepth={0}>
            <List>
              {_.take(awardsElement, _.ceil(awardsElement.length / 2))}
            </List>
          </Paper>
          <Paper style={style.paper} zDepth={0}>
            <List>
              {_.takeRight(awardsElement, awards.length - _.ceil(awardsElement.length / 2))}
            </List>
          </Paper>
        </Dialog>
      </div>
    );
  }
}

export default MovieAwards;
