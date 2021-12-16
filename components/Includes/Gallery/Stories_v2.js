import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import dynamic from 'next/dynamic'

import storiesActions from '../../../redux/actions/storiesActions'
import { RESOLUTION_IMG } from '../../../config'
import { client } from "../../../graphql/client"
import { GET_HOME_STORIES } from "../../../graphql/queries/homepage"

const StoryModal = dynamic(() => import("../../Modals/StoryModal"))

import '../../../assets/scss/components/stories.scss'

function homeStories (props) {
    const [ stories,setStories ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ activeStory, setActiveStory ] = useState({})
    const [ storyIndex, setStoryIndex ] = useState(0)

    useEffect(() => {
        client.query({ query: GET_HOME_STORIES() })
            .then(({ data }) => {
                const stories = data.stories.data.map(story => ({
                    ...story,
                    image_path: data.stories.meta.image_path
                }))

                setStories(stories)
                setMeta(data.stories.meta)
            })
            .catch(e => {})
    }, [])

    const openStory = (story, index) => {
        setActiveStory(story)
        setStoryIndex(index)
    }

    const onSwipe = (direction, seenStory) => {
        if ((storyIndex - 1) < 0 && direction === "left") {
            openStory({}, 0)
        }
        else if (direction === "left") {
            openStory(stories[storyIndex - 1], storyIndex - 1)
        }

        if ((storyIndex + 1) > (stories.length - 1) && direction === "right") {
            openStory({}, 0)
        }
        else if (direction === "right") {
            setStories(stories.map(story => {
                if (story.program_id === seenStory.program_id) return seenStory
                return story
            }))
            openStory(stories[storyIndex + 1], storyIndex + 1)
        }
    }

    if (stories.length === 0) return null

    return (
        <>
            <div id="home-stories">
                { stories.map((story, i) => {
                    return (
                        <div key={i} className="homestory-wrapper">
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
            
            <StoryModal 
                story={activeStory}
                onSwipe={(dir, story) => onSwipe(dir, story)}
                onClose={_ => setActiveStory({})} />
        </>
    )
}

export default connect(state => state, storiesActions)(homeStories);
