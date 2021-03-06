import React, { useState, useEffect, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '@/components/Cards/Card'
import { SwiperSlide, Swiper } from 'swiper/react'
import Rating from 'react-rating'
import {MdStar} from 'react-icons/md'
import { getProductReviews } from "@/redux/actions/productAction";
import { AddLike, RemoveLike } from '@/redux/actions/reviewsAction'
import { AiOutlineCaretUp, AiOutlineCaretDown } from 'react-icons/ai'
import { Star, EmptyStar, Tree } from '../../assets/icons'
import { getReviewsByManufacturer } from '@/redux/actions/userActions'
import moment from 'moment'
import Link from 'next/link'
import Button from '@/components/Buttons/Button'
import HorizontalChart from '../chart/HorizontalChart'



const Review = ({product, isTabletOrMobile, toggleSidebar, handleLike, handleRemoveLike}) => {
    const dispatch = useDispatch();
    const profileReviews = useSelector( state => state.admin.reviews)
    const [ menu, setMenu ] = useState({
        tab: 0,
        content: "Items"
    })
    const [ ok, setOk ] = useState(false)
    const { isAuthenticated } = useSelector( state => state.auth)
    const [ hasLiked, setHasLiked ] = useState(false)
    const [ hasUnliked, setHasUnliked ] = useState(false)
    const MAX_LENGTH = 100

    const { tab, content } = menu

    const iconStyle = {
    width: "20px",
    height: "20px",
    fontWeight: "600",
    }
    
    useEffect(() => {
        dispatch(getProductReviews(product?._id))
        dispatch(getReviewsByManufacturer(product.author.slug))
    }, [dispatch])
    


    var total = 0;
        for(var i = 0; i < profileReviews.length; i++) {
        total += profileReviews[i].rating;  
    }
    var avg = total / profileReviews.length;

    const CardRating = React.memo(({review}) => (
        <div className="my-auto mobile:col-span-full pl-2">
            <Rating
                className=""
                fullSymbol= { <Star className= "text-lg" style={{width:"16px", height: "16px"}}/> }
                emptySymbol ={ <EmptyStar className= "text-lg" style={{width:"16px", height: "16px"}}/>}
                readonly
                initialRating={review.rating}
            />
            <div className="mt-2">
                {`${review.review.substring(0, MAX_LENGTH)}${review.review >= 100 ? "..." : ""}`}
            </div>
        </div>
    ))

    const DesktopRating = React.memo(() => (
        <div className="text-lg">
          <Rating
              className="mt-2"
              fullSymbol= { <Star className=""style={iconStyle} /> }
              // halfSymbol= { <Star className="text-base "style={iconStyle} />}
              readonly
              emptySymbol ={ <EmptyStar className="" style={iconStyle}/>}
              initialRating={Math.round(avg)}
          />
        </div>
    )) 

    const handleItemReview = () => {
        setMenu ({
            tab: 0,
            content: "Items"
        })
    }

    const NoReview = () => (
        <div className="mb-4">
            <div className="m-auto text-center">
                <Tree className="text-center mx-auto my-2"/>
                <span className="font-bold"> Sorry there are no reviews for {product.name} </span>
            </div>
        </div>
    )



    const ReviewCard = ({review}) => (
        <div className="grid grid-cols-3 gap-4 p-3 mobile:grid-cols-2 relative">
            <div className="flex mobile:col-span-full">
                    <div className="text-center p-1 mr-1 lg:mr-3 lg:p-2 my-auto mobile:absolute mobile:top-0 mobile:right-2">
                        <button className="m-auto cursor-pointer" 
                            onClick= {() => handleLike (review.id)}
                        >
                            <AiOutlineCaretUp className="m-auto  text-Black-medium text-lg mobile:text-sm"/>
                        </button>
                        <h1 className="text-center  text-Black-medium text-2xl mobile:text-sm"> {review.likes?.length} </h1>
                        <button className="m-auto  cursor-pointer"
                            onClick={() => handleRemoveLike(review.id)}
                        >
                            <AiOutlineCaretDown  className=" text-Black-medium text-lg mobile:text-sm"/>
                        </button>
                    </div>
                <div className="flex ml-3 my-auto">
                    <div>
                        <img className="h-12 w-12 rounded-full" src= {review.author.avatar} />
                    </div>
                    <div className="ml-3 my-auto">
                        <div className="text-sm ">
                            <span className="font-bold text-Black "> {review.author.name} </span>
                            <div className="text-Black-medium text-xs capitalize"> {(moment(review.date).startOf('day').fromNow())} </div>
                        </div>
                    </div>
                </div>
            </div>

            <CardRating review={review}/>
        </div>
    )

    return (
        <>
            { isTabletOrMobile ?
            // Mobile and tablet version
                <Card className="overflow-x-hidden ">
                    <div className="flex">
                        <h1 className="text-2xl font-semibold text-Black-text flex"> 
                    <MdStar className="text-orange my-auto"/>
                        { profileReviews.length === 1 ? `${profileReviews.length} review` : `${profileReviews.length} reviews`}
                        </h1>
                    </div>
                    
                    { profileReviews.length !== 0 ?
                
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        freeMode= { true }
                    >
                        {
                            profileReviews && profileReviews.slice(0, 7).map( data => (
                                <SwiperSlide
                                 slidesPerView={1}
                                 className="m-1 w-9/12 border-box my-4 h-[225px]"
                                 >
                                     <ReviewCard review={data} handleLike={handleLike} handleRemoveLike={handleRemoveLike}/>
                                 </SwiperSlide>
                             ))
                        }
                    </Swiper>
                        :
                    <div className="my-5">
                        <NoReview />
                    </div>
                    }
                    
                    <div className="my-3">
                        <Link className="grid" href= {`/marketplace/products/reviews/${product.slug}`}>
                            <Button className="bg-Blue text-white inline-block"> See All </Button>
                        </Link>
                    </div>
                </Card>
            
            :

            // Desktop Version
            <>
                    <Card title= {`Product reviews (${profileReviews.length})`} className="p-0">
                        { profileReviews.length !== 0 ?
                            <div className="px-3"> 
                                <div className="flex">
                                    <div>
                                        <div className="flex">
                                            <div>
                                                <h1 className="text-2xl font-bold"> {avg} </h1>
                                            </div>
                                            <span>/5</span>
                                        </div>
                                        <DesktopRating />   
                                    </div>
                                    <div className="pl-12">
                                        <div>
                                        <HorizontalChart profileReviews={profileReviews} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {profileReviews && profileReviews.map( review =>
                                        <div className="my-3">
                                            <ReviewCard review={review} handleLike={handleLike} handleRemoveLike={handleRemoveLike}/>    
                                        </div> 
                                    )}
                                </div>
                            </div>
                            
                            :
                            
                            <NoReview />
                            
                            }
                    </Card>
            </>
        }
    </>
    )
}

export default memo(Review)
