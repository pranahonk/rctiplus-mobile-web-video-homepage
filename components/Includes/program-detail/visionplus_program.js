import React from "react"
import Link from "next/link"
import { withRouter } from "next/router"

import { userAgents, getUserAgent } from "../../../utils/helpers"
import { redirectToVisionPlus } from '../../../utils/firebaseTracking';
import "../../../assets/scss/components/visionplus_program.scss"

export default class VisionPlusProgram extends React.Component {
  state = {
    visplusLink: "",
    androidLink: "https://www.visionplus.id/page?src=rpl",
    iosLink: "https://www.visionplus.id/?src=rpl",
  }

  componentDidMount() {
    this.generateVisplusLink()
  }
  
  generateVisplusLink() {
    if (this.state.visplusLink) return
    this.setState({
      visplusLink: getUserAgent() === userAgents.ANDROID ? this.state.androidLink : this.state.iosLink
    })
  }

  render () {
    const user = this.props.user ? this.props.user.data : null

    return (
      <div style={{background: "#3a3a3a"}}>
        <div id="visionplus_program">
          <p className="visplus_child">
            Semua episode sebelumnya dapat disaksikan secara lengkap di aplikasi Vision+.
          </p>
          <Link href={this.state.visplusLink}>
            <a 
              target="blank"
              onClick={() => redirectToVisionPlus(user)} 
              className="visplus_child">
                Go To Vision+
            </a>
          </Link>
        </div>
      </div>
    )
  }
}