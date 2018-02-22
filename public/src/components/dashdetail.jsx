import React, {Component} from 'react'
import PropTypes from "prop-types";
import Modal from 'react-modal';
import DeleteDashboardForm from './delete_dashboard_form';
import trashIcon from '../images/trash.png';

export default class DashDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorModalIsOpen : false,
      section: null,
      dashboard_id : null,
      dashboard_section: null
    }
    this.handleDeleteDasboard = this.handleDeleteDasboard.bind(this);
    this.deleteDashboard = this.deleteDashboard.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  handleDeleteDasboard(evt){
    let target = evt.currentTarget;
    this.setState({
      dashboard_id: target.getAttribute('data-id'),
      dashboard_section: target.getAttribute('data-section')
    });
    this.openModal();
  }
  openModal() {
    this.setState({
      errorModalIsOpen: true
    });
  }
  closeModal() {
    this.setState({
      errorModalIsOpen: false
    })
  }
  deleteDashboard(key, section){
    this.props.deleteDashboard(key, section);
    this.setState({
      dashboard_id: null,
      dashboard_section: null
    })
    this.closeModal();
  }
  render() {
    return (
      <div>
        <table className="dash_detailtable">
          <tbody>
            {
              this.props.dashboards.map((item) => {
                let id = item.id;
                let title = item.dashboard_title;
                let description = item.dashboard_description;
                let link = item.dashboard_link;
                let section = item.section;
                return (
                  <tr key={id}>
                    <td className="title">
                      <a href={link}>{title}</a>
                    </td>
                    <td>
                      <span>{description}</span>
                    </td>
                    <td className="buttons">
                      <button
                        onClick={this.handleDeleteDasboard}
                        data-section={section}
                        data-id={id}
                        className="dashIcon">
                        <img id="trashIcon" width="20" src={trashIcon} alt="" />
                      </button>
                    </td>
                  </tr>
                )
              })
            }
        </tbody>
      </table>
      <Modal
        isOpen={this.state.errorModalIsOpen}
        onRequestClose={this.closeModal}
        className={"popupDeleteModal"}
        overlayClassName={"popupDeleteOverlay"}
        >
        <DeleteDashboardForm
          handleOnDelete={this.deleteDashboard}
          handleOnCancel={this.closeModal}
          id={this.state.dashboard_id}
          section={this.state.dashboard_section}
          />
      </Modal>
    </div>
    )
  }
}

DashDetail.propTypes = {
  dashboards: PropTypes.array,
  deleteDashboard: PropTypes.func
};
