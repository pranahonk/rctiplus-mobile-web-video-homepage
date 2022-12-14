import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import dynamic from 'next/dynamic'
import BottomScrollListener from 'react-bottom-scroll-listener';

import storiesActions from '../../redux/actions/storiesActions'
import { RESOLUTION_IMG } from '../../config'
import { client } from "../../graphql/client"
import { GET_LINEUP_STORIES } from "../../graphql/queries/homepage"

const StoryModal = dynamic(() => import("../Modals/StoryModal"))

import '../../assets/scss/components/stories.scss'

function lineupStory (props) {
    const [ stories, setStories ] = useState([])
    const [ meta, setMeta ] = useState({})
    const [ activeStory, setActiveStory ] = useState({})
    const [ storyIndex, setStoryIndex ] = useState(0)

    useEffect(() => {
        const { data, meta } = props.lineup.lineup_type_detail.detail
        const stories = data.map(story => ({
            ...story,
            image_path: meta.image_path
        }))

        setStories(stories)
        setMeta(meta)
    }, [])

    const loadMore = () => {
        if (meta.pagination.current_page >= meta.pagination.total_page) return

        client.query({ query: GET_LINEUP_STORIES(meta.pagination.current_page + 1, 5, props.lineup.id) })
            .then(({ data }) => {
                const mappedContents = new Map()
                stories.concat(data.lineup_stories.data).forEach(story => {
                    mappedContents.set(story.program_id, {
                        ...story,
                        image_path: data.lineup_stories.meta.image_path
                    })
                })

                setStories([ ...mappedContents.values() ])
                setMeta(data.lineup_stories.meta)
            })
            .catch(_ => {})
    }

    const openStory = (story, index) => {
        setActiveStory(story)
        setStoryIndex(index)
        if (index === 0) document.getElementById("nav-footer").style.removeProperty("display")
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
        const updatedStories = stories.map(story => {
            if (story.program_id === seenStory.program_id) return seenStory
            return story
        })
        setStories(updatedStories)
        openStory(updatedStories[targetIndex], targetIndex)
    }

    const onClose = _ => {
        setActiveStory({})
        document.getElementById("nav-footer").style.display = ""
    }

    if (stories.length === 0) return null

    return (
        <>
            <div id="lineup-stories" >
                <h2>{props.lineup.title}</h2>

                <BottomScrollListener offset={40} onBottom={() => loadMore()}>
                    {scrollRef => (
                        <div ref={scrollRef} className="stories-components">
                            { stories.map((story, i) => {
                                return (
                                    <div 
                                        key={`${i}-story-lineup`}
                                        onClick={_ => openStory(story, i)}
                                        className="lineupstory storywrapper">
                                        <div id={`story-lineup-${i}`}>
                                            <img
                                                width="48"
                                                height="48"
                                                src={`${meta.image_path}${RESOLUTION_IMG}${story.program_img}`}
                                                alt={`story ${i}`} />
                                        </div>
                                        <label>{ story.title }</label>
                                        
                                        <div 
                                            className="masked-storyimg"
                                            style={{
                                                backgroundImage: `url(${meta.image_path}${RESOLUTION_IMG}${story.program_img})`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                backgroundSize: "cover",
                                            }}></div>
                                    </div>
                                )
                            }) }
                        </div>
                    )}
                </BottomScrollListener>
            </div>
            
            <StoryModal 
                story={activeStory}
                onSwipe={(dir, story) => onSwipe(dir, story)}
                onClose={_ => onClose()} />
        </>
    )
}

export default connect(state => state, storiesActions)(lineupStory);
