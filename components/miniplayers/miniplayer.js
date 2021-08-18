import { withRouter } from "next/router"
import React from "react"
import dynamic from 'next/dynamic'
import "../../assets/scss/components/miniplayer.scss"
import { connect } from "react-redux"
import miniplayerActions from "../../redux/actions/miniplayerActions"

const JwPlayer = dynamic(() => import('../Includes/Player/JwPlayer'))

class MiniPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      storageKey: "miniplayer_data",
      positionKey: "miniplayer_last_duration",
      isStopped: false,
      isPaused: false,
      renderMiniPlayer: false,
      data: {},
      descriptionPlayer: {},
      playerStatus: {},
      playerCustomData: {},
      seekPosition: 0
    }
    this.miniPlayer = React.createRef()
  }

  componentDidMount () {
    const isNotRenderAble = this.validateRoute()
    this.setState({ renderMiniPlayer: !isNotRenderAble })
    
    if (!isNotRenderAble) {
      const storageItem = JSON.parse(localStorage.getItem(this.state.storageKey))
      this.setState({ data: storageItem.playerData })
      this.setState({ descriptionPlayer: storageItem.playerDesc })
      this.setState({ playerStatus: storageItem.playerStatus })
      this.setState({ playerCustomData: storageItem.playerCustomData })

      this.setState(() => ({ seekPosition: +localStorage.getItem(this.state.positionKey) }))
    }
  }

  validateRoute() {
    const isNotRenderAble = (
      this.props.router.route === "/tv" ||
      this.props.router.query.content_id ||
      !localStorage.getItem(this.state.storageKey)
    )

    if (isNotRenderAble) {
      localStorage.removeItem(this.state.storageKey)
      localStorage.removeItem(this.state.positionKey)
    }
    return isNotRenderAble
  }

  generateMiniPlayerArticle() {
    const source = this.state.descriptionPlayer
    const episode = `E${`0${source.episode}`.slice(-2)}:S${`0${source.season}`.slice(-2)}`
    const programName = `${episode} ${source.title}`
    const programTitle = source.program_title
    
    return (
      <article>
        <p>{programName}</p>
        <p>{programTitle}</p>
      </article>
    )
  }

  closeMiniPlayer() {
    localStorage.removeItem(this.state.storageKey)
    localStorage.removeItem(this.state.positionKey)

    this.setState({ renderMiniPlayer: false })
  }

  render() {
    if (!this.state.renderMiniPlayer) return null

    return (
      <main id="miniplayer_wrapper">
        <JwPlayer
          data={this.state.data}
          isPaused={this.state.isPaused}
          scrolling={true}
          isStopped={this.state.isStopped}
          seekPosition={this.state.seekPosition}
          customData={this.state.playerCustomData}
          geoblockStatus={this.state.playerStatus}
          handlePlaying={(e) => this.setState({ isStopped: e })}
          getVideoLastPosition={(e) => this.props.dispatch(miniplayerActions.setVideoLastDuration(e))}/>

        <section
          ref={this.miniPlayer}
          className="miniplayer">
          
          {this.generateMiniPlayerArticle()}
          
          <div>
            <button
              className="miniplayer__btn"
              onClick={() => this.setState({ isPaused: !this.state.isPaused })}>
              {
                !this.state.isPaused 
                  ? (
                    <svg width="20" height="15" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 0C0.447723 0 0 0.447716 0 1V19C0 19.5523 0.447723 20 1 20H4C4.55228 20 5 19.5523 5 19V1C5 0.447716 4.55228 0 4 0H1Z" fill="white"/>
                      <path d="M10 0C9.44772 0 9 0.447716 9 1V19C9 19.5523 9.44772 20 10 20H13C13.5523 20 14 19.5523 14 19V1C14 0.447716 13.5523 0 13 0H10Z" fill="white"/>
                    </svg>
                  )
                  : (
                    <svg width="20" height="15" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.3569 9.66839C15.9495 10.0643 15.9495 10.9354 15.3569 11.3313L1.9559 20.2856C1.29141 20.7296 0.400326 20.2533 0.400326 19.4542L0.400326 1.54553C0.400326 0.746364 1.29141 0.27007 1.9559 0.714067L15.3569 9.66839Z" fill="white"/>
                    </svg>
                  )
              }
            </button>

            <button
              className="miniplayer__btn"
              onClick={() => this.closeMiniPlayer()}>
              <svg width="20" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.924 0.397454C16.3926 -0.0711736 17.0891 -0.134486 17.4796 0.256034L19.601 2.37735C19.9915 2.76787 19.9282 3.46436 19.4595 3.93299L13.3405 10.052L19.2065 15.9179C19.6751 16.3865 19.7384 17.083 19.3479 17.4735L17.2266 19.5949C16.8361 19.9854 16.1396 19.9221 15.671 19.4534L9.80503 13.5875L4.18604 19.2065C3.71741 19.6751 3.02091 19.7384 2.63037 19.3479L0.509067 17.2266C0.118564 16.8361 0.181857 16.1396 0.650485 15.671L6.26947 10.052L0.397464 4.17994C-0.0711639 3.71131 -0.134488 3.01482 0.256015 2.6243L2.37735 0.502986C2.76786 0.112466 3.46436 0.175778 3.93299 0.644406L9.805 6.51643L15.924 0.397454Z" fill="white"/>
              </svg>
            </button>
          </div>
        </section>
      </main>
    )
  }
}

const mapStateToProps = state => {
  const { miniplayer } = state
  return { miniplayer }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MiniPlayer))