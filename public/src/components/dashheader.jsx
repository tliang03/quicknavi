import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import AddDashboardForm from './add_dashboard_form';
import loading from '../images/loading.svg';
import addIcon from '../images/add.png';

export default class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        modalIsOpen : false,
        loadingClass: 'hidden'
      }
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.initialize = this.initialize.bind(this);
    }
    openModal() {
      this.setState({
        loadingClass: ''
      })
      this.initialize().then(values => {
        if(this.props.error) {
          this.props.handleError(this.props.error);
        } else {
          this.setState({
            modalIsOpen: true,
            loadingClass: 'hidden'
          });
        }
      });
    }
    closeModal() {
      this.setState({
        modalIsOpen: false
      })
    }
    initialize(){
      return this.props.initialize();
    }
    render() {
      return (
        <div className="dash_header">
          <center>
              <img id="loading" width="128" src={loading} alt=""
              className={`${this.state.loadingClass} loadingImg` } />
          </center>
          <span>Top Rated Dashboards</span>
          <button onClick={this.openModal} className="dashIcon">
            <img id="addIcon" width="20" src={addIcon} alt="" />
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            className={"popupModal"}
            overlayClassName={"popupOverlay"}
            >
            <AddDashboardForm
              error={this.props.adderror}
              dashboards={this.props.dashboards}
              groups={this.props.groups}
              sections={this.props.sections}
              handleOnCancel={this.closeModal.bind(this)}
              handleOnAdd={this.props.handleOnAdd} />
          </Modal>
        </div>
      );
    }
}

Header.propTypes = {
  dashboards: PropTypes.array,
  groups: PropTypes.array,
  sections: PropTypes.array,
  handleOnAdd: PropTypes.func,
  handleError: PropTypes.func,
  error: PropTypes.string,
  adderror: PropTypes.string
};
