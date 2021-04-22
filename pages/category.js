import React, {useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch} from "react-redux"
import BottomScrollListener from 'react-bottom-scroll-listener';
import LoadingBar from 'react-top-loading-bar';
import ax from 'axios';
import { getSubCategory, getBannerCategoryActive, getHomepageCategory, getStoriesCategory } from "../redux/actions/homeCategoryActions";
import HomeLoader from '../components/Includes/Shimmer/HomeLoader';
import Layout from '../components/Layouts/Default_v2';
import Header from "../components/Includes/HomeCategory/DetailCategory/Header"
import Carousel from '../components/Includes/Gallery/Carousel_v2';
import GridMenu from '../components/Includes/Common/HomeCategoryMenu';
import Stories from '../components/Includes/Gallery/Stories_v2';
import Panel1 from '../components/Panels/Pnl_1';
import Panel2 from '../components/Panels/Pnl_2';
import Panel3 from '../components/Panels/Pnl_3';
import Panel4 from '../components/Panels/Pnl_4';

import { DEV_API } from '../config';
import { RESOLUTION_IMG,  } from '../config';
import {getCookie, getVisitorToken, checkToken } from '../utils/cookie';

const axios = ax.create({ baseURL: DEV_API + '/api' });

axios.interceptors.request.use(async (request) => {
    await checkToken();
    const accessToken = getCookie('ACCESS_TOKEN');
    request.headers['Authorization'] = accessToken == undefined ? getVisitorToken() : accessToken;
    return request;
});

const Category = () => {
    const dispatch = useDispatch()
    const router = useRouter();
    const ref = useRef(null)
    const {category_id, category_title} = router.query;
    const {subCategory, subBanner, homepageCategory, listStoriesCategory} = useSelector(state => state.homeCategory);

    const [token, setToken] = useState("")
    const [isShimmer, setIsShimmer] = useState(true);
    const [contents, setContents] = useState([]);
    const [meta, setMeta] = useState();
    const [fetchAllowed, setFetchAllowed] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1)

    const bottomScrollFetch = () => {
        console.log(`melakukan fetch ulang kontent`)
        const pageCurrent = page + 1;
        if(fetchAllowed && !isLoading){
            console.log(`harusnya melakukan fetch lagi`)
            setIsLoading(true);
            ref.current.continuousStart();
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await axios.get(`/v2/homepage/category/${category_id}?platform=mweb&page=${pageCurrent}&length=6`);
        
                    let contentData = [];
                    if (response.data.status.code === 0) {
                        const data = response.data.data;
                        let selectedData = [];
                        let promises = [];
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].total_content > 0) {
                                promises.push(axios.get(`/v1/homepage/${data[i].id}/contents?platform=mweb&page=1&length=7`)
                                .catch((err) => {
                                    console.log('err', err);
                                }));
                                selectedData.push(data[i]);
                            }
                            else if (data[i].type === 'custom' && data[i].api) {
                                promises.push(axios.get(data[i].api)
                                .catch((err) => {
                                    console.log('err', err);
                                }));
                                selectedData.push(data[i]);
                            }
                        }
                        
                        const results = await Promise.all(promises);
                        for (let i = 0; i < results.length; i++) {
                            if (!results[i]) {
                                continue;
                            }
                            
                            let content = {}
                            if (results[i] && results[i].status === 200 && results[i].data && results[i].data.status.code === 0) {
                                content = {
                                    content: results[i].data.data,
                                    ...selectedData[i]
                                };
                            }
                            else if (results[i].data.status.code === 13) {
                                if (!getCookie('SIGNIN_POPUP_SHOWN')) setSigninPopupFlag(true);
                            }
                            contentData.push(content);
                        }
                        // dispatch({ type: 'HOMEPAGE_CATEGORY', data: contents, meta: response.data.meta });
                        console.log(`ini adalah content selanjutnya`, contentData)
                        setContents([...contents, ...contentData])
                        setPage(pageCurrent);
                        setFetchAllowed(pageCurrent != meta.pagination.total_page);
                        setIsLoading(false)
                        setMeta(response.data.meta)
                    }
                    resolve(response);
                    ref.current.complete()
                }
                catch (error) {
                    reject(error);
                    ref.current.complete()
                    setIsLoading(false)
                }
            });
        }
         
    }

    useEffect(() => {
        dispatch(getSubCategory(category_id));
        dispatch(getBannerCategoryActive(category_id));
        dispatch(getHomepageCategory(1, 6, category_id));
        // dispatch(getStoriesCategory(category_id));
    }, [category_id]);

    useEffect(() => {
       if( homepageCategory !== null ) {
           setIsShimmer(false)
           setContents(homepageCategory.data)
           setMeta(homepageCategory.meta)
        }
    }, [ homepageCategory])

    useEffect(() => {
        const accessToken = getCookie('ACCESS_TOKEN');
        setToken(accessToken == undefined ? getVisitorToken() : accessToken)
    }, [])

    return (
        <Layout >
            <LoadingBar progress={0} height={3} color={'#fff'} ref={ref} />
            <BottomScrollListener offset={150} onBottom={bottomScrollFetch} />

            {isShimmer ? <HomeLoader /> : 
            <div style={{marginTop: "56px"}}>
                <Header title={category_title} />
                
                <div style={{marginTop: -3}}>
                    <Carousel detailCategory={true} data={{banner: subBanner?.data, meta: subBanner?.meta}} >
                        {subCategory && subCategory?.data?.length >= 3 && <GridMenu contents={subCategory} />}
                    </Carousel>
                </div>

                <div style={subCategory === null ? { marginTop: -110 } : {}}>
                    <Stories loadingBar={ref.current} detailCategory={true} id={category_id} />
                </div>

                <div style={subCategory === null && listStoriesCategory === null ? {marginBottom: 40, marginTop: 60, paddingLeft: 12} : {marginBottom: 40, paddingLeft: 12, marginTop: 20}}>
                    {contents && contents.length > 0 && contents.map((content, i) => {
                        switch (content.display_type) {
                            case 'horizontal_landscape_large':
                                return <Panel1 token={token} loadingBar={ref.current} type={content.type} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                            case 'horizontal_landscape':
                                return <Panel2 token={token} loadingBar={ref.current} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                            case 'horizontal':
                                return <Panel3 token={token} loadingBar={ref.current} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                            case 'vertical':
                                return <Panel4 token={token} loadingBar={ref.current} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;
                        }
                    })}
                </div>
                
            </div>}  
        </Layout>
    )
}

export default Category
