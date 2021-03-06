import React, { useEffect, useState, useContext, memo } from 'react'
import SingleProduct from '@/marketplace/components/product/SingleProduct'
import ChatBox from '@/marketplace/components/product/ChatBox'
import Review from '@/marketplace/components/product/Review'
import CustomerQuestions from '@/marketplace/components/product/CustomerQuestions'
import RelatedProducts from '@/marketplace/components/product/RelatedProducts'
import Card from '@/components/Cards/Card'
import CategoryProduct from "@/marketplace/components/product/CategoryProduct";
import { getReviewsByManufacturer } from '@/actions/userActions'
import Layout from '@/containers/Layout'
import { Upvote, Downvote } from '@/redux/actions/reviewsAction'
import { getProduct, getProductReviews, getProductByCategory } from "@/redux/actions/productAction";
import Profile from '@/marketplace/components/profile/Profile'
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'
import { SignInContext } from '@/context/SignInContext'
import parse from 'html-react-parser';
import PopUp from '@/marketplace/components/pop/PopUp'
import Chat from '@/marketplace/components/chat/Chat'

const Product = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.product);
  const relatedProduct = useSelector((state) => state.product.productsByCategory);
  const { productByCategory } = useSelector((state) => state.product);
  const [error, setError] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [ isOpen, setIsOpen ] = useState(false)
  const [ content, setContent ] = useState("") 
  const { productSlug } = router.query

  //changed api endpoint to redux
  useEffect(() => {
    dispatch(getProduct(productSlug));
  }, [dispatch, productSlug]);

  useEffect(() => {
    if(product){
      dispatch(getProductByCategory(product.category._id))
    }
  }, [dispatch, product])

    const { toggleSidebar } = useContext(SignInContext)  

    const handleUpvote = (reviewId) => {
      if(!isAuthenticated) {
          setIsOpen(false)
          toggleSidebar()
      } 
      else { 
        dispatch(Upvote(reviewId))
        setTimeout(() => {
        dispatch(getReviewsByManufacturer(product.author.slug))
        },  1000);
      }
    } 

   const handleDownvote = (reviewId) => {
      if(!isAuthenticated) {
          setIsOpen(false)
          toggleSidebar()
      } 
      else {
        dispatch(Downvote(reviewId))
        setTimeout(() => {
          dispatch(getReviewsByManufacturer(product.author.slug))
        },  1000);
      }
    }
 
    const handleProfile = (e) => {
      e.preventDefault();
      setIsOpen(true)
      setContent(<Profile author={product.author} handleLike= {handleUpvote} handleRemoveLike={handleDownvote}/>)
    }

    
    const handleChat = (e) => {
      e.preventDefault();  
      setIsOpen(true)
      setContent(<Chat receiver={product.author}/>)
    }

  
    return (
      <Layout>
        <div className="container mx-auto ">

            {product &&
            <>
            <SingleProduct
                product = { product }
                 isTabletOrMobile = { isTabletOrMobile}
                 handleProfile = {handleProfile}
                 handleChat = { handleChat }
                 toggleSidebar = { toggleSidebar }
            />
 
            {
              isTabletOrMobile && 
              <>
                {/* <ProductDescription product= { product }/> */}
                <ChatBox 
                        product= { product } 
                        handleChat={handleChat} 
                        handleProfile={handleProfile}
                />
              </>
            }

            
            <div className="grid grid-cols-5 gap-3 mobile:grid-cols-1">
              <div className="col-span-4 mobile:col-span-full">
                
                { 
                   !isTabletOrMobile && 
                   <Card title="Service description">  
                     <div className="px-4 pb-2">
                       { parse(product.description)}
                     </div>
                   </Card>
                }
        
                <Review 
                      product={product} 
                      isTabletOrMobile ={ isTabletOrMobile }  
                      toggleSidebar={ toggleSidebar }  
                      handleLike= {handleUpvote} 
                      handleRemoveLike={handleDownvote} 
                />


                <CustomerQuestions product = { product} toggleSidebar= { toggleSidebar } />

                { isTabletOrMobile &&
                  <RelatedProducts  relatedProduct= {relatedProduct}/>  
                } 
              </div>  
  
              
              { !isTabletOrMobile &&
                <div className="col-span-1">
                  <Card title="Related services">
                    { relatedProduct?.map( (data, i) => (
                      <div className="my-1 p-3"
                           key={i}
                      >
                        <CategoryProduct product= {data} />
                      </div>
                    ))}
                  </Card> 
                </div>
            }

            </div>

            { 
              
              <PopUp isOpen= {isOpen} setIsOpen= {setIsOpen}>
                 {content}
              </PopUp> 
            }

            </>  
            }
            

        </div>
      </Layout>
    )
}

Product.whyDidYouRender = true;
export default memo ( Product )
