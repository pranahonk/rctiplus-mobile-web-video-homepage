import React from 'react';
import { connect } from 'react-redux';
import registerActions from '../../../redux/actions/registerActions';
import '../../../assets/scss/components/signup.scss';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  FormFeedback,
  InputGroup,
  InputGroupAddon, 
  InputGroupText
} from 'reactstrap';
import classnames from 'classnames';

class TabSignup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      phone_number_invalid: false,
      email_invalid: false
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  render() {
    return (
      <div className="nav-tab-wrapper">
        <Nav tabs>
          <NavItem className="nav-signup-item">
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1');
              }}
            >
              Phone Number
            </NavLink>
          </NavItem>
          <NavItem className="nav-signup-item">
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2');
              }}
            >
              Email
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <FormGroup className="frmInput1">
                  <Label for="email">Phone Number</Label>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="inpt-form addon-left">+62</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      className="inpt-form addon-left-input"
                      type="text"
                      name="text"
                      id="phone_number"
                      placeholder="Enter your phone number"
                      invalid={this.state.phone_number_invalid}
                      onChange={e => this.props.setUsername(e.target.value)}/>
                    <FormFeedback>Phone number is already taken</FormFeedback>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <FormGroup className="frmInput1">
                  <Label for="email">Email</Label>
                  <InputGroup>
                    <Input
                      className="inpt-form"
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Enter email"
                      invalid={this.state.email_invalid}
                      onChange={e => this.props.setUsername(e.target.value)}/>
                    <FormFeedback>Email is already taken</FormFeedback>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default connect(state => state, registerActions)(TabSignup);

// const Example = props => {
//   const [activeTab, setActiveTab] = useState('1');

//   const toggle = tab => {
//     if (activeTab !== tab) setActiveTab(tab);
//   };

//   return (
//     <div className="nav-tab-wrapper">
//       <Nav tabs>
//         <NavItem className="nav-signup-item">
//           <NavLink
//             className={classnames({ active: activeTab === '1' })}
//             onClick={() => {
//               toggle('1');
//             }}
//           >
//             Phone Number
//           </NavLink>
//         </NavItem>
//         <NavItem className="nav-signup-item">
//           <NavLink
//             className={classnames({ active: activeTab === '2' })}
//             onClick={() => {
//               toggle('2');
//             }}
//           >
//             Email
//           </NavLink>
//         </NavItem>
//       </Nav>
//       <TabContent activeTab={activeTab}>
//         <TabPane tabId="1">
//           <Row>
//             <Col sm="12">
//               <FormGroup className="frmInput1">
//                 <Label for="email">Phone Number</Label>
//                 <Input
//                   className="inpt-form"
//                   type="text"
//                   name="text"
//                   id="phone_number"
//                   placeholder="Enter your phone number"
//                 />
//               </FormGroup>
//             </Col>
//           </Row>
//         </TabPane>
//         <TabPane tabId="2">
//           <Row>
//             <Col sm="12">
//               <FormGroup className="frmInput1">
//                 <Label for="email">Email</Label>
//                 <Input
//                   className="inpt-form"
//                   type="text"
//                   name="email"
//                   id="email"
//                   placeholder="Enter email"
//                 />
//               </FormGroup>
//             </Col>
//           </Row>
//         </TabPane>
//       </TabContent>
//     </div>
//   );
// };

// export default Example;
