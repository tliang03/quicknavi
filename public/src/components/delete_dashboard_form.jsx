import React, { Component} from 'react';
import PropTypes from 'prop-types';
import yesIcon from '../images/yesicon.png';
import noIcon from '../images/noicon.png';

export default class DeleteDashboardForm extends Component {
  constructor(props) {
    super(props);
    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.handleOnDelete = this.handleOnDelete.bind(this);
  }
  handleOnCancel() {
    this.props.handleOnCancel();
  }
  handleOnDelete(){
    this.props.handleOnDelete(this.props.id, this.props.section);
  }
  render () {
    return (
      <div className="popupDeleteMain">
        <div className="popupUpper">Are you sure you want to delete the dashboard?</div>
        <div className="stroke"></div>
        <div className="popupLower">
          <button onClick={this.handleOnDelete}><img alt="" src={yesIcon} />yes</button>
          <button onClick={this.handleOnCancel}><img alt="" src={noIcon} />no</button>
        </div>
      </div>
    )
  }
}

DeleteDashboardForm.propTypes = {
  id: PropTypes.string,
  handleOnDelete: PropTypes.func,
  handleOnCancel: PropTypes.func
};
