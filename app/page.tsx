"use client";

import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import InputForm from "./components/InputForm";
import BookPreview from "./components/BookPreview";

const Index: NextPage = () => {
  const [storyPages, setStoryPages] = useState<string[]>([]);

  return (
    <>
      <Head>
        <title>Children Book AI Generator</title>
        <meta
          name="description"
          content="Generate a children book using our AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            ChildrenBook <span className="highlighted-text">Generator</span>
          </h1>
          <div className="grid grid-cols-1 gap-4">
            <InputForm setStoryPages={setStoryPages} />
          </div>
        </div>
        <div className="container mb-14">
          <BookPreview pages={storyPages} />
        </div>
      </main>
    </>
  );
};

export default Index;
