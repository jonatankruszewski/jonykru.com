"use client";
import React from "react";
import GithubIcon from "/public/github-icon.svg";
import LinkedinIcon from "/public/linkedin-icon.svg";
import MediumIcon from "/public/medium-icon-white.svg";
import StackOverflow from "/public/stack-overflow-icon.svg";
import Link from "next/link";
import Image from "next/image";
import {useForm as useFormSpreeForm} from '@formspree/react';
import {useForm as useReactHookForm} from "react-hook-form"
import {Button} from "@headlessui/react";
import Section from "@/utils/Section";
import {Info} from "lucide-react";

type FormData = {
    email: string;
    subject: string;
    message: string;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const EmailSection = () => {
    const [state, handleSubmit] = useFormSpreeForm<FormData>("xwpleawo");

    const {
        register,
        handleSubmit: useFormSubmit,
        // watch,
        formState,
        ...rest
    } = useReactHookForm<FormData>({mode: 'onTouched'})

    const {errors} = formState;

    const onSubmit = (data: FormData) => console.log(data);
    console.log({errors, rest, formState});

    // const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     return handleSubmit({email, subject, message});
    // }

    return (
        <Section id="contact">
            <h2 className="text-center text-4xl font-bold text-white mb-12 mt-20">
                Let&apos;s Connect
            </h2>
            <div className="grid md:grid-cols-2 gap-4 relative">
                <div>
                    <p className="text-[#ADB7BE] mb-4 max-w-md">
                        {" "}
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
                    <form className="flex flex-col" onSubmit={useFormSubmit(onSubmit)}>
                        <div className="mb-1">
                            <label
                                htmlFor="email"
                                className="text-white block mb-2 text-sm font-medium"
                            >
                                Your email
                            </label>
                            <input
                                {...register("email",
                                    {
                                        required: "Email is required",
                                        maxLength: {
                                            value: 64, message: 'Email must be at most 128 characters long',
                                        },
                                        pattern: {value: emailRegex, message: "Please enter a valid email address"}
                                    })}
                                name="email"
                                type="email"
                                id="email"
                                required
                                autoComplete="email"
                                className={`bg-[#18191E] border placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5 transition-all focus:outline-none ${
                                    errors.email ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-[#33353F] focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                }`}
                                placeholder="jacob@google.com"
                            />
                            {<div className="p-2 flex gap-2 text-[#9CA2A9] items-center min-h-[32px]">
                                {errors.email &&
                                    <>
                                        <Info size={16}/>
                                        <p className="text-xs">
                                            {errors.email.message}
                                        </p>
                                    </>}
                            </div>}
                        </div>
                        <div className="mb-1">
                            <label
                                htmlFor="subject"
                                className="text-white block text-sm mb-2 font-medium"
                            >
                                Subject
                            </label>
                            <input
                                {...register("subject", {required: true, maxLength: 120})}
                                name="subject"
                                type="text"
                                id="subject"
                                required
                                autoComplete="off"
                                className={`bg-[#18191E] border placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5 transition-all focus:outline-none ${
                                    errors.subject ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-[#33353F] focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                }`}
                                placeholder="Just saying hi"
                            />
                            {<div className="p-2 flex gap-2 text-[#9CA2A9] items-center min-h-[32px]">
                                {errors.subject &&
                                    <>
                                        <Info size={16}/>
                                        <p className="text-xs">
                                            {errors.subject.message}
                                        </p>
                                    </>}
                            </div>}
                        </div>
                        <div className="mb-1">
                            <label
                                htmlFor="message"
                                className="text-white block text-sm mb-2 font-medium"
                            >
                                Message
                            </label>
                            <textarea
                                autoComplete="off"
                                {...register("message", {required: true, maxLength: 500})}
                                name="message"
                                id="message"
                                className={`bg-[#18191E] border placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5 transition-all focus:outline-none ${
                                    errors.message ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-[#33353F] focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                }`}
                                placeholder="Let's talk about..."
                            />
                            {<div className="p-2 flex gap-2 text-[#9CA2A9] items-center min-h-[32px]">
                                {errors.message &&
                                    <>
                                        <Info size={16}/>
                                        <p className="text-xs">
                                            {errors.message.message}
                                        </p>
                                    </>}
                            </div>}
                        </div>
                        <Button
                            name="Send Message"
                            type="submit"
                            disabled={state.submitting}
                            className="bg-primary-500 hover:bg-primary-600 text-white cursor-pointer font-medium py-2.5 px-5 rounded-lg w-full"
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </Section>
    )
        ;
};

export default EmailSection;
