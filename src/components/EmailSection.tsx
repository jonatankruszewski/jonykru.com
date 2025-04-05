"use client";
import React, {useEffect} from "react";
import GithubIcon from "/public/github-icon.svg";
import LinkedinIcon from "/public/linkedin-icon.svg";
import MediumIcon from "/public/medium-icon-white.svg";
import StackOverflow from "/public/stack-overflow-icon.svg";
import Link from "next/link";
import Image from "next/image";
import {useForm as useFormSpreeForm} from '@formspree/react';
import {FormProvider, useForm as useReactHookForm} from "react-hook-form"
import {Button} from "@headlessui/react";
import Section from "@/utils/Section";
import TextInput from "@/components/TextInput";
import TextAreaInput from "@/components/TextAreaInput";

type FormData = {
    email: string;
    subject: string;
    message: string;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const EmailSection = () => {
    const [state, handleSubmit] = useFormSpreeForm<FormData>("xwpleawo");
    const methods = useReactHookForm<FormData>({mode: 'onTouched'})
    const {handleSubmit: useFormSubmit, control} = methods;

    const onSubmit = (data: FormData) => {
        console.log(data)
        return handleSubmit(data);
    };

    useEffect(() => {
        if (state.succeeded){
            methods.reset({
                email: "",
                subject: "",
                message: ""
            })
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.succeeded]);

    return (
        <Section id="contact">
            <h2 className="text-center text-4xl font-bold text-white mb-12 mt-20">
                Let&apos;s Connect
            </h2>
            <div className="grid md:grid-cols-2 gap-4 relative">
                <div>
                    <p className="text-[#ADB7BE] mb-4 max-w-md">
                        I’m open to new projects and collaborations. If you&apos;re looking for a developer or have a
                        relevant opportunity, please feel free to reach out. I’ll get back to you as soon as possible.
                    </p>
                    <div className="socials flex flex-row gap-3 items-center">
                        <Link href="https://github.com/jonatankruszewski">
                            <Image width={48} src={GithubIcon} alt="Github Icon" className="rounded-lg"/>
                        </Link>
                        <Link href="https://www.linkedin.com/in/jonatankruszewski">
                            <Image width={48} src={LinkedinIcon} alt="Linkedin Icon" className="rounded-lg"/>
                        </Link>
                        <Link href="https://medium.com/@jonakrusze">
                            <Image width={48} src={MediumIcon} alt="Medium Icon" className="rounded-lg"/>
                        </Link>
                        <Link href="https://stackoverflow.com/users/17625486/jonatan-kruszewski">
                            <Image width={48} src={StackOverflow} alt="Medium Icon" className="rounded-lg"/>
                        </Link>
                    </div>
                </div>
                <div>
                    <FormProvider {...methods}>
                        <form className="flex flex-col" onSubmit={useFormSubmit(onSubmit)}>
                            <TextInput<FormData, 'email'>
                                label="Your Email"
                                control={control}
                                placeholder="jacob@google.com"
                                name={'email'}
                                rules={{
                                    required: "Email is required",
                                    maxLength: {
                                        value: 128,
                                        message: "Email must be at most 128 characters long",
                                    },
                                    validate: (value) => {
                                        if (!value.includes("@")) {
                                            return "Please include '@' in your email address";
                                        }
                                        return true;
                                    },
                                    pattern: {
                                        value: emailRegex,
                                        message: "Please enter a valid email address",
                                    },
                                }}
                                id="email"
                                autoComplete="email"
                            />
                            <TextInput<FormData, 'subject'>
                                label="Subject"
                                control={control}
                                name="subject"
                                type="text"
                                id="subject"
                                autoComplete="off"
                                placeholder="Just saying hi"
                                rules={{
                                    required: "Subject is required",
                                    maxLength: {
                                        value: 128, message: 'Subject must be at most 128 characters long',
                                    },
                                    minLength: {
                                        value: 4, message: "Subject must be at least 4 characters long"
                                    }
                                }}
                            />
                            <TextAreaInput<FormData, 'message'>
                                name="message"
                                label="Message"
                                control={control}
                                rules={
                                    {
                                        required: "Message is required",
                                        maxLength: {
                                            value: 256, message: 'Subject must be at most 256 characters long',
                                        },
                                    }
                                }/>
                            <Button
                                name="Send Message"
                                type="submit"
                                disabled={state.submitting}
                                className="self-center inline-block flex-shrink-0 max-w-min whitespace-nowrap border-2 border-gray-300 text-gray-200 hover:border-white hover:text-white cursor-pointer font-medium py-2.5 px-5 rounded-full"
                            >
                                Send Message
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </Section>
    );
};

export default EmailSection;
