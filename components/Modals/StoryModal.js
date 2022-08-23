import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"

import { RESOLUTION_IMG } from '../../config'
import newsCountView from "../../redux/actions/newsCountView"

import "../../assets/scss/components/stories.scss"

import StoryAds from '../../components/Includes/Banner/StoryAds';
import Alert from "reactstrap/lib/Alert"
import { set } from "lodash"


function storyModal(props) {
  const progressBarWrapper = useRef(null)
  const modal = useRef(null)
  const [ activeIndex, setActiveIndex ] = useState(0)
  const [ player, setPlayer ] = useState(null)
  const [ slot, setSlot ] = useState(5)

  const timesec = 5
  const storyModalPlayerID = "storymodal-player"
  const options = {
    autostart: 'viewable',
    mute: true,
    file: null,
    hlsjsdefault: true,
    aspectratio: '16:9',
    stretching: 'uniform',
    width: '100%',
    height: 180,
    controls: false
  }
  const swipe = {
    clientX: 0
  }


  useEffect(() => {
    if (props.story.story) setActiveProgressbar()
  }, [
    props.story.program_id,
    activeIndex,
  ])

  if (!props.story.story) return null

  const setActiveProgressbar = () => {

    if(props.story.__typename == 'StoryData'){
      // function to listen between switching of story contents
      if (!progressBarWrapper.current) return
      if (activeIndex > props.story.story.length - 1) return
      document.getElementById("nav-footer").style.display = "none"

      const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")


      if (props.story.story[activeIndex].seen) {
        progressBars[activeIndex].classList.add("active")
        progressBars[activeIndex].children[0].style.animation = `unset`
        setActiveIndex(activeIndex + 1)
        return
      }

      mountJwplayer()

    }else if(props.story.__typename == 'StoryGPT'){
      // function to listen between switching of story contents
      if (!progressBarWrapper.current) return
      if (activeIndex > props.story.story.length - 1) return
      document.getElementById("nav-footer").style.display = "none"

      const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

      if (props.story.story[activeIndex].seen) {
        progressBars[activeIndex].classList.add("active")
        progressBars[activeIndex].children[0].style.animation = `unset`
        setActiveIndex(activeIndex + 1)
        return
      }

      mountGpt()
    }

    
  }

  const handleAnimationEnd = _ => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

    if ((activeIndex === props.story.story.length - 1)) {
      navigateStory(progressBars, "right")
      setActiveIndex(0)
    }
    else if (activeIndex < props.story.story.length - 1) {
      setActiveIndex(activeIndex + 1)
      progressBars[activeIndex].children[0].style.animation = "unset"
    }
  }

  const touchStart = (e) => {
    pauseProgressBar()
    if (player) player.pause()
    swipe.clientX = e.touches[0].clientX
  }

  const touchMove = (e) => {
    const distance = e.touches[0].clientX - swipe.clientX
    modal.current.style.transform = `translateX(${distance}px)`
  }

  const touchEnd = (e) => {
    const distance = e.changedTouches[0].clientX - swipe.clientX
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

    runProgressBar()
    if (player) player.play()

    modal.current.style.transform = `unset`
    swipe.clientX = 0

    if (distance < -100) {
      navigateStory(progressBars, "right")
      setActiveIndex(0)
    }
    if (distance > 100) {
      navigateStory(progressBars, "left")
      setActiveIndex(0)
    }
  }


  const seenStory = _ => {
    return {
      ...props.story,
      story: props.story.story.map((item, i) => {
        let story = item
        if (i < activeIndex) story = { ...item, seen: true }
        return story
      })
    }
  }
  
  const closeModal = () => {
    props.onClose(seenStory())
    setActiveIndex(0)
  }

  const removeModalPlayer = _ => {
    player.remove()
    setPlayer(null)
  }



  const renderImageStory = _ => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].classList.add("active")
    progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${timesec}s`

    document.getElementById("loading-stories").style.display = "none"
    document.getElementById("close-stories").style.removeProperty("display")
  }

  const mountGpt = () => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

    renderImageStory()

    document.getElementById("mute-toggler").style.display = "none"
    document.getElementById("stories-content").style.display = "none"
    document.getElementById("loading-stories").style.removeProperty("display")
    document.getElementById("close-stories").style.display = "none"

    window.googletag = window.googletag || {cmd: []};

    googletag.cmd.push(function() {

      // Define the first slot
      setSlot(googletag.defineSlot(props.story.story[activeIndex].path,['fluid'],props.story.story[activeIndex].div_gpt)
          .addService(googletag.pubads()))

      var countSlotRendeEnded = 0
      var countSlotResponseReceived = 0
      var countSlotRequested = 0
      var countImpressionViewable = 0

      const videoContentId = document.getElementById(props.story.story[activeIndex].div_gpt)


      googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        if(countSlotRendeEnded == 0){
          if (event.isEmpty) {
            document.getElementById('story-ads-container').style.display = 'none'
          }
        }
        countSlotRendeEnded = countSlotRendeEnded + 1
      })

      googletag.pubads().addEventListener('impressionViewable', function(event) {
        if(countImpressionViewable == 0){
          
        }
        countImpressionViewable = countImpressionViewable + 1
      });

      googletag.pubads().addEventListener('slotRequested', function(event) {
        if(countSlotRequested == 0){
          document.getElementById("stories-content").style.removeProperty("display")
        
          progressBars[activeIndex].classList.add("active")
          progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${timesec}s`
          pauseProgressBar()
        }
        countSlotRequested = countSlotRequested + 1
        
      });

      // This listener will be called when an ad response has been received for
      // a slot.
      googletag.pubads().addEventListener('slotResponseReceived', function(event) {
        if(countSlotResponseReceived == 0){
          var countWindow = 0

          document.getElementById("loading-stories").style.display = "none"
          document.getElementById("close-stories").style.removeProperty("display")

          window.addEventListener("message", (event) => {   
            if (!event.data) return
              switch(event.data.state) {
                case "adContentLoaded": {
                  if(countWindow == 0){
                    const duration = event.data.videoDuration;
                    progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${duration}s`
                    runProgressBar()
                  }
                  countWindow = countWindow + 1
                }
              }
              switch(event.data.state) {
                case "AD_VIDEO_PAUSE": {
                  pauseProgressBar()
                }
              }
              switch(event.data.state) {
                case "AD_VIDEO_PLAY": {
                  runProgressBar()
                }
              }
              switch(event.data.state) {
                case "AD_CTA_CLICK": {
                  const videoIframe = document.querySelector('#'+props.story.story[activeIndex].div_gpt).querySelector('iframe')
                  if(!!videoIframe) {
                    const videoGptDocument = videoIframe.contentDocument || videoIframe.contentWindow.document;
                    const videoGpt = videoGptDocument.getElementById("google-native-video-media");
                    videoGpt.pause()
                  }
                  pauseProgressBar()
                }
              }
          });
          countSlotResponseReceived = countSlotResponseReceived + 1
        }
      });

      googletag.pubads().enableSingleRequest();
      googletag.enableServices();


    });
    googletag.cmd.push(function() {
      googletag.display(props.story.story[activeIndex].div_gpt);
    });
  }
  

  const mountJwplayer = () => {
    const linkVideo = props.story.story[activeIndex].link_video
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")

    document.getElementById("mute-toggler").style.display = "none"

    // close function immediately when it is not a video
    // then activate the image story
    if (!linkVideo) {
      if (player) removeModalPlayer()

      renderImageStory()
      return
    }

    // code below is used for render video story by jwplayer
    document.getElementById("stories-content").style.display = "none"
    document.getElementById("loading-stories").style.removeProperty("display")
    document.getElementById("close-stories").style.display = "none"
    
    const jwplayer = window.jwplayer(storyModalPlayerID).setup({
      ...options,
      file: linkVideo
    })
    setPlayer(jwplayer)
    
    jwplayer.on("ready", _ => {
      document.getElementById("stories-content").style.removeProperty("display")
      
      progressBars[activeIndex].classList.add("active")
      progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${timesec}s`
      pauseProgressBar()

      if (jwplayer.getMute()) {
        document.getElementById("mute-toggler").style.removeProperty("display")
      }
    })

    jwplayer.on("play", _ => {
      document.getElementById("loading-stories").style.display = "none"
      document.getElementById("close-stories").style.removeProperty("display")

      const duration = jwplayer.getDuration()
      progressBars[activeIndex].children[0].style.animation = `story-progress-bar ${duration}s`
      runProgressBar()
    })

    jwplayer.on("error", _ => {
      progressBars[activeIndex].children[0].style.animation = "unset"

      document.getElementById("mute-toggler").style.display = "none"
    })

    jwplayer.on("buffer", _ => {
      pauseProgressBar()
    })

    jwplayer.on("mute", e => {
      if (!e.mute) document.getElementById("mute-toggler").style.display = "none"
    })
  }

  const pauseProgressBar = _ => {
    if (!progressBarWrapper.current) return
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].children[0].style.animationPlayState = "paused"
  }
  
  const runProgressBar = _ => {
    if (!progressBarWrapper.current) return
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    progressBars[activeIndex].children[0].style.animationPlayState = "running"
  }

  const navigateStory = (progressBars, direction) => {
    // navigate to the next story
    progressBars[activeIndex].classList.remove("active")
    progressBars[activeIndex].children[0].style.animation = "unset"

    props.onSwipe(direction, seenStory())

    setTimeout(() => {
      progressBars[activeIndex].classList.add("active")
    }, 100);
  }

  const divideComponentOnClick = (e) => {
    const progressBars = progressBarWrapper.current.querySelectorAll(".progressbars")
    const componentWidth = e.target.offsetWidth
    const isBackward = e.clientX < ( componentWidth / 4 )
    const isForward = e.clientX > ((componentWidth / 4) * 3)

    let targetIndex = activeIndex

    if (!isForward && !isBackward) return

    if (isForward) targetIndex = activeIndex + 1
    if (isBackward) targetIndex = activeIndex - 1

    if (isBackward) {
      progressBars[activeIndex].classList.remove("active")
      if (activeIndex - 1 >= 0 && props.story.story[activeIndex - 1].seen) {
        props.story.story[activeIndex - 1].seen = false
      }
    }

    if (targetIndex < 0) {
      navigateStory(progressBars, "left")
      targetIndex = 0
    }
    if (targetIndex > props.story.story.length - 1) {
      navigateStory(progressBars, "right")
      targetIndex = 0
    }
    setActiveIndex(targetIndex)
    setTimeout(() => {
      progressBars[activeIndex].children[0].style.animation = "unset"
    }, 100)
  }

  const renderCTAButton = _ => {
    const { type, external_link, permalink } = props.story.story[activeIndex]
    let href = (/^http:|^https:/.test(permalink)) ? permalink : "",
      onClick = () => {}

    switch (type) {
      case "url":
        if (!external_link) break

        if (/^http:|^https:/.test(external_link)) href = external_link
        else href = `https://${external_link}`
        break
      case "scan_qr":
        href = "/qrcode"
        break
      case "news_tags":
        {
          const tag = permalink.split("/").reverse()[0]
          onClick =  () => props.newsCountViewTag(tag)
        }
        break
      case "news_detail":
        {
          const detailId = +(permalink.split("/").reverse()[1])
          onClick = () => props.newsCountViewDetail(new DeviceUUID().get(), detailId)
        }
        break
    }

    if (!href) return null

    return (
      <a href={href} onClick={onClick}>
        Click Here
      </a>
    )
  }



  const storyImageSrc = props.story.story[activeIndex].story_img 
  ? `${props.story.image_path}${RESOLUTION_IMG}${props.story.story[activeIndex].story_img}`
  : "" 
  const storyVideoUrl = props.story.story[activeIndex].link_video
  

  return (
    <div className="modalview-wrapper">
      <div
        id="modalview-stories"
        ref={modal}
        onTouchStart={e => touchStart(e)}
        onTouchEnd={e => touchEnd(e)}
        onTouchMove={e => touchMove(e)}>

        <div className={props.story.__typename == "StoryData" ? "progressbar-stories" : "progressbar-stories-ads" } ref={progressBarWrapper}>
          {props.story.story.map((e, i) => {
            return (
              <div key={`story-${e.id}-${i}`} className="progressbars">
                <span onAnimationEnd={_ => handleAnimationEnd()}></span>
              </div>
            )
          })}
        </div>

        <div id="mute-toggler" onClick={_ => player.setMute(false)}></div>

        <div className="story-head">
          {
            props.story.__typename == 'StoryData' ?
            <>
              <div>
                <img
                  src={`${props.story.image_path}${RESOLUTION_IMG}${props.story.program_img}`}
                  alt="story-avatar"
                  width="50"
                  height="50" />
                <label>
                  { props.story.story[activeIndex].title }
                </label>
              </div>
              <button
                id="close-stories"
                className="close-stories"
                onClick={_ => closeModal()}>X</button>
            </>
            :
            <>
              <div></div>
              <button
                id="close-stories"
                className="close-stories"
                onClick={_ => closeModal()}>X</button>
            </>
            
          }
          
          <div id="loading-stories" style={{display: "none"}}></div>
        </div>

        <div
          id="stories-content"
          onClick={e => divideComponentOnClick(e)}
          onContextMenu={e => e.preventDefault()}
          className="stories-content" >
          <img
            src={storyImageSrc}
            alt="story-image"
            width="100%"
            height="auto"
            style={{ display: storyImageSrc ? "" : "none" }}/>
          <div 
            id={storyModalPlayerID}
            style={{ display: storyVideoUrl ? "" : "none" }}/>
          {
            props.story.__typename == 'StoryGPT' ?
            <StoryAds 
              id={props.story.story[activeIndex].div_gpt} 
              path={props.story.story[activeIndex].path}
              target={props.story.story[activeIndex].cust_params}
            />
            :
            null
          }
          <div 
            className="content-no-link"
            style={{ display: !storyVideoUrl && !storyImageSrc ? "" : "none" }}>
            Sorry, there is no link provided to show the story :(  
          </div>
        </div>

        <div
          id="stories-cta"
          className="stories-cta">
          { renderCTAButton() }
        </div>
      </div>

      <div className="placeholder-story">
        <div></div>
      </div>
    </div>
  )
}

export default connect(state => state, {
  ...newsCountView
})(storyModal)
