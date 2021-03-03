import { useEffect, useState } from 'react';
import Img from 'react-image';
import { useRouter } from 'next/router'
import { getTruncate, imgNews } from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import { urlRegex } from '../../../utils/regex';
import queryString from 'query-string';
import '../../../assets/scss/components/trending_v2.scss';

const redirectToPublisherIndex = [0, 1];
export default function SquareItem({item, assets_url, indexKey, isIndexKey}) {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.accessToken) {
      setAccessToken(query.accessToken);
      setPlatform(query.platform);
    }
  },[]);
  const _goToDetail = (article) => {
    let category = ''
    if (article.subcategory_name.length < 1) {
      category = 'berita-utama';
    } else {
      category = urlRegex(article.subcategory_name)
    }
    if(isIndexKey) {
      if (redirectToPublisherIndex.indexOf(indexKey) != -1 && platform !== 'ios') {
          return window.open(article.link, '_blank');
      }
          return router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`);
    }
    else { 
      return router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`);
    }
  }
  return(
    <div className="list_tags_thumb">
      <div className="lt_img">
          <div className="lt_img_wrap">
          <Img
              alt={item.title}
              loader={<img alt={item.title} className="news-interest_thumbnail" src="/static/placeholders/placeholder_landscape.png" />}
              unloader={<img alt={item.title} className="news-interest_thumbnail" src="/static/placeholders/placeholder_landscape.png" />}
              className="news-interest_thumbnail"
              src={[imgNews(item.cover, item.image, 200, assets_url), '/static/placeholders/placeholder_landscape.png']} />
          </div>
      </div>
      <div className="lt_content">
          <a onClick={(e) => {
            e.preventDefault()
            _goToDetail(item)
            }}>
            <h2>{getTruncate(item.title, '...', 100)}</h2>
          </a>
          <div className="lt_content-info">
          <h5>{item.source}</h5>
          <h6>{formatDateWordID(new Date(item.pubDate * 1000))}</h6>
          </div>
      </div>
    </div>
  )
}