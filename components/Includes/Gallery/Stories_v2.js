import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import BottomScrollListener from 'react-bottom-scroll-listener'
import { withRouter } from "next/router"
import dynamic from 'next/dynamic'

import { RESOLUTION_IMG } from '../../../config'
import { client } from "../../../graphql/client"
import { GET_HOME_STORIES } from "../../../graphql/queries/homepage"

const StoryModal = dynamic(() => import("../../Modals/StoryModal"))

import '../../../assets/scss/components/stories.scss'
import Cookies from 'js-cookie'

function homeStories (props) {
    const [ show, setShow ] = useState(false)
    const [ stories, setStories ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ activeStory, setActiveStory ] = useState({})
    const [ storyIndex, setStoryIndex ] = useState(0)

    useEffect(() => {
        getHomeStories(1)
    }, [])

    useEffect(() => {
        if (stories.length > 0 && show) {
          if(meta?.pagination){
            if(meta?.pagination?.current_page < meta?.pagination?.total_page){
              getHomeStories(meta?.pagination?.current_page + 1);
            }
            else{
              setShow(false);
            }
          }else{
            getHomeStories(2);
          }
        }
      },[show]);

      const getHomeStories = (page) => {
        if(Cookies.get('VISITOR_TOKEN') || Cookies.get('ACCESS_TOKEN')) {
            client.query({ query: GET_HOME_STORIES(props.router.query.category_id, page, 10) })
            .then(({ data }) => {
              const storiesData = data.stories.data.map((story, i) => ({
                  ...story,
                  image_path: data.stories.meta.image_path,
                  sequence: i
              }))
              setStories((list) => ([...list,  ...storiesData]))
              setMeta(data.stories.meta)
              setShow(false);
    
            }).catch(_ => {})
        }
      }
        
    const openStory = (story, index) => {
        setActiveStory(story)
        setStoryIndex(index)

        // if index is 0 or story is "{}" it means the story modal is closed
        if (index === 0) {
            revertToOriginalPosition([], 0, stories)
            document.getElementById("nav-footer").style.removeProperty("display")
        }
    }

    const revertToOriginalPosition = (originalStories, index, prevStories) => {
        if (!prevStories.some(story => story.allSeen)) return originalStories
        if (originalStories.length >= prevStories.length) return markForSeenStories(originalStories)

        const currentStory = prevStories.find((story) => story.sequence === index)
        revertToOriginalPosition([...originalStories, currentStory], index + 1, prevStories)
    }

    const markForSeenStories = (originalStories) => {
        let unseen = [],
            seen = []
        originalStories.forEach(story => {
            if (story.allSeen) seen.push(story)
            else unseen.push(story)
        })

        if (seen.length === 0) return
        setStories(unseen.concat(seen))
    }

    const onSwipe = (direction, seenStory) => {
        const isMaxLeft = (storyIndex - 1) < 0
        const isMaxRight = (storyIndex + 1) > (stories.length - 1)

        if (direction === "left") {
            if (isMaxLeft) openStory({}, 0)
            else onNotMaxStoryContent(storyIndex - 1, seenStory)
        }

        if (direction === "right") {
            if (isMaxRight) openStory({}, 0)
            else onNotMaxStoryContent(storyIndex + 1, seenStory)
        }
    }

    const onNotMaxStoryContent = (targetIndex, seenStory) => {
        const newStories = updatedStories(seenStory)
        setStories(newStories)
        openStory(newStories[targetIndex], targetIndex)
    }

    const onClose = seenStory => {
        setActiveStory({})

        const newStories = updatedStories(seenStory)
        revertToOriginalPosition([], 0, newStories)
        document.getElementById("nav-footer").style.removeProperty("display")
    }
    
    const updatedStories = seenStory => {
        return stories.map(story => {
            let changedStory = story
            
            if (story.program_id === seenStory.program_id) {
                changedStory = seenStory
                
                if (changedStory.story.length < 2 || changedStory.allSeen) changedStory.allSeen = true
                else {
                    changedStory.allSeen = changedStory.story
                        .slice(0, changedStory.story.length - 1)
                        .every(content => content.seen)
                }
            }
            return changedStory
        })
    }

    if (stories.length === 0) return null

    return (
        <div>
          <BottomScrollListener offset={5000} onBottom={()=> setShow(true)}>
            {scrollRef => (
              <div
                  id="home-stories"
                  ref={scrollRef} 
                  className="stories-components">
                  { stories.map((story, i) => {
                      return (
                          <div 
                              key={i} 
                              className={`homestory storywrapper ${story.allSeen ? "seen" : ""}`}>
                              <div
                                  id={`home-story-${i}`}
                                  onClick={_ => openStory(story, i)}>
                                  <img
                                      width="97"
                                      height="97"
                                      src={`${meta.image_path}${RESOLUTION_IMG}${story.program_img}`}
                                      alt={`story ${story.identifier}`} />
                              </div>
                              <label>{ story.title }</label>
                          </div>
                      )
                  }) }
              </div>
            )}
          </ BottomScrollListener>

            <StoryModal
                story={activeStory}
                onSwipe={(dir, story) => onSwipe(dir, story)}
                onClose={story => onClose(story)} />
        </div>
    )
}

export default connect(state => state, {})(withRouter(homeStories));
