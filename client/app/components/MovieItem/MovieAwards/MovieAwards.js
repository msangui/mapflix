import React, {PropTypes, Component} from 'react';
import {grey800, yellow700} from 'material-ui/styles/colors';
import Oscar from '../../../style/svg/oscar';
import Bafta from '../../../style/svg/bafta';
import GoldenGlobe from '../../../style/svg/GoldenGlobe';
import Dialog from 'material-ui/Dialog/Dialog';
import {List, ListItem} from 'material-ui/List';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router-dom';

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

    const oscars = _.orderBy(awards, ['eventType', 'winner'], ['asc', 'desc'])
      .filter(award => award.eventType === 'ev0000003')
      .map((award, index) => (
        <span title={award.name} key={`award-${award.eventType}-${_.kebabCase(award.name)}`}>
          <Oscar title={award.name}
                 key={`oscar-winner-${index}`}
                 viewBox="0 0 200 500"
                 style={{width: 15, height: 50}}
                 preserveAspectRatio="xMinYMin meet" color={award.winner ? yellow700 : grey800}/>
        </span>
      ));

    const goldenGlobes = _.orderBy(awards, ['eventType', 'winner'], ['asc', 'desc'])
      .filter(award => award.eventType === 'ev0000292')
      .map((award, index) => (
        <span title={award.name} key={`award-${award.eventType}-${_.kebabCase(award.name)}`}>
          <GoldenGlobe key={`golden-globe-winner-${index}`}
                       viewBox="0 0 200 500"
                       style={{width: 19, height: 50}}
                       preserveAspectRatio="xMinYMin meet" color={award.winner ? yellow700 : grey800}/>
        </span>
      ));


    const baftas = _.orderBy(awards, ['eventType', 'winner'], ['asc', 'desc'])
      .filter(award => award.eventType === 'ev0000123')
      .map((award, index) => (
        <span title={award.name} key={`award-${award.eventType}-${_.kebabCase(award.name)}`}>
          <Bafta title={award.name}
                 viewBox="0 120 500 500"
                 style={{height: 50}}
                 key={`bafta-winner-${index}`} color={award.winner ? yellow700 : grey800}/>
        </span>
      ));

    const awardsElement = _.orderBy(awards, ['eventType', 'winner'], ['asc', 'desc']).map((award, index) => {
      const icon = ((eventType, winner) => {
          switch (eventType) {
            case 'ev0000003':
              return (
                <Avatar size={50} backgroundColor={winner ? yellow700 : grey800} icon={(
                  <Oscar key={`oscar-nominated-${index}`}
                         viewBox="-30 -50 200 500"
                         style={{width: 15, height: 50}}
                         preserveAspectRatio="xMinYMin meet"/>
                )} />
              );
            case 'ev0000292':
              return (
                <Avatar size={50} backgroundColor={winner ? yellow700 : grey800} icon={(
                  <GoldenGlobe key={`golden-globe-nominated-${index}`}
                               viewBox="0 -20 144 360"
                               style={{width: 15, height: 50}}
                               preserveAspectRatio="xMinYMin meet"/>
                )} />
              );
            case 'ev0000123':
              return (
                <Avatar size={50} backgroundColor={winner ? yellow700 : grey800} icon={(
                  <Bafta viewBox="0 -120 500 500"
                         style={{height: 50}}
                         preserveAspectRatio="xMinYMin meet"/>
                )} />
              )
          }
        }
      )(award.eventType, award.winner);

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
        {oscars}
        {goldenGlobes}
        {baftas}
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
