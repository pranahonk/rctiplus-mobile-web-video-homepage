import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { getTruncate, imageNews } from '../../../utils/helpers';
import { formatDateWordID } from '../../../utils/dateHelpers';
import { urlRegex } from '../../../utils/regex';
import queryString from 'query-string';
import '../../../assets/scss/components/trending_v2.scss';
// Import Swiper styles
import 'swiper/swiper.scss';

export default function HorizontalItem({item, assets_url}) {
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
      return router.push('/news/detail/' + category + '/' + article.id + '/' + encodeURI(urlRegex(article.title)) + `${accessToken ? `?token=${accessToken}&platform=${platform}` : ''}`);
    }
  return(
      <a onClick={(e) => {
        e.preventDefault()
        _goToDetail(item)
        }}>
        <div className="news-interest_thumbnail-wrapper">
          {
            imageNews(item.title, item.cover, item.image, 237, assets_url, 'news-interest_thumbnail')
          }
        <div className="news-interest_thumbnail-title" >
            <h1>{getTruncate(item.title, '...', 100)}</h1>
            <h2>{item.subcategory_name} <span>{formatDateWordID(new Date(item.pubDate * 1000))}</span></h2>
        </div>
        </div>
      </a>
  )
}