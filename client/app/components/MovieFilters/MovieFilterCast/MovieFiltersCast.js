import React, {PropTypes, Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import debounce from 'lodash/debounce';
import deburr from 'lodash/deburr';
import lowerCase from 'lodash/lowerCase';

class MovieCastAutoComplete extends Component {
  static propTypes = {
    people: PropTypes.array,
    onSearch: PropTypes.func,
    onSelect: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      searchText: ''
    };
    this.debounceOnSearch = debounce((value, props) => {
      props.onSearch(value)
    }, 500);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  }

  onUpdateInput(value) {
    this.setState({
      searchText: value
    });
    this.debounceOnSearch(value, this.props);
  }

  onNewRequest(person) {
    const {onSelect} = this.props;
    this.setState({
      searchText: ''
    });
    onSelect(person._id);
  }

  filter(searchText, key) {
    return searchText !== '' && deburr(lowerCase(key)).indexOf(deburr(lowerCase(searchText))) !== -1;
  }

  render() {
    const {people} = this.props;
    const {searchText} = this.state;

    return (
      <AutoComplete
        hintText="Add cast"
        dataSource={people}
        dataSourceConfig={{text: 'name', value: '_id'}}
        onUpdateInput={this.onUpdateInput.bind(this)}
        onNewRequest={this.onNewRequest.bind(this)}
        filter={this.filter}
        searchText={searchText}
        floatingLabelText="Cast"
        fullWidth={true}
      />
    );
  }
}

export default MovieCastAutoComplete;
