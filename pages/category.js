import React, {useEffect} from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux"
import { getSubCategory, getBannerCategoryActive } from "../redux/actions/homeCategoryActions";
import Header from "../components/Includes/HomeCategory/DetailCategory/Header"
import Carousel from '../components/Includes/Gallery/Carousel_v2';
import GridMenu from '../components/Includes/Common/HomeCategoryMenu';
import Stories from '../components/Includes/Gallery/Stories_v2';

const Category = () => {
    const dispatch = useDispatch()
    const router = useRouter();
    const {category_id, category_title} = router.query;

    const {subCategory, subBanner} = useSelector(state => state.homeCategory);

    useEffect(() => {
        dispatch(getSubCategory(category_id));
        dispatch(getBannerCategoryActive(category_id));
    }, [category_id]);

    return (
        <div>
            <Header title={category_title} />
            <Carousel detailCategory={true} contents={{banner: subBanner?.data, meta: subBanner?.meta}} >
                {subCategory && subCategory?.data?.length >= 3 && <GridMenu contents={subCategory} />}
            </Carousel>
            <Stories />
        </div>
    )
}

export default Category
