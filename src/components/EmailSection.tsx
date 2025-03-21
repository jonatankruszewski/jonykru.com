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

type FormData = {
    email: string;
    subject: string;
    message: string;
};

const EmailSection = () => {
    const [state, handleSubmit] = useFormSpreeForm<FormData>("xwpleawo");

    const {
        register,
        handleSubmit: useFormSubmit,
        // watch,
        // formState: {errors},
    } = useReactHookForm<FormData>()

    // React.useEffect(() => {
    //     if (!state.succeeded) {
    //         return;
    //     }
    //
    // }, [state.succeeded])

    //
    // const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     return handleSubmit({email, subject, message});
    // }

    return (
        <section id="contact" className='my-12 md:my-12 py-24'>
            <h2 className="text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
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
                    <form className="flex flex-col" onSubmit={useFormSubmit(handleSubmit)}>
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="text-white block mb-2 text-sm font-medium"
                            >
                                Your email
                            </label>
                            <input
                                {...register("email", {required: true})}
                                name="email"
                                type="email"
                                id="email"
                                required
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                                placeholder="jacob@google.com"
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="subject"
                                className="text-white block text-sm mb-2 font-medium"
                            >
                                Subject
                            </label>
                            <input
                                {...register("subject", {required: true})}
                                name="subject"
                                type="text"
                                id="subject"
                                required
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Just saying hi"
                            />
                        </div>
                        <label
                            htmlFor="message"
                            className="text-white block text-sm mb-2 font-medium"
                        >
                            Message
                        </label>
                        <textarea
                            {...register("message", {required: true})}
                            name="message"
                            id="message"
                            className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Let's talk about..."
                        />
                        <button
                            type="submit"
                            disabled={state.submitting}
                            className="bg-primary-500 hover:bg-primary-600 text-white cursor-pointer font-medium py-2.5 px-5 rounded-lg w-full"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default EmailSection;
