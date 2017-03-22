import React, {PropTypes, Component} from 'react';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';
import Awards from '../../../constants/Awards';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

class MovieFilterAwards extends Component {
  static propTypes = {
    removeAward: PropTypes.func,
    selectedAwards: PropTypes.array,
    selectAward: PropTypes.func,
    toggleAward: PropTypes.func
  };

  onToggle(eventType) {
    const {toggleAward} = this.props;
    toggleAward(eventType);
  }

  isSelected(eventType) {
    const {selectedAwards} = this.props;
    return _.indexOf(selectedAwards, eventType) !== -1 || _.indexOf(selectedAwards, `${eventType},winner`) !== -1;
  }

  isWinner(eventType) {
    const {selectedAwards} = this.props;
    return _.indexOf(selectedAwards, `${eventType},winner`) !== -1;
  }

  onCheck(eventType, event, isChecked) {
    const {selectAward, removeAward} = this.props;
    return isChecked ? removeAward(eventType) : selectAward(eventType);

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
        </List>
      </div>
    );
  }
}

export default MovieFilterAwards;
