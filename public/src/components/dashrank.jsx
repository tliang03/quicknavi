//Library
import React, { Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//Actions Entry
import * as actions from '../actions'
//CSS Styles
import '../styles/main.css'
import addIcon from '../images/add.png';
//Components
import Header from './dashheader';
import List from './dashlist';
import Modal from 'react-modal';

const mapStateToProps = (state) => {
  const { dashboards, ranklist, roles, sections, error } = state;
  return {
    dashboards: dashboards,
    ranklist: ranklist,
    roles: roles,
    sections: sections,
    error: error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    _addDashboard: (list, obj) => {
      return dispatch(actions.addDashboard(list, obj));
    },
    _deleteDashboard: (key, section) => {
      return dispatch(actions.deleteDashboard(key, section))
    },
    _searchAllList:() => {
      return dispatch(actions.searchAllList());
    },
    _searchAllDashboards: () => {
      return dispatch(actions.searchAllDashboards())
    },
    _searchAllRoles: () => {
      return dispatch(actions.searchAllRoles())
    },
    _searchAllSections: () => {
      return dispatch(actions.searchAllSections())
    }
  };
}

class DashboardRank extends Component {
  constructor(props) {
    super(props);
    this.state={
      hasError: false,
      errormsg: '',
      expandedSection: []
    }
    this.initializePopup = this.initializePopup.bind(this);
    this.initializeList = this.initializeList.bind(this);
    this.addDashboard = this.addDashboard.bind(this);
    this.deleteDashboard = this.deleteDashboard.bind(this);
    this.showErrorPopup = this.showErrorPopup.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.initializeList();
    Modal.setAppElement('body');
  }

  initializeList(){
    this.props._searchAllList().then(()=>{
      if(this.props.error) {
        this.showErrorPopup(this.props.error);
        return;
      }
      this.setState({
        expandedSection: Object.keys(this.props.ranklist)
      })
    }, ()=> {
      if(this.props.error) {
        this.showErrorPopup(this.props.error);
      }
    })
  }

  initializePopup() {
    let promises = [
      this.props._searchAllDashboards(),
      this.props._searchAllSections()]
    if(this.props.hasXpack) {
      promises.push(this.props._searchAllRoles())
    }
    return Promise.all(promises);
  }

  addDashboard(newItem){
    return this.props._addDashboard(this.props.ranklist, newItem).then(()=>{
      if(this.props.error) {
        this.showErrorPopup(this.props.error);
        return;
      }
      this.setState({
        expandedSection: [newItem.section]
      });
    })
  }

  deleteDashboard(key, section) {
    return this.props._deleteDashboard(key, section).then(()=>{
      if(this.props.error){
        this.showErrorPopup(this.props.error)
      }
    });
  }

  showErrorPopup(msg){
    this.setState({
      hasError : true,
      errormsg: msg
    })
  }

  closeModal(){
    this.setState({
      hasError : false
    })
  }

  render() {
    return (
      <div className="dashRank" id="dashMain">
        <Header
          hasXpack={this.props.hasXpack}
          dashboards={this.props.dashboards}
          error={this.props.error}
          adderror={this.props.error}
          roles={this.props.roles}
          sections={this.props.sections}
          errormsg={this.state.errormsg}
          initialize={this.initializePopup}
          handleOnAdd={this.addDashboard}
          handleError={this.showErrorPopup}/>
        <div className={`${Object.keys(this.props.ranklist).length ? 'hidden': ''} stroke` }></div>
        <div className="dashContent">
          <List
            expandedSection={this.state.expandedSection}
            ranklist={this.props.ranklist}
            deleteDashboard={this.deleteDashboard} />
        </div>
        <div className={`${Object.keys(this.props.ranklist).length ? 'hidden': ''} emptyMessage` }>
          <div>No Dashboard added to List.<br></br>
            Please click
            <img id="addIcon" width="20" src={addIcon} alt="" />
             button on the header to start.</div>
        </div>
        <Modal
          isOpen={this.state.hasError}
          onRequestClose={this.closeModal}
          className={"popupErrorModal"}
          overlayClassName={"popupErrorOverlay"}
          >
          <div>
            <p className="popupErrorTitle">Please check below error(s)</p>
            <div className="stroke"></div>
            <div className="popupErrorDetail">{this.state.errormsg}</div>
          </div>
        </Modal>
      </div>

    );
  }
}

DashboardRank.propTypes = {
  hasXpack: PropTypes.bool
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRank);
