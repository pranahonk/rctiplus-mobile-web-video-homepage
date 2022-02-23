import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "next/router"
import dynamic from 'next/dynamic'

import { RESOLUTION_IMG } from '../../../config'
import { client } from "../../../graphql/client"
import { GET_HOME_STORIES } from "../../../graphql/queries/homepage"

const StoryModal = dynamic(() => import("../../Modals/StoryModal"))

import '../../../assets/scss/components/stories.scss'

function homeStories (props) {
    const [ stories, setStories ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ activeStory, setActiveStory ] = useState({})
    const [ storyIndex, setStoryIndex ] = useState(0)

    useEffect(() => {
        client.query({ query: GET_HOME_STORIES(props.router.query.category_id) })
            .then(({ data }) => {
                let stories = []
                data.stories.data.forEach(story => {
                    const gpt = story.gpt

                    stories.push({
                        ...story,
                        image_path: data.stories.meta.image_path
                    })

                    // append gpt (creative ads) into existing story contents
                    if (gpt.length > 0) {
                        stories.push({
                            program_id: `${story.program_id}_ads`, // ads identifier
                            story: gpt,
                            is_ads: true
                        })
                    }
                })

                setStories(stories)
                setMeta(data.stories.meta)
            })
            .catch(_ => {})
    }, [])

    const openStory = (story, index) => {
        setActiveStory(story)
        setStoryIndex(index)
    }

    const onSwipe = (direction, seenStory) => {
        if ((storyIndex - 1) < 0 && direction === "left") {
            openStory({}, 0)
            document.getElementById("nav-footer").style.display = ""
        }
        else if (direction === "left") {
            openStory(stories[storyIndex - 1], storyIndex - 1)
        }

        if ((storyIndex + 1) > (stories.length - 1) && direction === "right") {
            openStory({}, 0)
            document.getElementById("nav-footer").style.display = ""
        }
        else if (direction === "right") {
            setStories(stories.map(story => {
                if (story.program_id === seenStory.program_id) return seenStory
                return story
            }))
            openStory(stories[storyIndex + 1], storyIndex + 1)
        }
    }

    const onClose = _ => {
        setActiveStory({})
        document.getElementById("nav-footer").style.display = ""
    }

    if (stories.length === 0) return null

    return (
        <>
            <div
                id="home-stories"
                className="stories-components">
                { stories.map((story, i) => {
                    if (story.is_ads) return null

                    return (
                        <div key={i} className="homestory storywrapper">
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
                onClose={_ => onClose()} />
        </>
    )
}

export default connect(state => state, {})(withRouter(homeStories));
