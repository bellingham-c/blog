import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import { Sidebar } from '../components/Sidebar'
import Post from '../components/Post'
import Modal from '../components/Modal';
import { modalState } from '../atoms/midalAtom';
import { collection, doc, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import Comment from "../components/Comment"
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getProviders } from 'next-auth/react';
import Widgets from '../components/Widgets';
export default function PostPage({ trendingResults,
  followResults }: any) {
  // const {data:Session} = useSession()
  const router = useRouter()
  const { id } = router.query
  const [isOpen,] = useRecoilState(modalState);
  const [post, setPost] = useState<DocumentData>()
  const [comments, setComments] = useState([])
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "posts", id as string, "comments"), orderBy("timestamp", "desc")),
      (snapshot: any) => {
        setComments(snapshot.docs)
      }
    )
  }, [db, id])
  useEffect(() => onSnapshot(doc(db, "posts", id as string), (snapshot) => {
    setPost(snapshot.data())
  }), [db])
  return (
    <div className='dark text-black dark:text-white'>
      <Head>
        <title>{post?.username} on Blogs: &quot;{post?.text}&quot;</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='bg-white dark:bg-black min-h-screen flex max-w-[1500px] mx-auto'>
        <Sidebar></Sidebar>
        <div className='text-white flex-grow border-l border-r border-gray-700 
                  max-w-2xl sm:ml-[73px] xl:ml-[370px]'>
          <div className='flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold 
            text-xl gap-x-4 sticky top-0 z-50 bg-black'>
            <div className='hoverAnimition
               w-9 h-9 flex items-center justify-center xl:px-0'
              onClick={() => router.push("/")}>
              <ArrowLeftIcon className='h-5 text-white'></ArrowLeftIcon>
            </div>
            Tweet
          </div>
          <Post key={id as string} id={id as string} post={post} postPage />
          {
            comments.length > 0 && (
              <div className='pb-72'>
                {
                  comments.map(comment => {
                    return <Comment key={comment.id} comment={comment.data()} id={comment.id} />
                  })
                }
              </div>
            )
          }
        </div>
        <Widgets trendingResults={trendingResults} followResults={followResults}></Widgets>
        {isOpen && <Modal />}
      </main>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const res1 = [
    {
      "heading": "T20 World Cup 2021 · LIVE",
      "description": "NZvAUS: New Zealand and Australia clash in the T20 World Cup final",
      "img": "https://rb.gy/d9yjtu",
      "tags": [
        "#T20WorldCupFinal, ",
        "Kane Williamson"
      ]
    },
    {
      "heading": "Trending in United Arab Emirates",
      "description": "#earthquake",
      "img": "https://rb.gy/jvuy4v",
      "tags": [
        "#DubaiAirshow, ",
        "#gessdubai"
      ]
    },
    {
      "heading": "Trending in Digital Creators",
      "description": "tubbo and quackity",
      "img": "",
      "tags": [
        "QUACKITY AND TUBBO,"
      ]
    }
  ]
  const trendingResults = res1
  const res2 = [
    {
      "userImg": "https://rb.gy/urakiy",
      "username": "SpaceX",
      "tag": "@SpaceX"
    },
    {
      "userImg": "https://rb.gy/aluxgh",
      "username": "Elon Musk",
      "tag": "@elonmusk"
    },
    {
      "userImg": "https://rb.gy/zyvazm",
      "username": "Tesla",
      "tag": "@Tesla"
    }
  ]
  const followResults = res2
  // const providers = await getProviders();
  // const session = await getSession(context)
  return {
    props: {
      trendingResults,
      followResults,
      // providers,
      // session,
    },
  };
}

