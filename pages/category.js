import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux"
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
    const {category_id, category_title} = router.query;
    const {subCategory, subBanner, homepageCategory, listStoriesCategory} = useSelector(state => state.homeCategory);

    const [token, setToken] = useState("")
    const [isShimmer, setIsShimmer] = useState(true)

    useEffect(() => {
        dispatch(getSubCategory(category_id));
        dispatch(getBannerCategoryActive(category_id));
        dispatch(getHomepageCategory(category_id));
        dispatch(getStoriesCategory(category_id));
    }, [category_id]);

    useEffect(() => {
       if( homepageCategory !== null ) setIsShimmer(false)
    }, [ subCategory, homepageCategory])

    useEffect(() => {
        const accessToken = getCookie('ACCESS_TOKEN');
        setToken(accessToken == undefined ? getVisitorToken() : accessToken)
    }, [])

    return (
        <Layout hideFooter={true}>
            {isShimmer ? <HomeLoader /> : 

            <div style={{marginTop: "56px"}}>
                <Header title={category_title} />

                <Carousel detailCategory={true} data={{banner: subBanner?.data, meta: subBanner?.meta}} >
                    {subCategory && subCategory?.data?.length >= 3 && <GridMenu contents={subCategory} />}
                </Carousel>

                <div style={subCategory === null ? { marginTop: -110 } : {}}>
                    <Stories detailCategory={true} id={category_id} />
                </div>

                <div style={subCategory === null && listStoriesCategory === null ? {paddingBottom: 10, marginTop: 60} : {paddingBottom: 10}}>
                    {homepageCategory && homepageCategory?.data && homepageCategory?.data?.map((content, i) => {
                        switch (content.display_type) {
                            case 'horizontal_landscape_large':
                                return <Panel1 token={token} type={content.type} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={homepageCategory.meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                            case 'horizontal_landscape':
                                return <Panel2 token={token} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={homepageCategory.meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                            case 'horizontal':
                                return <Panel3 token={token} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={homepageCategory.meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;

                            case 'vertical':
                                return <Panel4 token={token} key={content.id} contentId={content.id} title={content.title} content={content.content} imagePath={homepageCategory.meta.image_path} resolution={RESOLUTION_IMG} displayType={content.display_type}/>;
                        }
                    })}
                </div>
                
            </div>}  
        </Layout>
    )
}

export default Category
