import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class AddDashboardForm extends Component {
  constructor(props) {
    super(props);
    var sectionArr = this.props.sections.map((str)=>{
      return {
        label: str,
        value: str
      }
    })
    this.state = {
      error:[],
      selected_id: null,
      selected_value: null,
      selected_description: null,
      selected_title: null,
      selected_link: null,
      selected_section: null,
      selected_groups:[],
      selected_item:{},
      sections: sectionArr
    }
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleNewOption = this.handleNewOption.bind(this);
    this.handleOnAdd = this.handleOnAdd.bind(this);
    this.handleOnCancel = this.handleOnCancel.bind(this);
  }
  handleSelectionChange(type, option){
    this.setState({
      error: []
    });
    switch(type) {
      case 'dashboard':
        const selected_id =  option ? option.dashboard_id : null;
        const selected_value =  option ? option.value : null;
        const selected_title =  option ? option.label : null;
        const selected_link =  option ? option.dashboard_link : null;
        const selected_description =  option ? option.dashboard_description : null;
        this.setState({
          selected_id: selected_id,
          selected_value: selected_value,
          selected_title: selected_title,
          selected_link: selected_link,
          selected_description: selected_description
        });
        break;
      case 'section':
        var value = option ? option.value : null;
        this.setState({ selected_section: value});
        break;
      case 'group':
        // this.setState({ newItem.: option});
        break;
      default:
        return;
    }
  }
  handleNewOption(type, option) {
    switch(type) {
      case 'section':
        this.state.sections.push(option)
        this.setState({
          sections: this.state.sections
        })
        break;
      default:
        return;
    }
  }
  handleOnAdd() {
    let newDashboard = {
      section: this.state.selected_section,
      groups: this.state.selected_groups,
      dashboard_id: this.state.selected_id,
      dashboard_title: this.state.selected_title,
      dashboard_link: this.state.selected_link,
      dashboard_description: this.state.selected_description
    };
    var error = _validateSelection(newDashboard);
    this.setState({
      error: error
    })
    if(error.length === 0){
      this.props.handleOnAdd(newDashboard).then((resp)=>{
        if(this.props.error){
          this.setState({
            error: [this.props.error]
          });
          return;
        }
        this.props.handleOnCancel();
      }, () => {
        if(this.props.error){
          this.setState({
            error: [this.props.error]
          });
          return;
        }
      });
    }
  }
  handleOnCancel() {
    this.props.handleOnCancel();
  }
  render () {
    return (
      <div className="popupMain">
        <h1 className="popupTitle">Add New Dashbaord to List</h1>
        <div className="stroke"></div>
        <div className="popupSection popupErrorSection">
          {
          this.state.error.map((msg) => {
            return (
              <div key={msg} className="popupError">{msg}</div>
            );
          })
        }
        </div>
        <div className="popupSection">
          <div className="popupSubTitle">Section</div>
          <div className="popupSubTitleNotes">
            # Please select one from list or enter in the box to create new
          </div>
          <Select.Creatable
            name="form-field-name"
            multi={false}
            value={this.state.selected_section}
            placeholder="Select One Opiton Or Type to Create New"
            onChange={(option)=>{
              this.handleSelectionChange('section', option)
            }}
            onNewOptionClick={(option) => {
              this.handleNewOption('section', option);
            }}
            options={[...this.state.sections]}
          />
        </div>
        <div className="popupSection">
          <div className="popupSubTitle">Dashboard</div>
          <Select
            name="form-field-name"
            multi={false}
            value={this.state.selected_value}
            placeholder="Select One Opiton Or Type to Create New"
            onChange={(option)=>{
              this.handleSelectionChange('dashboard', option)
            }}
            options={this.props.dashboards}
          />
          <div className="popupSubTitle">
            <span>Dashboard Link</span>
            <div className="popupSubInfo">{this.state.selected_link}</div>
          </div>
          <div className="popupSubTitle">
            <span>Dashboard Description</span>
            <div className="popupSubInfo">{this.state.selected_description}</div>
          </div>
        </div>
        <div className="popupSection">
          <button className="popupButton" onClick={this.handleOnCancel}>Cancel</button>
          <button className="popupButton" onClick={this.handleOnAdd}>Add</button>
        </div>
      </div>
    )
  }
}

AddDashboardForm.propTypes = {
  handleOnAdd: PropTypes.func,
  handleOnCancel: PropTypes.func,
  dashboards: PropTypes.array,
  groups: PropTypes.array,
  sections: PropTypes.array,
  error: PropTypes.string
};

var _validateSelection = function(dashboard){
  var error = []
  if(!dashboard.section){
    error.push('Please select section');
  }
  if(!dashboard.dashboard_id){
    error.push('Please select dashboard');
  }
  // if(dashboard.groups.length === 0){
  //   error.push('Please select groups');
  // }

  return error;
}
