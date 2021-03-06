import { useState, Fragment, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { useRouter } from "next/router";
import * as Yup from "yup";
import Layout from '@/containers/Layout'
import { login } from "@/redux/actions/authAction";
import Google from "@/marketplace/containers/social-login/Google";
import { div, input } from "@windmill/react-ui";
import Button from '@/components/Buttons/Button'
import { GoMarkGithub as GithubIcon } from "react-icons/go";
import { Formik, Field, FieldArray } from "formik";
import { signup } from '@/redux/actions/'

const SignInPop = () => {
  let completeButtonRef = useRef(null);
  const dispatch = useDispatch();
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ error, setError ] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth);

  const validatorForm = Yup.object().shape({
                name: 
                    Yup.string()
                    .required("Required"),

                 email: 
                    Yup.string().email()
                    .required("Required"),

                password: Yup.string()
                    .required('No password provided.') 
                    .min(8, 'Password is too short - should be 8 chars minimum.')
                        .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                    ),
            })
  

    if(isAuthenticated){
              router.push('/')
            }

  return (
    <Layout>
      <div className="my-3 lg:w-2/5 mx-auto"> 
        <Formik
            initialValues={{
                name: "",
                email: '',
                password: "",
            }}

            validationSchema={validatorForm}
            validateOnChange={isSubmitting}
            validateOnBlur={isSubmitting}

            onSubmit= { async (values, {resetForm, validate}) => {

                let formData = {
                name: values.name,
                email: values.email,
                password: values.password
                };

                signup(formData).then(res => {
                    console.log(res)
                    if (res.user) {
                        router.push('/signin')
                    } else if (res.err) {
                        setError("User Already exists")
                    }
                })
                setIsSubmitting(true)
                resetForm({values: ''})

                //Redirect home if login successful
            
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
            
        <form className="p-3">
            <div className="">
            <main className="items-center justify-center">
                <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700">
                    Support and empower small businesses
                </h1>
                {/* Check whether the email and username are valid */}
                    {
                    error && isSubmitting && 
                        <div className="text text-red-500 my-3">
                        User already exists
                        </div>
                    }
                    {errors.name && (
                    <div className="input-feedback">{errors.name}</div>
                    )}
                <div className="border-box">
                    <input
                    className="focus:outline-none focus:ring focus:border-blue-500 w-full rounded-[12px] p-3 "
                    type="name"
                    placeholder="Name or Username"
                    value={values.name}
                    name="name"
                    id="name"
                    onChange={handleChange}
                    />
                </div>

                <div className="mt-4">  
                        {errors.email && (
                        <div className="input-feedback">{errors.email}</div>
                        )}
                    <div className="border-box">
                        <input
                        className="focus:outline-none focus:ring focus:border-blue-500 w-full rounded-[12px] p-3 "
                        type="email"
                        placeholder="Email"
                        value={values.email}
                        name="email"
                        id="email"
                        onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mt-4">  
                    {errors.password && (
                        <div className="input-feedback">{errors.password}</div>
                    )}
                    <div className="border-box">
                    <input
                        className="focus:outline-none focus:ring focus:border-blue-500 w-full rounded-[12px] p-3 "
                        value={values.password}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    className="mt-4 bg-Blue focus:outline-none focus:ring-2 focus:ring-Blue focus:ring-opacity-30 w-full text-white "
                    block
                >
                    Signup
                </Button>

                <hr className="my-6" />

                <Google />

                </div>
            </main>
            </div>
        </form>
            )}}
        </Formik>
        </div>
    </Layout>
  );
};

export default SignInPop;
