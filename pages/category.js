import React, {useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch} from "react-redux"
import LoadingBar from 'react-top-loading-bar';
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

import { RESOLUTION_IMG } from '../config';
import { getCookie, getVisitorToken } from '../utils/cookie';

const Category = () => {
    const dispatch = useDispatch()
    const router = useRouter();
    const ref = useRef(null)
    const {category_id, category_title} = router.query;
    const {subCategory, subBanner, homepageCategory, listStoriesCategory} = useSelector(state => state.homeCategory);

    const [token, setToken] = useState("")
    const [isShimmer, setIsShimmer] = useState(true);
    const [contents, setContents] = useState([]);
    const [meta, setMeta] = useState()

    useEffect(() => {
        dispatch(getSubCategory(category_id));
        dispatch(getBannerCategoryActive(category_id));
        dispatch(getHomepageCategory(1, 21, category_id));
        dispatch(getStoriesCategory(category_id));
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

            {isShimmer ? <HomeLoader /> : 
            <div style={{marginTop: "56px"}}>
                <Header title={category_title} />

                <Carousel detailCategory={true} data={{banner: subBanner?.data, meta: subBanner?.meta}} >
                    {subCategory && subCategory?.data?.length >= 3 && <GridMenu contents={subCategory} />}
                </Carousel>

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
