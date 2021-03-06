import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from '@windmill/react-ui'
import _ from 'lodash'
import { AiFillFileImage, AiOutlineClose, AiFillTags } from "react-icons/ai";
import PageHeader from '@/admin/components/Header/PageHeader'
import Button from '@/components/Buttons/Button'
import * as Yup from "yup";
import withAuth from '@/components/auth'
import Dropzone from "react-dropzone";
import { getCategories } from "@/redux/actions/categoryAction";
import  { getLocations } from '@/redux/actions/productAction' 
import { Formik,  Field, FieldArray } from "formik";
import 'react-quill/dist/quill.snow.css';
import { loadUser, userProfileUpdate } from "@/redux/actions/authAction";
import Layout from '@/admin/containers/Layout'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })


const Profile = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const { user } = useSelector((state) => state.auth);
  const { locations } = useSelector((state) => state.locations); 
  const [load, setload] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ isCreated, setIsCreated] = useState(false)

  useEffect(() => {
    dispatch(getLocations())
    dispatch(getCategories());
  }, [])

  const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 150,
  height: 150,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const title = "text-lg font-bold text-Black-medium pb-1";

  const validatorForm = Yup.object().shape({
                name: 
                    Yup.string()
                    .required("Required"),
                title: 
                    Yup.string()
                    .required("Required"),
                locations:
                    Yup.array()
                        .required('Enter a location')
                        .min(1, 'Enter a location')
                        .max(6, 'You cannot enter more than four locations'),
                categories:
                    Yup.array() 
                        .required('Enter a category')
                        .min(1, 'Enter a category')
                        .max(4, 'You cannot enter more than four categories'),
                mobile: 
                    Yup.string()
                      .matches(/^[0-9]+$/, "Must be only digits")
                      .min(7, 'Number does not contain enough numbers ')
                      .max(15, 'The number contains too many numbers pal'),
                skills:
                    Yup.array()
                        .required('Enter a skill')
                        .min(1, 'Enter a skill')
                        .max(4, 'You cannot enter more than four skills'),
                photos: 
                    Yup.mixed()
                    .required("A photo is required"),
            })

  return (
    <Layout>
      <PageHeader title="Profile" />
      <div className="mt-6">
        <div className="">
          <div className="my-6">
           <Formik
          initialValues={{ 
            name: user.name,
            about: user.about ? user.about : '',
            file: [],
            photos: user.photos ? user.photos : [],
            title: user.title ? user.title : "",
            locations:user.locations ? user.locations : [],
            skills: user.skills ? user.skills : [],
            categories: user.categories ? user.categories : [],
            mobile: user.mobile ? user.mobile : "",
            summary: user.summary ? user.summary : "",
          }}

          validationSchema={validatorForm}
          validateOnChange={isSubmitting}
          validateOnBlur={isSubmitting}

          onSubmit= { async (values, {resetForm, validate}) => {
            
            let formData = new FormData();

            formData.append("name", values.name);
            formData.append("title", values.title);
            formData.append("about", values.about);
            formData.append("mobile", values.mobile);
            formData.append("summary", values.summary);

            formData.append("file", values.file)

            for (let i = 0; i <= values.photos.length; i++) {
              values.photos[i] !== undefined && formData.append(`photos`, values.photos[i] );
            }
          

          // to add current photos and remove the ones that are not included anymore
          var currentPhoto = []
          for (let i = 0; i <= values.photos.length; i++) {
              values.photos[i] !== undefined && currentPhoto.push({
                url:values.photos[i].url,
                id:values.photos[i]._id,
                public_id:values.photos[i].public_id
              });
            }
          formData.append("currentPhoto", JSON.stringify(currentPhoto))
          
           // we loop the skills array and assign a value to each task in the form, if any tag is undefined its value will not be looped.           
           for (let i = 0; i <= values.skills.length; i++) {
             values.skills[i] !== undefined && formData.append(`skills`, values.skills[i] );
            }

              // we loop the skills array and assign a value to each task in the form, if any tag is undefined its value will not be looped.           
           for (let i = 0; i <= values.categories.length; i++) {
             values.categories[i] !== undefined && formData.append(`categories`, values.categories[i] );
            }
            
            // we loop the skills array and assign a value to each task in the form, if any tag is undefined its value will not be looped.           
            for (let i = 0; i <= values.locations.length; i++) {
              values.locations[i] !== undefined && formData.append(`locations`, values.locations[i] );
            }
            
            dispatch(userProfileUpdate(formData))
            dispatch(loadUser)
            setIsCreated(true)
          }}>

        {(formik) => {
        const {
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          setFieldValue,
          handleBlur,
          isValid,
          dirty
        } = formik;

          return (
            <div className="bg-white rounded-md relative">
              <div className="p-6 mobile:px-3 relative">
                <form 
                      onSubmit={handleSubmit} 
                      className=""
                      encType="multipart/form-data"
                >
                <div className="">
                  <div className="">
                    <div className=""></div>

                    <div> 
                      <h2
                        className={title}
                      >
                        About
                      </h2>
                        <Field name="about">
                            {({ field }) => <ReactQuill className="products" value={field.value} onChange={field.onChange(field.name)} />}
                        </Field>
                        {errors.about && (
                            <div className="input-feedback">{errors.about}</div>
                        )}
                    </div>
                  </div>

                  <div className="">
                    <div className="">
                      <div className="py-8">
                        <h2
                          className={title}
                        >
                          Name
                        </h2>
                        {errors.name && (
                          <div className="input-feedback">{ errors.name }</div>
                        )}
                        <div className="border-box">
                          <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            value={values.name}
                            id="name"
                            autoComplete="given-name"
                            className="focus:outline-none focus:ring focus:border-blue-500 w-full rounded-[12px] p-3 "
                          />
                        </div>
                      </div>

                      <div className="py-8">
                        <h2
                          className={title}
                        >
                          Job Title 
                        </h2>
                        {errors.title && (
                          <div className="input-feedback">{ errors.title }</div>
                        )}
                        <div className="border-box">
                          <input
                            type="text"
                            name="title"
                            onChange={handleChange}
                            value={values.title}
                            id="title"
                            autoComplete="given-name"
                            className="focus:outline-none focus:ring focus:border-blue-500 w-full rounded-[12px] p-3 "
                          />
                        </div>
                      </div>
                      
                      <div className="py-8">
                        <h2
                          className={title}
                        >
                          Summary <span className="text italic">(brief description of what you do) </span>
                        </h2>
                        {errors.summary && (
                          <div className="input-feedback">{ errors.summary }</div>
                        )}
                        <div className="border-box">
                          <textarea
                            type="text"
                            name="summary"
                            onChange={handleChange}
                            value={values.summary}
                            id="summary"
                            autoComplete="given-name"
                            className="focus:outline-none focus:ring focus:border-blue-500 w-full rounded-[12px] p-3 "
                          />
                        </div>
                      </div>

                      <div className="py-8">
                        <h2
                          className={title}
                        >
                          Mobile
                        </h2>
                        {errors.mobile && (
                          <div className="input-feedback">{ errors.mobile }</div>
                        )}
                        <div className="border-box">
                          <input
                            type="number"
                            name="mobile"
                            value={values.mobile}
                            onChange={handleChange}
                            id="mobile"
                            autoComplete="mobile-number"
                            className="focus:outline-none focus:ring focus:border-blue-500 w-full rounded-[12px] p-3 "
                          />
                        </div>
                      </div>
                    </div>
                    <div className='py-8'>
                      <h2
                        className={title}
                      >
                        Skills
                      </h2>
                      
                      <em className="text-xs text-Black-medium"> Add or change skills (up to 4) so buyers know more about your product </em>
                      <div className="Form">
                          <div className="TagForm mt-3">
                              <AiFillTags className="InputIcon text-lg mx-2" />
                              <input
                                  className="p-2"
                                  type="text"
                                  placeholder="Add a skill..."
                                  onKeyPress={event => {
                                      if (event.key === "Enter") {
                                          event.preventDefault();
                                          values.skills.length < 4 && event.target.value !== "" && setFieldValue( "skills" ,[...values.skills, event.target.value]);
                                          event.target.value = "";
                                      }
                                  }}
                              />
                          </div>
                          <ul className="TagList">
                              {values.skills && values.skills.map((tag, i) => (
                                  <li 
                                      className="Tag capitalize mb-5"
                                      key = {i}
                                  >
                                  {tag}
                                  <AiOutlineClose
                                      className="TagIcon text-lg ml-2"
                                      onClick={() => {
                                      setFieldValue("skills", [...values.skills.filter(word => word !== tag)]);
                                      }}
                                  />
                                  </li>
                              ))}
                          </ul>
                      </div>S
                      {errors.skills && (
                          <div className="input-feedback -m-mt-2">{ errors.skills }</div>
                      )}
                  </div>
                        
                    <div className="py-8 ">
                        <h2 className={title}> Categories you cover </h2>
                          { categories &&
                              categories.map((c, i) => (
                              <div className="form-check" key={i}>
                                <input 
                                      className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
                                      name="categories" 
                                      id="categories"
                                      value={c._id}
                                      onChange={(event) => setFieldValue( "categories" ,[...values.categories, event.target.value])}
                                      type="checkbox" 
                                />
                                <label className="form-check-label inline-block text-gray-800" htmlFor="categories">
                                  {c.name}
                                </label>
                              </div>
                          ))}
                      {errors.categories && (
                        <div className="input-feedback">{errors.categories}</div>
                      )}
                  </div>

                  <div className="py-8 ">
                      <h2 className={title}> Locations that you cover </h2>
                      <div className="m-auto">
                        <select     
                                    className="Selection mt-1 p-2 rounded-md shadow-button bg-white capitalize mobile:w-full" 
                                    name="locations" 
                                    id="locations"
                                    value={values.locations}
                                    onChange={handleChange}
                                    multiple="multiple"
                        >

                          { locations &&
                              locations.map((c, i) => (
                              <option className="px-2" key={i} value={c._id}>
                                  {c.location}
                              </option>
                          ))}
                        </select>
                      </div>
                      {errors.locations && (
                        <div className="input-feedback">{errors.locations}</div>
                      )}
                  </div>
                  <div className=" py-8">
                      <div>
                      <h2 className={title}> 
                          Add media 
                          <em className="text-xs text-Black-medium pl-2">(Include high-quality images of your work to attract more customers.)</em>
                      </h2>
                          <FieldArray
                              name="photos"
                              render={arrayHelpers => (
                          <>
                          <Dropzone  
                              accept="image/jpeg, image/png, image/webp"
                              minSize={1024}
                              maxSize={3072000}
                              onDrop={(acceptedFiles) => {
                          // on drop we add to the existing files
                          setFieldValue("photos", values.photos.concat(acceptedFiles.map(file => Object.assign(file, {
                              preview: URL.createObjectURL(file)
                          }))));
                          }}>
                                  {({ getRootProps, getInputProps }) => (
                          <section className="container p-2 border-box lg:w-3/5">
                              <div {...getRootProps({ className: "dropzone text-center" })}>
                                  <input name="file" {...getInputProps()} />
                                  <div clasName="p-2 mx-auto">
                                      <AiFillFileImage className="my-auto h-12 w-12 m-auto"/>
                                      <div className="my-3 shadow-button rounded cursor-pointer hover:shadow-hover w-1/2 text-center m-auto p-1 "> Add Files </div>
                                  </div>
                              </div>
                          </section>
                      )}
                          </Dropzone>
                              <div className="px-4 my-2">
                              <strong>Files:</strong>
                              <ul className="list-disc my-2">
                                  <aside style={thumbsContainer}>
                                      {values.photos?.map((data, i) => {
                                          return (
                                          <div style={thumb} key={data.name} className="relative">
                                              <div style={thumbInner}>
                                                  <img
                                                  alt="preview"
                                                  src={data.preview ? data.preview : data.url }
                                                  style={img}
                                                  />
                                              </div>
                                              <div className=" absolute top-2 right-1 z-50">     
                                                  <button
                                                      className="rounded-full w-5 h-5 bg-Grey-light p-0 border-0 inline-flex items-center justify-center text-white"
                                                      onClick={ () => arrayHelpers.remove(i) }>
                                                      <AiOutlineClose className="w-3 h-3"/>
                                                  </button>
                                              </div>
                                          </div>
                                          )
                                      })}
                                  </aside>
                              </ul>
                              {errors.photos && (
                              <div className="input-feedback">{errors.photos}</div>
                              )}
                          </div>
                          </>
                          )}
                          />
                      </div>
                  </div>






                  
                  </div>
                </div>
                <div className="px-4 py-3 text-right sm:px-6">
                  <Button
                    type="submit"
                    className=" bg-Blue text-white font-bold px-5"
                  >
                  Save
                  </Button>
              </div>
              </form>
            </div>
            </div>

          )} 
        }
        </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(Profile);