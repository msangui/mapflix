import React, {PropTypes, Component} from 'react';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash';
import classNames from 'classnames';

class MovieFilter extends Component {
  static propTypes = {
    children: PropTypes.any,
    filterType: PropTypes.string,
    values: PropTypes.array,
    onRemove: PropTypes.func,
    selected: PropTypes.bool
  };

  render() {
    const {children, onRemove = () => {}, filterType, values, className, selected} = this.props;
    const styles = {
      chip: {
        margin: 4,
      },
      removeButton: {
        position: 'absolute'
      },
    };
    const chips = _.isArray(values) ? values.map((value, index) =>
      (
        <Chip onRequestDelete={onRemove.bind(null, filterType, value)} style={styles.chip} key={`filter-chip-${filterType}-${index}`}>
          <Avatar size={32}>{_.upperCase(_.first(filterType))}</Avatar>
          {value.toString()}
        </Chip>
      )
    ) : null;

    const removeButton = selected ? (
      <IconButton className="movie-filter__remove-filter"
                  style={styles.removeButton}
                  onClick={onRemove.bind(null, filterType, null)}>
        <ClearIcon />
      </IconButton>
    ) : null;

    return (
      <div className={classNames('movie-filter', className)}>
        {children}
        {removeButton}
        <div className="movie-filter__selected-filters">
          {chips}
        </div>
      </div>
    );
  }
}

export default MovieFilter;
