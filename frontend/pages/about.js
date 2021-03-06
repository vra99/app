import React from 'react'
import {Fade, Slide, Zoom} from "react-reveal";
import Layout from '@/containers/Layout'
import Faq from '@/components/About/Faq'
import Build from "@/assets/lotties/build";
import { NextSeo } from 'next-seo';
import DisplayLottie from "@/components/DisplayLottie/DisplayLottie";
import { AiTwotoneShop, AiOutlineUser, AiOutlineMessage } from 'react-icons/ai'
import { BiCheckShield } from "react-icons/bi";

const About = () => {

    const textStyle = {
        fontWeight: "300",
        fontSize: "21px",
        lineHeight: "32px",
        color: "#424770"
    }

    const Features = () => (
        <div className="bg-Black py-8 lg:pb-28 mobile:-mt-14">
            <div className="lg:grid lg:grid-cols-2 lg:gap-5 container lg:w-3/5 mx-auto mobile:px-3">
                <Fade bottom duration={1000} distance="20px">
                    <div className="text-center my-auto lg:text-left lg:col-span-2">
                        <h1 className="text-3xl mobile:text-2xl font-bold text-white mb-5 mobile:mt-4">
                            How does Wabei work?
                        </h1>
                        <div className="grid gap-5 mobile:p-4 my-3 lg:grid-cols-3">
                            <Fade left duration={1000} distance="20px">
                                <div className="bg-lightBlack rounded-md p-3 text-Grey lg:p-6">
                                    <h1 className="text-lg font-bold my-1">1. Search the professional</h1>
                                    <p className="text-base"> Create an account and start connecting directly with professionals free of charge in the marketplace. </p>
                                </div>
                            </Fade>
                            <Fade right duration={1000} distance="20px">
                                <div className="bg-lightBlack rounded-md p-3 text-Grey lg:p-6">
                                    <h1 className="text-lg font-bold my-1">2. Contact the professional</h1>
                                    <p className="text-base"> 
                                        Check the professional's profile, reviews and projects. If you feel there is a good fit, do not hesitate to contact them directly to book their services.
                                    </p>
                                </div>
                            </Fade>
                            <Fade bottom duration={1000} distance="20px">
                                <div className="bg-lightBlack rounded-md p-3 text-Grey lg:p-6">
                                    <h1 className="text-lg font-bold my-1">3. Rate the professional</h1>
                                    <p className="text-base">In order to maintain Wabei's high quality platform, your reviews are what gives life to the marketplace. Once the job is completed succesfuly give your honest feedback</p>
                                </div>
                            </Fade>
                        </div>
                    </div>
                    <div className="skills-image mx-auto my-auto">
                        <DisplayLottie animationData={Build} />
                    </div>
                </Fade>
            </div>
        </div>
    )

    return (
        <>
           <NextSeo
            title="Wabei"
            description="Wabei is a marketplace to find reliable and cheap tradespersons. Wabei connects carpenters, plumbers, handyman and electricians directly to consumers. Find trusted handyman with Wabei."
            canonical="https://www.wabei.co.uk"
            openGraph={{
                title: 'Wabei',
                openGraph: {
                type: 'website',
                locale: 'en_IE',
                url: 'https://www.wabei.co.uk',
                description: 'Wabei is a marketplace to find reliable and cheap tradespersons. Wabei connects carpenters, plumbers, handyman and electricians directly to consumers. Find trusted handyman with Wabei.',
                image:
                    'https://prismic-io.s3.amazonaws.com/gary-blog%2F3297f290-a885-4cc6-9b19-3235e3026646_default.jpg',
                site_name: 'wabei.co.uk',
                imageWidth: 1200,
                imageHeight: 1200
                },
                twitter: {
                handle: '@wabei',
                cardType: 'summary_large_image'
                }
            }}  
         />
            <Layout>
                <div className="lg:grid lg:grid-cols-2 gap-5 relative overflow-hidden lg:my-12 mobile:-mb-24 lg:w-4/5 lg:mx-auto">
                    <div className="mx-auto border-box lg:rounded-md lg:mt-8 lg:order-2">
                        <img 
                            src="/workers.jpg" 
                            alt="Picture of the author"
                            className="lg:rounded-md"
                        />
                    </div>
                    <div className="lg:order-1">
                        <div className="z-20 mobile:px-5 container">
                            <div className="mobile:text-center lg:px-3 lg:text-left">
                                <h1 className="my-6 lg:my-10 text-3xl mobile:text-2xl font-bold">
                                    Our mission is to help you find affordable and trustworthy professionals for your project.
                                </h1>
                            </div>
                            <div>
                                <p style={textStyle} className="text-center lg:text-left">
                                    Wabei is a technology company that provides a marketplace for services. In Wabei's marketplace you can connect directly with reliable professionals free of charge. 
                                </p>
                            </div>
                        </div>
                        { /* strips design  */}
                        {/* <div className="SupportSite-BackgroundStripes z-50">
                            <div className="SupportSite-BackgroundStripes-Stripe-1" />
                            <div className="SupportSite-BackgroundStripes-Stripe-2" />
                            <div className="SupportSite-BackgroundStripes-Stripe-3" />
                        </div> */}
                        {/*  */}
                    </div>
                </div>
                {/* <!-- begin Separator --> */}
                    <div className="separator mobile:-mt-12 overflow-hidden">  
                        <svg className="separator__svg" width="100%" height="400" viewBox="0 0 100 100" preserveAspectRatio="none" fill="#222831" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 100 100 V 10 L 0 100"/>
                        <path d="M 30 73 L 100 18 V 10 Z" strokeWidth="0"/>
                        </svg>
                    </div>
                {/* <!-- end Separator --> */}
                <Features />
                <Faq />
            </Layout>
        </>
    )
}

export default About
