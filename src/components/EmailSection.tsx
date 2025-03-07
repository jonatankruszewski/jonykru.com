"use client";
import React, {useState} from "react";
import GithubIcon from "/public/github-icon.svg";
import LinkedinIcon from "/public/linkedin-icon.svg";
import MediumIcon from "/public/medium-icon-white.svg";
import StackOverflow from "/public/stack-overflow-icon.svg";
import Link from "next/link";
import Image from "next/image";
import {useForm} from '@formspree/react';

type FormData = {
    email: string;
    subject: string;
    message: string;
};

const EmailSection = () => {
    const [state, handleSubmit] = useForm<FormData>("xwpleawo");
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    React.useEffect(() => {
        if (!state.succeeded) {
            return;
        }

        setEmail("");
        setSubject("");
        setMessage("");

    }, [state.succeeded])


    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        return handleSubmit({email, subject, message});
    }

    return (
        <section id="contact" className='my-12 md:my-12 py-24'>
            <h2 className="text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
                Let's Connect
            </h2>
            <div className="grid md:grid-cols-2 gap-4 relative">
                <div
                    className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-80 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
                <div className="z-10">
                    <p className="text-[#ADB7BE] mb-4 max-w-md">
                        {" "}
                        I’m open to new projects and collaborations. If you're looking for a developer or have a
                        relevant opportunity, feel free to reach out. I’ll get back to you as soon as possible.
                    </p>
                    <div className="socials flex flex-row gap-2 items-center">
                        <Link href="https://github.com/jonatankruszewski">
                            <Image width={48} src={GithubIcon} alt="Github Icon"/>
                        </Link>
                        <Link href="https://www.linkedin.com/in/jonatankruszewski">
                            <Image width={48} src={LinkedinIcon} alt="Linkedin Icon"/>
                        </Link>
                        <Link href="https://medium.com/@jonakrusze">
                            <Image width={38} src={MediumIcon} alt="Medium Icon"/>
                        </Link>
                        <Link href="https://stackoverflow.com/users/17625486/jonatan-kruszewski">
                            <Image width={38} src={StackOverflow} alt="Medium Icon"/>
                        </Link>
                    </div>
                </div>
                <div>
                    <form className="flex flex-col" onSubmit={submit}>
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="text-white block mb-2 text-sm font-medium"
                            >
                                Your email
                            </label>
                            <input
                                onChange={e => setEmail(e.target.value)}
                                name="email"
                                type="email"
                                id="email"
                                required
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                                placeholder="jacob@google.com"
                                value={email}
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
                                onChange={e => setSubject(e.target.value)}
                                name="subject"
                                type="text"
                                id="subject"
                                required
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Just saying hi"
                                value={subject}
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="message"
                                className="text-white block text-sm mb-2 font-medium"
                            >
                                Message
                            </label>
                            <textarea
                                onChange={e => setMessage(e.target.value)}
                                name="message"
                                id="message"
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Let's talk about..."
                                value={message}
                            />
                        </div>
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
