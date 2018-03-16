import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionItem } from 'react-sanfona';
import DashDetail from './dashdetail';
import titleIcon from '../images/thumbup.png';

export default class List extends Component {
    render() {
      return (
        <div className="dash_list">
          <Accordion allowMultiple>
            {Object.keys(this.props.ranklist).map(sectionKey => {
              let dashboards = this.props.ranklist[sectionKey];
              return (
                <AccordionItem
                  key={sectionKey}
                  titleTag="div"
                  title={
                    <div className="react-sanfona-item-title">
                      <img id="titleIcon" width="30" className="titleIcon" src={titleIcon} alt="" />
                      {sectionKey}
                    </div>
                  }
                  expanded={this.props.expandedSection.indexOf(sectionKey)>=0}>
                  <DashDetail
                    dashboards={dashboards}
                    deleteDashboard={this.props.deleteDashboard} />
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      );
    }
}

List.propTypes = {
  expandedSection: PropTypes.array,
  ranklist: PropTypes.object,
  deleteDashboard: PropTypes.func
};
