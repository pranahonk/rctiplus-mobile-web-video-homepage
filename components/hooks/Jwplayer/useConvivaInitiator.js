import { useEffect, useState } from 'react';
import { convivaJwPlayer} from '../../../utils/conviva';

export default function useConvivaInitiator(props) {
  const [ initConviva, setInitConviva ] = useState(false)

  useEffect(_ => {
    if (initConviva) initializeConviva()
  }, [initConviva])

  const initializeConviva = () => {
    let genreTags = 'N/A';
    if (Array.isArray(props.data.genre)) {
      genreTags = props.data.genre.map(({name}) => name).join(",")
    }
    const optionsConviva = generateOptionConviva(props.type)

    const customTags = {
      app_version: process.env.APP_VERSION,
      carrier: 'N/A',
      connection_type: 'N/A',
      content_type: optionsConviva.contentType,
      content_id: optionsConviva.contentId,
      program_name: optionsConviva.programName,
      tv_id: optionsConviva.tvId,
      tv_name: optionsConviva.tvName,
      date_video: 'N/A',
      page_title: 'N/A',
      page_view: 'N/A',
      program_id: optionsConviva.programId,
      screen_mode: 'portrait',
      time_video: 'N/A',
      section_page: props.customData.sectionPage,
      application_name: process.env.MODE === 'DEVELOPMENT' ? 'RCTI+ MWEB RC' : 'RCTI+ MWEB',
      genre: genreTags,
      is_login: props.customData && props.customData.isLogin ? 'login' : 'not login',
      program_type: props.customData && props.customData.programType ? props.customData.programType : 'N/A',
      conviva_params: props?.data?.conviva_params,
      cluster_name: 'N/A'
    };

    const isLive = /^live/i.test(props.type)
    const convivaTracker = convivaJwPlayer(
      optionsConviva.assetName,
      props.player,
      props.player.getDuration(),
      props.data.url ? props.data.url : props.data.trailer_url,
      customTags,
      'Anevia',
      isLive
    )
    if (window.convivaVideoAnalytics) {
      convivaTracker.cleanUpSession();
    }
    convivaTracker.createSession();
  }

  const generateOptionConviva = (type) => {
    const {
      assets_name = "N/A",
      id = "N/A",
      title = "N/A",
      content_name = "N/A",
      program_id = "N/A",
      tv_id = "N/A",
      tv_name = "N/A",
      channel = "rcti",
      content_type = "N/A",
      program_title = "N/A"
    } = props.data

    const {
      program_name = "N/A"
    } = props.customData

    switch(type) {
      case "live_tv":
        return {
          assetName: defineTVNameId(id)[1],
          contentType: type,
          contentId: "N/A",
          programName: "N/A",
          programId: "N/A",
          tvId: String(id),
          tvName: defineTVNameId(id)[1]
        }
      case "live event":
        return {
          assetName: assets_name,
          contentType: type,
          contentId: String(id),
          programName: program_name,
          programId: String(program_id),
          tvId: tv_id,
          tvName: tv_name
        }
      case "missed event":
        return {
          assetName: assets_name,
          contentType: type,
          contentId: String(id),
          programName: program_name,
          programId: String(program_id),
          tvId: tv_id,
          tvName: tv_name
        }
      case "catch up tv":
        return {
          assetName: title,
          contentType: type,
          contentId: String(id),
          programName: "N/A",
          programId: "N/A",
          tvId: defineTVNameId(channel)[0],
          tvName: defineTVNameId(channel)[1]
        }
      default:
        return {
          assetName: content_name,
          contentType: content_type,
          contentId: String(id),
          programName: program_title,
          programId: String(program_id),
          tvId: tv_id,
          tvName: tv_name
        }
    }
  }

  const defineTVNameId = (value) => {
    if (value === 'rcti' || value === 1) {
      return ['1', 'RCTI'];
    }
    if (value === 'mnctv' || value === 2) {
      return ['2', 'MNCTV'];
    }
    if (value === 'gtv' || value === 3) {
      return ['3', 'GTV'];
    }
    if (value === 'inews' || value === 4) {
      return ['4', 'INEWS'];
    }
    return ['N/A', 'N/A'];
  };

  return {
    setInitConviva
  }
}
