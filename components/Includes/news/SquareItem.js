import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { getTruncate, imageNews } from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import { urlRegex } from '../../../utils/regex';
import queryString from 'query-string';
import '../../../assets/scss/components/trending_v2.scss';

const redirectToPublisherIndex = [0, 1];
export default function SquareItem({item, indexKey, isIndexKey, assets_url}) {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState(null);
  const [platform, setPlatform] = useState(null);
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.token || query.platform) {
      setAccessToken(query.token);
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
      if ((redirectToPublisherIndex.indexOf(indexKey) != -1) && platform !== 'ios') {
          return window.open(article.link, '_blank');
      }
      else if((redirectToPublisherIndex.indexOf(indexKey) != -1) && platform === 'ios'){
        return window.open(article.link, "_self");
      }
      return router.push(`/news/detail/${category}/${article.id}/${encodeURI(urlRegex(article.title))}${accessToken ? `?token= ${accessToken}&platform=${platform}` : ''}`);
    }
    else {
          return router.push(`/news/detail/${category}/${article.id}/${encodeURI(urlRegex(article.title))}${accessToken ? `?token= ${accessToken}&platform=${platform}` : ''}`);
    }
  }
  return(
    <div className={`list_tags_thumb ${indexKey%2 == 0 ? '' : 'tagsItems'}`}>
      <div className="lt_img">
          <div className="lt_img_wrap">
            <a onClick={(e) => {
            e.preventDefault()
            _goToDetail(item)
            }}>
              {
                imageNews(item.title, item.cover, item.image, 200, assets_url, 'news-interest_thumbnail')
              }
            </a>
          </div>
      </div>
      <div className="lt_content">
          <a onClick={(e) => {
            e.preventDefault()
            _goToDetail(item)
            }}>
            <h2 dangerouslySetInnerHTML={{ __html: getTruncate(item.title, '...', 100) }}></h2>
          </a>
          <div className="lt_content-info">
          <h5>{item.source}</h5>
          <h6>{formatDateWordID(new Date(item.pubDate * 1000))}</h6>
          </div>
      </div>
    </div>
  )
}
