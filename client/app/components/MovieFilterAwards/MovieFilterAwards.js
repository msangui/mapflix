import React, {PropTypes, Component} from 'react';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';
import Awards from '../../constants/Awards';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import MovieAwardIcon from '../MovieAwardIcon/MovieAwardIcon';
import Avatar from 'material-ui/Avatar';
import {grey800, yellow700} from 'material-ui/styles/colors';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import indexOf from 'lodash/indexOf';
import words from 'lodash/words';
import capitalize from 'lodash/capitalize';


class MovieFilterAwards extends Component {
  static propTypes = {
    removeAward: PropTypes.func,
    selectedAwards: PropTypes.array,
    selectAward: PropTypes.func,
    toggleAward: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onToggle(eventType) {
    const {toggleAward} = this.props;
    toggleAward(eventType);
  }

  isSelected(eventType) {
    const {selectedAwards} = this.props;
    return indexOf(selectedAwards, eventType) !== -1 || indexOf(selectedAwards, `${eventType},winner`) !== -1;
  }

  isWinner(eventType) {
    const {selectedAwards} = this.props;
    return indexOf(selectedAwards, `${eventType},winner`) !== -1;
  }

  onCheck(eventType, event, isChecked) {
    const {selectAward, removeAward} = this.props;
    const award = this.isWinner(eventType) ? `${eventType},winner` : eventType;
    return isChecked ? removeAward(award) : selectAward(eventType);

  }

  render() {
    const style = {
      root: {
        width: 280
      },
      header: {
        color: 'inherit',
        cursor: 'normal',
        paddingLeft: 0
      },
      item: {
        padding: 0
      },
      chip: {
        margin: 4,
      },
    };

    const {selectedAwards = [], removeAward} = this.props;

    const extraFilters = selectedAwards
      .filter(selectedAward => selectedAward.split(',').length > 2)
      .map((selectedAward, index) => {
        const [eventType, nominatedStatus, name] = selectedAward.split(',');

        const winner = nominatedStatus === 'winner';

        const removeButton = (
          <IconButton onClick={removeAward.bind(this, selectedAward)} style={{top: 7, right: -9}}>
            <ClearIcon />
          </IconButton>
        );

        const awardAvatar = (
          <Avatar size={30} backgroundColor={winner ? yellow700 : grey800} icon={(
            <MovieAwardIcon eventType={eventType} size={30} color="white"/>
          )}/>
        );

        const awardName = words(name).map(word => capitalize(word)).join(' ');
        return (
          <ListItem
            key={`extra-filter-awards-${index}`}
            secondaryText={awardName}
            innerDivStyle={{position: 'relative', padding: '20px 38px 16px 50px'}}
            rightIconButton={removeButton}
            leftAvatar={awardAvatar} />
        );
      });

    const awardsElement = Awards
      .map((award, index) => {
        const checked = this.isSelected(award.eventType);
        const winnerToggle = checked ? (
          <Toggle toggled={this.isWinner(award.eventType)} onToggle={this.onToggle.bind(this, award.eventType)} />
        ) : null;
        return (
          <ListItem rightToggle={winnerToggle}
                    leftCheckbox={<Checkbox checked={checked} onCheck={this.onCheck.bind(this, award.eventType)}/>}
                    primaryText={award.name}
                    key={`filter-selected-awards-${index}`}/>
        )
      });
    return (
      <div className="movie-filter-awards">
        <List style={style.root}>
          <MenuItem primaryText="Award" secondaryText="Won" disabled={true} style={style.header}/>
          {awardsElement}
          {extraFilters}
        </List>
      </div>
    );
  }
}

export default MovieFilterAwards;
