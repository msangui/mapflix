import React, {PropTypes, Component} from 'react';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import isArray from 'lodash/isArray';
import upperCase from 'lodash/upperCase';
import first from 'lodash/first';

class MovieFilter extends Component {
  static propTypes = {
    children: PropTypes.any,
    filterType: PropTypes.string,
    values: PropTypes.array,
    onRemove: PropTypes.func,
    selected: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const {children, onRemove = () => {}, filterType, values, className, selected} = this.props;
    const styles = {
      chip: {
        margin: 4
      },
      removeButton: {
        position: 'absolute'
      },
    };
    const chips = isArray(values) ? values.map((value, index) =>
      (
        <Chip className="movie-filter-chip"
              onRequestDelete={onRemove.bind(null, filterType, value)}
              style={styles.chip}
              key={`filter-chip-${filterType}-${index}`}>
          <Avatar size={32}>{upperCase(first(filterType))}</Avatar>
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
